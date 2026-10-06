"use client";

import { useEffect, useMemo, useState } from "react";
import Sparkline from "@/components/Sparkline";

const COLORES = ["#4f8cff", "#22c39a", "#a78bfa", "#f2b84a", "#f2814a", "#5fd0f2", "#e05fd8", "#d64545", "#ffd166", "#06d6a0", "#118ab2", "#ef476f"];

function fmtPct(v) {
  if (v == null) return "—";
  return `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;
}

export default function MercadosScreener() {
  const [data, setData] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [mercado, setMercado] = useState("todas");
  const [seleccion, setSeleccion] = useState(new Set());

  useEffect(() => {
    fetch("/api/mercados/screener")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        // Por default, comparar todo lo que sí tenga datos.
        setSeleccion(new Set(d.rows.filter((r) => r.disponible).map((r) => r.symbol)));
      })
      .catch(() => setData({ rows: [] }));
  }, []);

  const filas = useMemo(() => {
    if (!data?.rows) return [];
    return data.rows.filter((r) => {
      if (mercado !== "todas" && r.mercado !== mercado) return false;
      if (!busqueda.trim()) return true;
      const q = busqueda.toLowerCase();
      return r.symbol.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
    });
  }, [data, busqueda, mercado]);

  function toggle(symbol) {
    setSeleccion((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  }

  if (!data) {
    return <p className="screener-cargando">Cargando precios en vivo…</p>;
  }

  const seleccionadas = data.rows.filter((r) => seleccion.has(r.symbol) && r.sparkline?.length > 1);

  return (
    <div className="mercados-screener">
      <div className="screener-controles">
        <input
          type="text"
          placeholder="Buscar símbolo o nombre…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={mercado} onChange={(e) => setMercado(e.target.value)}>
          <option value="todas">Todos los mercados</option>
          <option value="us">Estados Unidos</option>
          <option value="mx">BMV (México)</option>
        </select>
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
              <th>Retorno anual.</th>
              <th>Volatilidad</th>
              <th>Sharpe</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((r) => (
              <tr key={r.symbol} className={!r.disponible ? "fila-no-disponible" : undefined}>
                <td>
                  <input
                    type="checkbox"
                    checked={seleccion.has(r.symbol)}
                    disabled={!r.disponible}
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
        Precio y velas diarias reales vía Finnhub. Retorno/volatilidad/Sharpe se calculan a partir de esas velas
        (últimos ~180 días; Sharpe usa 4.5% como tasa libre de riesgo aproximada). "No disponible" significa que
        Finnhub no devolvió datos para ese símbolo (frecuente en BMV con el plan gratuito) — no se inventa ningún valor.
      </p>

      {seleccionadas.length > 0 && (
        <GraficaComparativa filas={seleccionadas} />
      )}
    </div>
  );
}

/** Gráfica de líneas normalizada (día 1 = 100%), SVG puro sin librerías. */
function GraficaComparativa({ filas }) {
  const width = 900;
  const height = 320;
  const padding = 36;

  const series = filas.map((r) => {
    const base = r.sparkline[0];
    return r.sparkline.map((v) => (v / base) * 100);
  });

  const todos = series.flat();
  const min = Math.min(...todos);
  const max = Math.max(...todos);
  const range = max - min || 1;
  const nPuntos = Math.max(...series.map((s) => s.length));

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
      <span className="screener-grafica-titulo">Comparativa (normalizada, últimos ~30 días de cierre)</span>
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
