"use client";

import { useState } from "react";
import Link from "next/link";
import { EquityChart } from "@/components/TradingPublicoExplorer";

/* Cartera virtual EN VIVO de EXP-005 (ver pulso-research-lab:
   experiments/EXP-005-reverse-winners/PAPER_PORTFOLIO.md). Mismo patrón
   visual de pestañas que el motor de Trading Algorítmico (Dashboard /
   Portafolio / Operaciones), pero sin reusar sus componentes: esta cartera
   es dólar-ponderada (sin acciones ni stop), un modelo de datos distinto
   al de los buckets de producción. */

const pct = (v, d = 2) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(d)}%`);
const dinero = (v) => (v == null ? "—" : `$${v.toFixed(2)}`);
const toneColor = (v) => (v == null ? "var(--ink)" : v >= 0 ? "#16a34a" : "#dc2626");

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "portafolio", label: "Portafolio" },
  { id: "operaciones", label: "Operaciones" },
];

function DashboardTab({ data }) {
  const historialChart = data.historial_diario.map((h) => ({ date: h.fecha, equity: h.equity }));
  return (
    <div>
      <div className="highlights-grid" style={{ margin: "16px 0 20px" }}>
        <div className="highlight-item">
          <span className="highlight-valor">{dinero(data.capital_inicial)}</span>
          <span className="highlight-etiqueta">capital inicial</span>
        </div>
        <div className="highlight-item">
          <span className="highlight-valor">{dinero(data.equity_actual)}</span>
          <span className="highlight-etiqueta">equity actual</span>
        </div>
        <div className="highlight-item">
          <span className="highlight-valor" style={{ color: toneColor(data.retorno_acumulado_pct) }}>
            {pct(data.retorno_acumulado_pct)}
          </span>
          <span className="highlight-etiqueta">retorno acumulado</span>
        </div>
        <div className="highlight-item">
          <span className="highlight-valor">{pct(Math.abs(data.drawdown_pct))}</span>
          <span className="highlight-etiqueta">drawdown</span>
        </div>
        <div className="highlight-item">
          <span className="highlight-valor" style={{ color: toneColor(data.pnl_realizado_total) }}>
            {dinero(data.pnl_realizado_total)}
          </span>
          <span className="highlight-etiqueta">P&amp;L realizado</span>
        </div>
        <div className="highlight-item">
          <span className="highlight-valor" style={{ color: toneColor(data.pnl_no_realizado_total) }}>
            {dinero(data.pnl_no_realizado_total)}
          </span>
          <span className="highlight-etiqueta">P&amp;L no realizado</span>
        </div>
      </div>
      <h3 style={{ fontSize: "0.95rem", marginBottom: 8 }}>Curva de equity</h3>
      <EquityChart history={historialChart} startingCapital={data.capital_inicial} height={160} />
      <p className="pulsodash-vacio" style={{ marginTop: 16 }}>
        Última actualización del motor:{" "}
        {new Date(data.ultima_actualizacion).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}.
      </p>
    </div>
  );
}

function PortafolioTab({ data }) {
  const posiciones = [...data.posiciones_abiertas].sort((a, b) => (a.entry_fecha < b.entry_fecha ? 1 : -1));

  const porTicker = new Map();
  for (const p of data.posiciones_abiertas) {
    porTicker.set(p.ticker, (porTicker.get(p.ticker) || 0) + p.dolares_invertidos);
  }
  const concentracion = [...porTicker.entries()]
    .map(([ticker, monto]) => ({ ticker, monto, pctEquity: data.equity_actual > 0 ? (monto / data.equity_actual) * 100 : 0 }))
    .sort((a, b) => b.monto - a.monto)
    .slice(0, 5);

  return (
    <div>
      <h3 style={{ fontSize: "0.95rem", marginBottom: 8 }}>
        Posiciones abiertas ({posiciones.length})
      </h3>
      {posiciones.length === 0 ? (
        <p className="pulsodash-vacio">Ninguna posición abierta ahora mismo.</p>
      ) : (
        <>
          <div className="prose" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Símbolo</th>
                  <th>Entrada</th>
                  <th>Precio entrada</th>
                  <th>Último precio</th>
                  <th>$ invertido</th>
                  <th>Retorno no realizado</th>
                </tr>
              </thead>
              <tbody>
                {posiciones.map((p, i) => (
                  <tr key={`${p.ticker}-${p.entry_fecha}-${i}`}>
                    <td>{p.ticker}</td>
                    <td>{p.entry_fecha}</td>
                    <td>{dinero(p.entry_price)}</td>
                    <td>{dinero(p.ultimo_precio_conocido)}</td>
                    <td>{dinero(p.dolares_invertidos)}</td>
                    <td style={{ color: toneColor(p.retorno_no_realizado_pct) }}>
                      {pct(p.retorno_no_realizado_pct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: "0.95rem", margin: "24px 0 8px" }}>Concentración (top 5 por símbolo)</h3>
          <p className="pulsodash-vacio" style={{ marginBottom: 12 }}>
            Un mismo símbolo puede tener varias posiciones abiertas a la vez — cada señal nueva abre
            una posición independiente, no se deduplica (ver PAPER_PORTFOLIO.md). Esta tabla suma el
            $ invertido total por símbolo para que la concentración real sea visible.
          </p>
          <div className="prose" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Símbolo</th>
                  <th>$ invertido total</th>
                  <th>% del equity</th>
                </tr>
              </thead>
              <tbody>
                {concentracion.map((c) => (
                  <tr key={c.ticker}>
                    <td>{c.ticker}</td>
                    <td>{dinero(c.monto)}</td>
                    <td>{c.pctEquity.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function OperacionesTab({ data }) {
  const filas = [
    ...data.posiciones_abiertas.map((p) => ({ ...p, estado: "ABIERTA", orden: p.entry_fecha })),
    ...data.posiciones_cerradas.map((p) => ({ ...p, estado: "CERRADA", orden: p.exit_fecha })),
  ].sort((a, b) => (a.orden < b.orden ? 1 : -1));

  if (filas.length === 0) {
    return <p className="pulsodash-vacio">Todavía no hay ninguna compra registrada.</p>;
  }

  return (
    <div>
      <p className="pulsodash-vacio" style={{ marginBottom: 12 }}>
        Historial completo de compras y ventas — {data.posiciones_abiertas.length} abiertas,{" "}
        {data.posiciones_cerradas.length} cerradas
        {data.win_rate_pct != null ? ` (win rate ${data.win_rate_pct}%)` : ""}.
      </p>
      <div className="prose" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Estado</th>
              <th>Símbolo</th>
              <th>Compra</th>
              <th>Precio compra</th>
              <th>Venta</th>
              <th>Precio venta</th>
              <th>$ invertido</th>
              <th>P&amp;L</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={`${f.ticker}-${f.entry_fecha}-${i}`}>
                <td>
                  <span style={{ color: f.estado === "ABIERTA" ? "#eab308" : "var(--ink-soft)" }}>
                    {f.estado === "ABIERTA" ? "🟡 ABIERTA" : "⚪ CERRADA"}
                  </span>
                </td>
                <td>{f.ticker}</td>
                <td>{f.entry_fecha}</td>
                <td>{dinero(f.entry_price)}</td>
                <td>{f.estado === "CERRADA" ? f.exit_fecha : "—"}</td>
                <td>{f.estado === "CERRADA" ? dinero(f.exit_price) : "—"}</td>
                <td>{dinero(f.dolares_invertidos)}</td>
                <td style={{ color: toneColor(f.estado === "CERRADA" ? f.pnl_pct : f.retorno_no_realizado_pct) }}>
                  {f.estado === "CERRADA"
                    ? `${dinero(f.pnl)} (${pct(f.pnl_pct)})`
                    : `${pct(f.retorno_no_realizado_pct)} no realizado`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Exp005PaperPortfolio({ data }) {
  const [tab, setTab] = useState("dashboard");

  if (!data) {
    return (
      <p className="activo-descripcion">
        La cartera virtual todavía no ha corrido por primera vez (o la corrida más
        reciente no se pudo leer) — esta sección se completa sola en cuanto exista.
      </p>
    );
  }

  return (
    <div className="pulsodash-panel">
      <div className="pulsodash-panel-head">
        <span className="pulsodash-panel-title">{data.nombre}</span>
        <span className="pulsodash-panel-sub">Desde {data.fecha_inicio}</span>
      </div>

      <p className="pulsodash-vacio" style={{ marginBottom: 16 }}>
        Capital virtual, reglas de cartera NUEVAS (no parte de la validación original) — ver{" "}
        <Link href="https://github.com/jesusmariogonz/pulso-research-lab/blob/main/experiments/EXP-005-reverse-winners/PAPER_PORTFOLIO.md">
          PAPER_PORTFOLIO.md
        </Link>{" "}
        para qué es el bucket ya validado y qué es nuevo aquí. Se actualiza semanalmente (no
        diario, por el ritmo de refresco de datos del laboratorio de investigación).
      </p>

      <nav className="trading-tabs trading-tabs-principal">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`trading-tab${tab === t.id ? " activo" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 24 }}>
        {tab === "dashboard" && <DashboardTab data={data} />}
        {tab === "portafolio" && <PortafolioTab data={data} />}
        {tab === "operaciones" && <OperacionesTab data={data} />}
      </div>
    </div>
  );
}
