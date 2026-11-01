"use client";

/* Explorador público de Trading Algorítmico (/pulso-mercado/trading).
   Consume el agregado ya sanitizado de lib/trading/public-snapshot.js
   — no lee los JSON del motor directamente ni hace fetch a nada
   privado. Primera fase de 3 módulos (Dashboard, Portafolios,
   Operaciones); Investigación/Código/Bitácora quedan para una
   siguiente fase, una vez revisado qué del otro repo es seguro
   publicar tal cual. */

import { useMemo, useState } from "react";

function formatFecha(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
}

function Metrica({ etiqueta, valor, tono }) {
  return (
    <div className="highlight-item">
      <span
        className="highlight-valor"
        style={tono ? { color: tono === "up" ? "#16a34a" : tono === "down" ? "#dc2626" : undefined } : undefined}
      >
        {valor}
      </span>
      <span className="highlight-etiqueta">{etiqueta}</span>
    </div>
  );
}

function pct(n, { signo = true } = {}) {
  if (n === null || n === undefined) return "—";
  const s = signo && n > 0 ? "+" : "";
  return `${s}${n}%`;
}

function tonoDe(n) {
  if (n === null || n === undefined) return undefined;
  return n > 0 ? "up" : n < 0 ? "down" : undefined;
}

function EquityChart({ history, startingCapital }) {
  const width = 640;
  const height = 150;
  const pad = { top: 12, right: 12, bottom: 20, left: 12 };

  if (!history?.length) {
    return <p className="pulsodash-vacio">Sin historial todavía — el bucket abrió hoy.</p>;
  }

  const values = history.map((h) => h.equity);
  const min = Math.min(startingCapital, ...values);
  const max = Math.max(startingCapital, ...values);
  const range = max - min || 1;

  const x = (i) =>
    history.length === 1 ? width / 2 : pad.left + (i / (history.length - 1)) * (width - pad.left - pad.right);
  const y = (v) => height - pad.bottom - ((v - min) / range) * (height - pad.top - pad.bottom);

  const path = history.map((h, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(h.equity).toFixed(1)}`).join(" ");
  const baselineY = y(startingCapital);
  const ultimo = history[history.length - 1];
  const subio = ultimo.equity >= startingCapital;
  const color = subio ? "#16a34a" : "#dc2626";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <line x1={pad.left} x2={width - pad.right} y1={baselineY} y2={baselineY} stroke="var(--line-soft)" strokeWidth="1" strokeDasharray="4 4" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
      {history.map((h, i) => (
        <circle key={h.date} cx={x(i)} cy={y(h.equity)} r="3" fill={color} />
      ))}
      <text x={pad.left} y={height - 4} fontSize="10" fill="var(--ink-soft)">{history[0].date}</text>
      <text x={width - pad.right} y={height - 4} fontSize="10" fill="var(--ink-soft)" textAnchor="end">{ultimo.date}</text>
    </svg>
  );
}

function TabsNav({ tab, setTab }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "portafolios", label: "Portafolios" },
    { id: "operaciones", label: "Operaciones" },
  ];
  return (
    <nav className="trading-tabs">
      {tabs.map((t) => (
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
  );
}

function ModuloDashboard({ data }) {
  const { resumen } = data;
  return (
    <div>
      <div className="pulsodash-panel" style={{ marginBottom: 24 }}>
        <div className="pulsodash-panel-head">
          <span className="pulsodash-panel-title">Resumen ejecutivo · Paper Trading</span>
          <span className="pulsodash-panel-sub">
            Última actualización: {formatFecha(data.generatedAt)}
          </span>
        </div>
        <div className="highlights-grid" style={{ marginTop: 12 }}>
          <Metrica etiqueta="capital inicial" valor={`$${resumen.capitalInicialTotal} USD`} />
          <Metrica etiqueta="equity actual" valor={`$${resumen.equityActualTotal} USD`} />
          <Metrica etiqueta="retorno acumulado" valor={pct(resumen.retornoTotalPct)} tono={tonoDe(resumen.retornoTotalPct)} />
          <Metrica etiqueta="drawdown máximo (bucket)" valor={pct(resumen.drawdownMaximoPct, { signo: false })} />
          <Metrica etiqueta="posiciones abiertas" valor={resumen.totalAbiertas} />
          <Metrica etiqueta="operaciones cerradas" valor={resumen.totalCerradas} />
          <Metrica etiqueta="win rate global" valor={resumen.winRateGlobalPct !== null ? `${resumen.winRateGlobalPct}%` : "—"} />
        </div>
      </div>

      <div className="pulsodash-panel" style={{ marginBottom: 24 }}>
        <div className="pulsodash-panel-head">
          <span className="pulsodash-panel-title">Distribución de capital — objetivo vs. real</span>
        </div>
        <div className="prose" style={{ overflowX: "auto", marginTop: 12 }}>
          <table>
            <thead>
              <tr>
                <th>Bucket</th>
                <th>Objetivo</th>
                <th>Real (por equity)</th>
              </tr>
            </thead>
            <tbody>
              {data.asignacionReal.map((a) => (
                <tr key={a.key}>
                  <td>{a.etiqueta}</td>
                  <td>{a.objetivoPct !== null ? `${a.objetivoPct}%` : "—"}</td>
                  <td>{a.pct !== null ? `${a.pct}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pulsodash-panel" style={{ marginBottom: 24 }}>
        <div className="pulsodash-panel-head">
          <span className="pulsodash-panel-title">Investigación · Backtesting (histórico, no es paper trading)</span>
        </div>
        <p className="pulsodash-vacio" style={{ marginBottom: 12 }}>
          Resultados de simulación histórica por estrategia, calculados sobre precios pasados con
          comisión y slippage incluidos. Nunca se combinan con la curva de paper trading de arriba.
        </p>
        <div className="prose" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Estrategia</th>
                <th>Universo</th>
                <th>Mejor símbolo (backtest)</th>
                <th>Retorno promedio</th>
                <th>Comisión + slippage</th>
              </tr>
            </thead>
            <tbody>
              {data.estrategiasBacktest.map((e) => (
                <tr key={e.id}>
                  <td>{e.nombre} · v{e.version}</td>
                  <td>{e.universeSize ?? "—"}</td>
                  <td>{e.mejorSimbolo ? `${e.mejorSimbolo} (${e.mejorRetornoPct}%)` : "—"}</td>
                  <td>{e.retornoPromedioPct !== null ? `${e.retornoPromedioPct}%` : "—"}</td>
                  <td>
                    {e.fees !== null && e.slippage !== null
                      ? `${(e.fees * 100).toFixed(2)}% + ${(e.slippage * 100).toFixed(2)}%`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.pendientesDelMotor?.length > 0 && (
        <div className="pulsodash-panel">
          <div className="pulsodash-panel-head">
            <span className="pulsodash-panel-title">Pendientes del motor</span>
          </div>
          <ul style={{ marginTop: 12, paddingLeft: 20, color: "var(--ink-soft)" }}>
            {data.pendientesDelMotor.map((p) => (
              <li key={p} style={{ marginBottom: 6 }}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ModuloPortafolios({ data }) {
  const [seleccion, setSeleccion] = useState(data.buckets[0]?.key || null);
  const bucket = data.buckets.find((b) => b.key === seleccion) || data.buckets[0];

  return (
    <div>
      <div className="trading-tabs" style={{ marginBottom: 24 }}>
        {data.buckets.map((b) => (
          <button
            key={b.key}
            type="button"
            className={`trading-tab${seleccion === b.key ? " activo" : ""}`}
            onClick={() => setSeleccion(b.key)}
          >
            {b.etiqueta}
          </button>
        ))}
      </div>

      {bucket && (
        <div className="pulsodash-panel">
          <div className="pulsodash-panel-head">
            <span className="pulsodash-panel-title">{bucket.etiqueta}</span>
            <span className="pulsodash-panel-sub">Desde {bucket.startDate}</span>
          </div>

          {bucket.suspendido && (
            <div className="postura-aviso error" style={{ margin: "12px 0", padding: 16, borderRadius: 8 }}>
              <strong>Bucket suspendido</strong> desde {bucket.suspendidoDesde}: {bucket.suspendidoRazon}.
              No se liquidó nada — solo se bloquearon nuevas compras hasta reautorizar.
            </div>
          )}
          {!bucket.suspendido && bucket.circuitBreakerHoy && (
            <div className="postura-aviso error" style={{ margin: "12px 0", padding: 16, borderRadius: 8 }}>
              <strong>Límite de pérdida diaria alcanzado hoy</strong> — sin nuevas compras hasta la próxima sesión.
            </div>
          )}

          <div className="highlights-grid" style={{ margin: "16px 0 20px" }}>
            <Metrica etiqueta="capital asignado" valor={`$${bucket.startingCapital}`} />
            <Metrica etiqueta="equity actual" valor={`$${bucket.equityActual}`} />
            <Metrica etiqueta="retorno acumulado" valor={pct(bucket.retornoAcumuladoPct)} tono={tonoDe(bucket.retornoAcumuladoPct)} />
            <Metrica etiqueta="drawdown" valor={pct(bucket.drawdownPct, { signo: false })} />
            <Metrica etiqueta="abiertas / cerradas" valor={`${bucket.posicionesAbiertas.length} / ${bucket.totalCerradas}`} />
            {bucket.winRatePct !== null && <Metrica etiqueta="win rate" valor={`${bucket.winRatePct}%`} />}
            {bucket.profitFactor !== null && <Metrica etiqueta="profit factor" valor={bucket.profitFactor} />}
          </div>

          {bucket.meta && (
            <p className="pulsodash-vacio" style={{ marginBottom: 16 }}>
              Estrategia: {bucket.meta.estrategia} · riesgo por operación: {bucket.meta.riesgoPorOperacion} ·
              límite de pérdida diaria: {bucket.meta.limitePerdidaDiaria} · drawdown de revisión: {bucket.meta.drawdownRevision}.
            </p>
          )}

          <h3 style={{ fontSize: "0.95rem", marginBottom: 8 }}>Curva de equity</h3>
          <EquityChart history={bucket.historialDiario} startingCapital={bucket.startingCapital} />
        </div>
      )}

      <div className="pulsodash-panel" style={{ marginTop: 24 }}>
        <div className="pulsodash-panel-head">
          <span className="pulsodash-panel-title">Comparación entre buckets</span>
        </div>
        <div className="prose" style={{ overflowX: "auto", marginTop: 12 }}>
          <table>
            <thead>
              <tr>
                <th>Bucket</th>
                <th>Equity</th>
                <th>Retorno</th>
                <th>Drawdown</th>
                <th>Abiertas</th>
                <th>Cerradas</th>
                <th>Win rate</th>
              </tr>
            </thead>
            <tbody>
              {data.buckets.map((b) => (
                <tr key={b.key}>
                  <td>{b.etiqueta}</td>
                  <td>${b.equityActual}</td>
                  <td style={{ color: tonoDe(b.retornoAcumuladoPct) === "up" ? "#16a34a" : tonoDe(b.retornoAcumuladoPct) === "down" ? "#dc2626" : undefined }}>
                    {pct(b.retornoAcumuladoPct)}
                  </td>
                  <td>{pct(b.drawdownPct, { signo: false })}</td>
                  <td>{b.posicionesAbiertas.length}</td>
                  <td>{b.totalCerradas}</td>
                  <td>{b.winRatePct !== null ? `${b.winRatePct}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TablaAbiertas({ filas }) {
  if (!filas.length) return <p className="pulsodash-vacio">Ninguna posición abierta en este momento.</p>;
  return (
    <div className="prose" style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Símbolo</th>
            <th>Bucket</th>
            <th>Estrategia</th>
            <th>Entrada</th>
            <th>Precio entrada</th>
            <th>Stop</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((p, i) => (
            <tr key={`${p.symbol}-${p.entry_date}-${i}`}>
              <td>{p.symbol}</td>
              <td>{p.bucketEtiqueta}</td>
              <td>{p.strategy}</td>
              <td>{p.entry_date}</td>
              <td>${p.entry_price}</td>
              <td>${typeof p.stop_price === "number" ? p.stop_price.toFixed(2) : p.stop_price}</td>
              <td>{p.shares}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TablaCerradas({ filas }) {
  if (!filas.length) return <p className="pulsodash-vacio">Todavía no hay operaciones cerradas — el historial empieza aquí, incluidas las pérdidas.</p>;
  return (
    <div className="prose" style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Símbolo</th>
            <th>Bucket</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>P&amp;L</th>
            <th>Rendimiento</th>
            <th>Motivo</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((p, i) => (
            <tr key={`${p.symbol}-${p.entry_date}-${i}`}>
              <td>{p.symbol}</td>
              <td>{p.bucketEtiqueta}</td>
              <td>{p.entry_date}</td>
              <td>{p.exit_date || "—"}</td>
              <td style={{ color: p.pnl >= 0 ? "#16a34a" : "#dc2626" }}>${p.pnl}</td>
              <td style={{ color: p.pnl_pct >= 0 ? "#16a34a" : "#dc2626" }}>{p.pnl_pct}%</td>
              <td>{p.reason === "stop_hit" ? "Stop" : "Señal"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ModuloOperaciones({ data }) {
  const [vista, setVista] = useState("abiertas");

  const abiertas = useMemo(
    () =>
      data.buckets.flatMap((b) => b.posicionesAbiertas.map((p) => ({ ...p, bucketEtiqueta: b.etiqueta }))),
    [data.buckets]
  );
  const cerradas = useMemo(
    () =>
      data.buckets
        .flatMap((b) => b.posicionesCerradas.map((p) => ({ ...p, bucketEtiqueta: b.etiqueta })))
        .sort((a, b) => (a.exit_date < b.exit_date ? 1 : -1)),
    [data.buckets]
  );

  return (
    <div>
      <div className="trading-tabs" style={{ marginBottom: 24 }}>
        <button type="button" className={`trading-tab${vista === "abiertas" ? " activo" : ""}`} onClick={() => setVista("abiertas")}>
          Abiertas ({abiertas.length})
        </button>
        <button type="button" className={`trading-tab${vista === "cerradas" ? " activo" : ""}`} onClick={() => setVista("cerradas")}>
          Cerradas ({cerradas.length})
        </button>
      </div>
      <div className="pulsodash-panel">
        {vista === "abiertas" ? <TablaAbiertas filas={abiertas} /> : <TablaCerradas filas={cerradas} />}
      </div>
      <p className="pulsodash-vacio" style={{ marginTop: 16 }}>
        El historial conserva todas las operaciones, ganadoras y perdedoras — nunca se ocultan las
        pérdidas ni se recalculan resultados ya cerrados.
      </p>
    </div>
  );
}

export default function TradingPublicoExplorer({ data }) {
  const [tab, setTab] = useState("dashboard");

  return (
    <div>
      <TabsNav tab={tab} setTab={setTab} />
      <div style={{ marginTop: 24 }}>
        {tab === "dashboard" && <ModuloDashboard data={data} />}
        {tab === "portafolios" && <ModuloPortafolios data={data} />}
        {tab === "operaciones" && <ModuloOperaciones data={data} />}
      </div>
    </div>
  );
}
