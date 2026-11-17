"use client";

import { useEffect, useRef, useState } from "react";

/* Medidor pequeño de riesgo y volatilidad (0–100) de Pulso de Mercado.
   Lee /api/risk-meter, que se recalcula a diario con precios públicos. Nunca
   inventa un valor: si el cálculo no está disponible, lo dice. */

const BANDAS = [
  { nombre: "Muy bajo", color: "#16a34a" },
  { nombre: "Bajo", color: "#84cc16" },
  { nombre: "Moderado", color: "#eab308" },
  { nombre: "Alto", color: "#f97316" },
  { nombre: "Extremo", color: "#dc2626" },
];
const ETIQUETAS = {
  implicita: "Volatilidad implícita",
  realizada: "Volatilidad realizada",
  drawdown: "Caída desde máximos",
  correlacion: "Correlación entre activos",
  cola: "Riesgo de cola",
  estres: "Estrés de mercado",
};

const CX = 110;
const CY = 108;
const R = 86;
const RI = 62;

function punto(f, r) {
  const a = Math.PI * (1 - f);
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)];
}
function arco(f0, f1) {
  const [x0, y0] = punto(f0, R);
  const [x1, y1] = punto(f1, R);
  const [x2, y2] = punto(f1, RI);
  const [x3, y3] = punto(f0, RI);
  return `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${RI} ${RI} 0 0 0 ${x3} ${y3} Z`;
}
function colorDe(score) {
  return BANDAS[Math.min(4, Math.max(0, Math.floor(score / 20.0001)))].color;
}

function useContador(destino, ms = 900) {
  const [v, setV] = useState(0);
  const raf = useRef();
  useEffect(() => {
    if (destino == null) return;
    const reducido = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducido) {
      setV(destino);
      return;
    }
    const t0 = performance.now();
    const paso = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(Math.round(destino * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(paso);
    };
    raf.current = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf.current);
  }, [destino, ms]);
  return v;
}

function Sparkline({ historial, color }) {
  if (!historial || historial.length < 3) return null;
  const W = 220;
  const H = 38;
  const n = historial.length;
  const xs = (i) => (i / (n - 1)) * (W - 8) + 4;
  // Escala ajustada al rango real de la ventana (con margen), para que se note el movimiento
  const min = Math.max(0, Math.min(...historial.map((h) => h.score)) - 6);
  const max = Math.min(100, Math.max(...historial.map((h) => h.score)) + 6);
  const ys = (s) => H - 4 - ((s - min) / Math.max(1, max - min)) * (H - 8);
  const d = historial.map((h, i) => `${i === 0 ? "M" : "L"} ${xs(i).toFixed(1)} ${ys(h.score).toFixed(1)}`).join(" ");
  const ult = historial[n - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="rm-spark" role="img" aria-label={`Historial de los últimos ${n} días`}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" className="rm-spark-linea" pathLength="1" />
      <circle cx={xs(n - 1)} cy={ys(ult.score)} r="7" fill={color} className="rm-pulso" />
      <circle cx={xs(n - 1)} cy={ys(ult.score)} r="3" fill={color} />
    </svg>
  );
}

export default function RiskMeter() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let vivo = true;
    fetch("/api/risk-meter")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => {
        if (!vivo) return;
        if (!j.ok) setError(true);
        else {
          setDatos(j);
          requestAnimationFrame(() => requestAnimationFrame(() => vivo && setListo(true)));
        }
      })
      .catch(() => vivo && setError(true));
    return () => {
      vivo = false;
    };
  }, []);

  const valor = useContador(datos?.score);

  if (error) {
    return (
      <div className="rm-card">
        <div className="rm-cab">
          <span className="rm-titulo">Riesgo y volatilidad</span>
          <span className="rm-badge">EXPERIMENTAL</span>
        </div>
        <p className="rm-aviso">El medidor no está disponible en este momento. Se recalcula cada día hábil.</p>
      </div>
    );
  }
  if (!datos) {
    return (
      <div className="rm-card">
        <div className="rm-cab">
          <span className="rm-titulo">Riesgo y volatilidad</span>
          <span className="rm-badge">EXPERIMENTAL</span>
        </div>
        <p className="rm-aviso">Calculando…</p>
      </div>
    );
  }

  const score = datos.score;
  const color = colorDe(score);
  const angulo = listo ? -90 + score * 1.8 : -90;
  const d = datos.delta1d;
  const comps = Object.entries(datos.componentes).filter(([, v]) => v);

  return (
    <div className="rm-card">
      <div className="rm-cab">
        <span className="rm-titulo">Riesgo y volatilidad</span>
        <span className="rm-badge">EXPERIMENTAL</span>
      </div>

      <svg viewBox="0 0 220 124" className="rm-gauge" role="img" aria-label={`Riesgo de mercado: ${score} de 100, nivel ${datos.nivel}`}>
        {BANDAS.map((b, i) => (
          <path key={b.nombre} d={arco(i / 5, (i + 1) / 5)} fill={b.color} opacity="0.92" stroke="var(--surface)" strokeWidth="2" />
        ))}
        <g className="rm-aguja" style={{ transform: `rotate(${angulo}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
          <line x1={CX} y1={CY} x2={CX} y2={CY - (R - 4)} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx={CX} cy={CY} r="11" fill={color} opacity="0.28" className="rm-pulso" />
        <circle cx={CX} cy={CY} r="7" fill="var(--ink)" />
        <circle cx={CX} cy={CY} r="2.6" fill="var(--surface)" />
      </svg>

      <div className="rm-lectura">
        <span className="rm-valor" style={{ color }}>{valor}</span>
        <span className="rm-nivel" style={{ color }}>{datos.nivel.toUpperCase()}</span>
        <span className={`rm-delta ${d > 0 ? "sube" : d < 0 ? "baja" : ""}`}>
          {d > 0 ? "▲" : d < 0 ? "▼" : "•"} {d > 0 ? "+" : ""}
          {d} vs. ayer
        </span>
      </div>

      <Sparkline historial={datos.historial} color={color} />
      <div className="rm-spark-pie">últimos {datos.historial.length} días (escala ajustada al rango)</div>

      <button type="button" className="rm-toggle" onClick={() => setAbierto((v) => !v)} aria-expanded={abierto}>
        {abierto ? "Ocultar detalle" : "¿Por qué?"}
      </button>

      {abierto && (
        <div className="rm-detalle">
          {comps.map(([k, v]) => (
            <div key={k} className="rm-fila" title={v.detalle}>
              <span className="rm-fila-etq">{ETIQUETAS[k]}</span>
              <span className="rm-fila-barra">
                <span className="rm-fila-relleno" style={{ width: `${v.score}%`, background: colorDe(v.score) }} />
              </span>
              <span className="rm-fila-val">{v.score}</span>
              <span className="rm-fila-det">{v.detalle}</span>
            </div>
          ))}
          {datos.faltantes?.length > 0 && (
            <p className="rm-aviso">Sin datos hoy para: {datos.faltantes.join(", ")}; el puntaje usa los componentes disponibles.</p>
          )}
          <p className="rm-metodo">{datos.metodo}</p>
        </div>
      )}

      <p className="rm-pie">
        Datos al {datos.fecha} · se recalcula cada día hábil. {datos.aviso}
      </p>
    </div>
  );
}
