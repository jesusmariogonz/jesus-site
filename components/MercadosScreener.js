"use client";

import { useEffect, useMemo, useState } from "react";
import Sparkline from "@/components/Sparkline";

const COLORES = ["#4f8cff", "#22c39a", "#a78bfa", "#f2b84a", "#f2814a", "#5fd0f2", "#e05fd8", "#d64545", "#ffd166", "#06d6a0"];
const MAX_COMPARAR = 5;

const RANGOS = [
  { id: "1W", etiqueta: "1W", ruedas: 5 },
  { id: "1M", etiqueta: "1M", ruedas: 21 },
  { id: "3M", etiqueta: "3M", ruedas: 63 },
  { id: "6M", etiqueta: "6M", ruedas: 126 },
  { id: "1A", etiqueta: "1A", ruedas: 252 },
  { id: "3A", etiqueta: "3A", ruedas: 756 },
];

// Los 10 indicadores que se pidieron: los primeros 6 se calculan con datos
// reales de precio/volumen (Yahoo Finance) ya disponibles en el screener.
// Los últimos 4 (crecimiento de ingresos, EPS, ROIC, P/E forward) requieren
// datos fundamentales que esta fuente gratuita no provee de forma confiable
// todavía — quedan deshabilitados en vez de mostrar un número inventado.
const INDICADORES = [
  {
    id: "retorno12m",
    etiqueta: "Rendimiento 12 meses",
    formula: "(Pₜ / Pₜ₋₂₅₂ − 1) × 100",
    uso: "Identifica activos con buen desempeño de largo plazo.",
    disponible: true,
    formato: (v) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`),
  },
  {
    id: "fuerzaRelativa",
    etiqueta: "Fuerza relativa vs. mercado",
    formula: "Rendimiento del activo − rendimiento del S&P 500",
    uso: "Detecta activos que superan al mercado.",
    disponible: true,
    formato: (v) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(1)} pp`),
  },
  {
    id: "tendenciaAlcista",
    etiqueta: "Tendencia de largo plazo",
    formula: "Precio > SMA 200 días",
    uso: "Filtra activos cuya tendencia principal es alcista.",
    disponible: true,
    formato: (v) => (v == null ? "—" : v ? "Alcista" : "Bajista"),
  },
  {
    id: "sma200Pendiente",
    etiqueta: "Pendiente de SMA 200",
    formula: "SMA 200 actual vs. SMA 200 de hace 20 días",
    uso: "Confirma si la tendencia está mejorando.",
    disponible: true,
    formato: (v) => (v == null ? "—" : v >= 0 ? "Mejorando" : "Empeorando"),
  },
  {
    id: "crecimientoIngresos",
    etiqueta: "Crecimiento de ingresos",
    formula: "Variación interanual de ventas (%)",
    uso: "Evalúa si el negocio está creciendo.",
    disponible: false,
  },
  {
    id: "crecimientoEPS",
    etiqueta: "Crecimiento de EPS",
    formula: "Variación interanual del EPS",
    uso: "Identifica empresas con crecimiento de beneficios.",
    disponible: false,
  },
  {
    id: "roic",
    etiqueta: "Rentabilidad sobre capital (ROIC)",
    formula: "NOPAT / capital invertido",
    uso: "Evalúa la eficiencia con la que la empresa genera rendimientos.",
    disponible: false,
  },
  {
    id: "peForward",
    etiqueta: "Valoración (P/E forward)",
    formula: "Precio / EPS esperado a 12 meses",
    uso: "Ayuda a detectar valoraciones exigentes o razonables.",
    disponible: false,
  },
  {
    id: "volatilidadAnualizada",
    etiqueta: "Volatilidad anualizada",
    formula: "Desv. estándar de retornos diarios × √252",
    uso: "Compara el riesgo histórico de los activos.",
    disponible: true,
    formato: (v) => (v == null ? "—" : `${(v * 100).toFixed(1)}%`),
  },
  {
    id: "liquidezPromedio",
    etiqueta: "Liquidez promedio",
    formula: "Precio × volumen promedio de 20 días",
    uso: "Evita activos difíciles o costosos de operar.",
    disponible: true,
    formato: (v) =>
      v == null
        ? "—"
        : `$${(v / 1e6).toLocaleString("es-MX", { maximumFractionDigits: 1 })}M`,
  },
];

function fmtPct(v) {
  if (v == null) return "—";
  return `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;
}

function ThConExplicacion({ titulo, explicacion }) {
  return (
    <th>
      <details className="screener-th-info">
        <summary>{titulo}</summary>
        <div className="screener-th-tooltip">{explicacion}</div>
      </details>
    </th>
  );
}

const EXPLICACIONES = {
  retorno:
    "Retorno anualizado: el promedio de los retornos diarios (en log) de los últimos ~180 días, proyectado a un año (×252 días de trading). Es cuánto hubiera rendido el activo en un año si mantuviera ese mismo ritmo — no una predicción, un promedio histórico.",
  volatilidad:
    "Volatilidad anualizada: qué tanto se mueve el precio día a día, medido como la desviación estándar de los retornos diarios y proyectado a un año. Más alta = oscilaciones más bruscas (mayor riesgo), no necesariamente peor desempeño.",
  sharpe:
    "Sharpe: retorno anualizado menos una tasa libre de riesgo (~4.5%, aprox. de un bono del Tesoro), dividido entre la volatilidad anualizada. Mide cuánto retorno dio el activo por cada unidad de riesgo tomado — más alto es mejor; negativo significa que ni siquiera superó la tasa libre de riesgo.",
};

export default function MercadosScreener() {
  const [data, setData] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [seleccion, setSeleccion] = useState([]);
  const [rango, setRango] = useState("6M");
  const [indicador, setIndicador] = useState("retorno12m");

  useEffect(() => {
    fetch("/api/mercados/screener")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ rows: [] }));
  }, []);

  const filas = useMemo(() => {
    if (!data?.rows) return [];
    return data.rows.filter((r) => {
      if (!r.disponible) return false;
      if (!busqueda.trim()) return true;
      const q = busqueda.toLowerCase();
      return r.symbol.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
    });
  }, [data, busqueda]);

  function toggle(symbol) {
    setSeleccion((prev) => {
      if (prev.includes(symbol)) return prev.filter((s) => s !== symbol);
      if (prev.length >= MAX_COMPARAR) return prev;
      return [...prev, symbol];
    });
  }

  if (!data) {
    return <p className="screener-cargando">Cargando precios en vivo…</p>;
  }

  const seleccionadas = (data.rows || []).filter(
    (r) => seleccion.includes(r.symbol) && r.historial?.length > 1
  );

  return (
    <div className="mercados-screener">
      <div className="screener-controles">
        <input
          type="text"
          placeholder="Buscar símbolo o nombre…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <span className="screener-conteo">{filas.length} activos</span>
      </div>

      <div className="screener-tabla-wrap">
        <table className="screener-tabla">
          <thead>
            <tr>
              <th aria-label="Comparar"></th>
              <th>Activo</th>
              <th>Precio</th>
              <th>Tendencia</th>
              <ThConExplicacion titulo="Retorno anual." explicacion={EXPLICACIONES.retorno} />
              <ThConExplicacion titulo="Volatilidad" explicacion={EXPLICACIONES.volatilidad} />
              <ThConExplicacion titulo="Sharpe" explicacion={EXPLICACIONES.sharpe} />
            </tr>
          </thead>
          <tbody>
            {filas.map((r) => (
              <tr key={r.symbol}>
                <td>
                  <input
                    type="checkbox"
                    checked={seleccion.includes(r.symbol)}
                    disabled={!seleccion.includes(r.symbol) && seleccion.length >= MAX_COMPARAR}
                    onChange={() => toggle(r.symbol)}
                    aria-label={`Comparar ${r.symbol}`}
                  />
                </td>
                <td>
                  <strong>{r.symbol}</strong>
                  <span className="screener-nombre">{r.name}</span>
                </td>
                <td>
                  {r.price != null
                    ? r.price.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : "No disponible"}
                  {r.changePct != null && (
                    <span className={r.changePct >= 0 ? "ticker-up" : "ticker-down"}>
                      {" "}
                      {r.changePct >= 0 ? "+" : ""}
                      {r.changePct.toFixed(2)}%
                    </span>
                  )}
                </td>
                <td className="screener-spark">
                  <Sparkline values={r.sparkline} />
                </td>
                <td>{fmtPct(r.retornoAnualizado)}</td>
                <td>{r.volatilidadAnualizada != null ? `${(r.volatilidadAnualizada * 100).toFixed(1)}%` : "—"}</td>
                <td>{r.sharpe != null ? r.sharpe.toFixed(2) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="screener-nota">
        Precio en vivo vía Finnhub; velas diarias reales vía Yahoo Finance. Pasa el cursor (o toca en celular)
        sobre "Retorno anual.", "Volatilidad" o "Sharpe" para ver cómo se calcula cada uno. Marca hasta{" "}
        {MAX_COMPARAR} activos en la columna de la izquierda para compararlos abajo.
      </p>

      {seleccionadas.length > 0 && (
        <Comparador
          seleccionadas={seleccionadas}
          rango={rango}
          setRango={setRango}
          indicador={indicador}
          setIndicador={setIndicador}
        />
      )}
    </div>
  );
}

function Comparador({ seleccionadas, rango, setRango, indicador, setIndicador }) {
  const rangoActivo = RANGOS.find((r) => r.id === rango) || RANGOS[3];
  const indicadorActivo = INDICADORES.find((i) => i.id === indicador) || INDICADORES[0];

  return (
    <div className="screener-comparador">
      <div className="screener-comparador-cabecera">
        <span className="screener-grafica-titulo">
          Comparativa normalizada ({seleccionadas.length} activo{seleccionadas.length !== 1 ? "s" : ""})
        </span>
        <div className="screener-rangos">
          {RANGOS.map((r) => (
            <button
              key={r.id}
              type="button"
              className={r.id === rango ? "screener-rango-btn activo" : "screener-rango-btn"}
              onClick={() => setRango(r.id)}
            >
              {r.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="screener-comparador-cuerpo">
        <GraficaComparativa filas={seleccionadas} ruedas={rangoActivo.ruedas} />

        <div className="screener-indicadores">
          <span className="screener-indicadores-titulo">Indicadores</span>
          <div className="screener-indicadores-botones">
            {INDICADORES.map((ind) => (
              <button
                key={ind.id}
                type="button"
                disabled={!ind.disponible}
                title={!ind.disponible ? "Requiere datos fundamentales que esta fuente gratuita no provee todavía" : ind.uso}
                className={ind.id === indicador ? "screener-indicador-btn activo" : "screener-indicador-btn"}
                onClick={() => ind.disponible && setIndicador(ind.id)}
              >
                {ind.etiqueta}
                {!ind.disponible && <span className="screener-indicador-pendiente"> (próx.)</span>}
              </button>
            ))}
          </div>

          <div className="screener-indicador-panel">
            <strong>{indicadorActivo.etiqueta}</strong>
            <span className="screener-indicador-formula">{indicadorActivo.formula}</span>
            <ul className="screener-indicador-lista">
              {[...seleccionadas]
                .sort((a, b) => {
                  const va = a.indicadores?.[indicadorActivo.id];
                  const vb = b.indicadores?.[indicadorActivo.id];
                  if (va == null) return 1;
                  if (vb == null) return -1;
                  if (typeof va === "boolean") return Number(vb) - Number(va);
                  return vb - va;
                })
                .map((r) => (
                  <li key={r.symbol}>
                    <span>{r.symbol}</span>
                    <span>{indicadorActivo.formato(r.indicadores?.[indicadorActivo.id])}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Gráfica de líneas normalizada (primer punto de la ventana = 100). */
function GraficaComparativa({ filas, ruedas }) {
  const width = 760;
  const height = 320;
  const padding = 36;

  const series = filas.map((r) => {
    const puntos = r.historial.slice(-ruedas);
    const base = puntos[0]?.[1];
    return puntos.map(([, close]) => (base ? (close / base) * 100 : 100));
  });

  const todos = series.flat();
  const min = Math.min(...todos);
  const max = Math.max(...todos);
  const range = max - min || 1;
  const nPuntos = Math.max(...series.map((s) => s.length), 2);

  function puntos(serie) {
    return serie
      .map((v, i) => {
        const x = padding + (i / (nPuntos - 1)) * (width - padding * 2);
        const y = height - padding - ((v - min) / range) * (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  return (
    <div className="screener-grafica">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="screener-grafica-svg">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--line)" strokeWidth="1" />
        {filas.map((r, i) => (
          <polyline
            key={r.symbol}
            points={puntos(series[i])}
            fill="none"
            stroke={COLORES[i % COLORES.length]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <div className="screener-grafica-leyenda">
        {filas.map((r, i) => (
          <span key={r.symbol} className="screener-grafica-leyenda-item">
            <span className="screener-grafica-dot" style={{ background: COLORES[i % COLORES.length] }} />
            {r.symbol}
          </span>
        ))}
      </div>
    </div>
  );
}
