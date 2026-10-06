"use client";

import { useEffect, useMemo, useState } from "react";
import Sparkline from "@/components/Sparkline";

function fmtPct(v) {
  if (v == null) return "—";
  return `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;
}

export default function MercadosScreener() {
  const [data, setData] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [mercado, setMercado] = useState("todas");

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
      if (mercado !== "todas" && r.mercado !== mercado) return false;
      if (!busqueda.trim()) return true;
      const q = busqueda.toLowerCase();
      return r.symbol.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
    });
  }, [data, busqueda, mercado]);

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
        Precio en vivo vía Finnhub; velas diarias reales vía Yahoo Finance. Retorno/volatilidad/Sharpe se calculan a
        partir de esas velas (últimos ~180 días; Sharpe usa 4.5% como tasa libre de riesgo aproximada). "No disponible"
        significa que ninguna fuente devolvió datos para ese símbolo (frecuente en BMV con el plan gratuito de
        Finnhub) — no se inventa ningún valor.
      </p>
    </div>
  );
}
