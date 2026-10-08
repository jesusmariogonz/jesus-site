"use client";

import { useEffect, useMemo, useState } from "react";
import Sparkline from "@/components/Sparkline";

function fmtPct(v) {
  if (v == null) return "—";
  return `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;
}

const EXPLICACIONES = {
  retorno:
    "Retorno anualizado: el promedio de los retornos diarios (en log) de los últimos ~180 días, proyectado a un año (×252 días de trading). Es cuánto hubiera rendido el activo en un año si mantuviera ese mismo ritmo — no una predicción, un promedio histórico.",
  volatilidad:
    "Volatilidad anualizada: qué tanto se mueve el precio día a día, medido como la desviación estándar de los retornos diarios y proyectado a un año. Más alta = oscilaciones más bruscas (mayor riesgo), no necesariamente peor desempeño.",
  sharpe:
    "Sharpe: retorno anualizado menos una tasa libre de riesgo (~4.5%, aprox. de un bono del Tesoro), dividido entre la volatilidad anualizada. Mide cuánto retorno dio el activo por cada unidad de riesgo tomado — más alto es mejor; negativo significa que ni siquiera superó la tasa libre de riesgo.",
};

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

export default function MercadosScreener() {
  const [data, setData] = useState(null);
  const [busqueda, setBusqueda] = useState("");

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

  if (!data) {
    return <p className="screener-cargando">Cargando precios en vivo…</p>;
  }

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
        Precio en vivo vía Finnhub; velas diarias reales vía Yahoo Finance. Incluye acciones de EE.UU. y
        commodities vía ETFs (oro, plata, petróleo, dólar) — no incluye la BMV, porque Finnhub no da precio en
        vivo para ese mercado en el plan gratuito. Pasa el cursor (o toca en celular) sobre "Retorno anual.",
        "Volatilidad" o "Sharpe" para ver cómo se calcula cada uno.
      </p>
    </div>
  );
}
