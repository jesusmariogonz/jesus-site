"use client";

import { useEffect, useState } from "react";

/* Medidor tipo velocímetro del Indicador de Estrés (EXP-001, EXPERIMENTAL).
   Lee el JSON público que publica el repo del laboratorio cada día hábil; no
   se despliega el sitio para actualizarlo. Nunca inventa un valor: si no
   puede leer el JSON, lo dice. */

const URL_LATEST =
  "https://raw.githubusercontent.com/jesusmariogonz/pulso-research-lab/main/public/emergency/latest.json";

const BANDAS = [
  { nombre: "Normal", color: "#16a34a" },
  { nombre: "Vigilancia", color: "#84cc16" },
  { nombre: "Defensivo", color: "#eab308" },
  { nombre: "Emergencia", color: "#f97316" },
  { nombre: "Crisis", color: "#dc2626" },
];

const DIM_ETIQUETAS = {
  trend: "Tendencia",
  vol: "Volatilidad",
  correlation: "Correlación entre sectores",
  credit: "Crédito",
  breadth: "Amplitud (RSP/SPY)",
  drawdown_velocity: "Velocidad de la caída",
};

const CX = 150;
const CY = 150;
const R = 120;

function punto(fraccion, radio) {
  // fracción 0 = extremo izquierdo (180°), 1 = extremo derecho (0°)
  const ang = Math.PI * (1 - fraccion);
  return [CX + radio * Math.cos(ang), CY - radio * Math.sin(ang)];
}

function arco(f0, f1, rExt, rInt) {
  const [x0, y0] = punto(f0, rExt);
  const [x1, y1] = punto(f1, rExt);
  const [x2, y2] = punto(f1, rInt);
  const [x3, y3] = punto(f0, rInt);
  return `M ${x0} ${y0} A ${rExt} ${rExt} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${rInt} ${rInt} 0 0 0 ${x3} ${y3} Z`;
}

function colorDe(gauge) {
  const i = Math.min(4, Math.max(0, Math.floor((gauge / 100) * 5)));
  return BANDAS[i].color;
}

export default function EmergencyGauge() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let vivo = true;
    fetch(URL_LATEST, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => vivo && setDatos(j))
      .catch(() => vivo && setError(true));
    return () => {
      vivo = false;
    };
  }, []);

  if (error) {
    return <p className="gauge-aviso">El indicador no está disponible en este momento. Se publica cada día hábil después del cierre.</p>;
  }
  if (!datos) return <p className="gauge-aviso">Cargando indicador…</p>;
  if (datos.status === "SIN_DATOS" || datos.gauge == null) {
    return <p className="gauge-aviso">Todavía no hay suficiente historia para calcular el indicador.</p>;
  }

  const gauge = Math.min(100, Math.max(0, datos.gauge));
  const angulo = -90 + gauge * 1.8; // -90° = izquierda, +90° = derecha
  const color = colorDe(gauge);
  const nivel = BANDAS[Math.min(4, Math.max(0, datos.level))];

  return (
    <div className="gauge-card">
      <div className="gauge-cabecera">
        <span className="gauge-badge">EXPERIMENTAL</span>
        <span className="gauge-fecha">Datos al {datos.data_through}</span>
      </div>

      <svg viewBox="0 0 300 175" className="gauge-svg" role="img" aria-label={`Indicador de estrés: ${gauge.toFixed(0)} de 100, nivel ${nivel.nombre}`}>
        {BANDAS.map((b, i) => (
          <path key={b.nombre} d={arco(i / 5, (i + 1) / 5, R, R - 26)} fill={b.color} opacity="0.9" stroke="var(--surface)" strokeWidth="2" />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const [x, y] = punto(i / 5, R + 12);
          return (
            <text key={i} x={x} y={y + 4} textAnchor="middle" fontSize="10" fill="var(--ink-soft)">
              {i * 20}
            </text>
          );
        })}
        <g style={{ transform: `rotate(${angulo}deg)`, transformOrigin: `${CX}px ${CY}px`, transition: "transform 0.9s cubic-bezier(.2,.8,.2,1)" }}>
          <line x1={CX} y1={CY} x2={CX} y2={CY - (R - 8)} stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        </g>
        <circle cx={CX} cy={CY} r="9" fill="var(--ink)" />
        <circle cx={CX} cy={CY} r="3.5" fill="var(--surface)" />
      </svg>

      <div className="gauge-lectura">
        <span className="gauge-valor" style={{ color }}>{gauge.toFixed(0)}</span>
        <span className="gauge-nivel" style={{ color }}>{nivel.nombre.toUpperCase()}</span>
      </div>
      <p className="gauge-sub">
        La aguja marca el estrés de hoy (0–100). El nivel confirmado exige que la señal persista varios días, así que
        puede ir un paso detrás de la aguja.
      </p>

      <div className="gauge-dims">
        {Object.entries(DIM_ETIQUETAS).map(([k, etiqueta]) => {
          const g = datos.dimension_gauges?.[k];
          return (
            <div key={k} className="gauge-dim">
              <span className="gauge-dim-etiqueta">{etiqueta}</span>
              <span className="gauge-dim-barra">
                <span className="gauge-dim-relleno" style={{ width: `${g == null ? 0 : Math.min(100, Math.max(0, g))}%`, background: g == null ? "transparent" : colorDe(g) }} />
              </span>
              <span className="gauge-dim-valor">{g == null ? "—" : g.toFixed(0)}</span>
            </div>
          );
        })}
      </div>

      <p className="gauge-disclaimer">{datos.disclaimer}</p>
    </div>
  );
}
