"use client";

/* Detalle de un Quant Portfolio — equity, pesos objetivo, holdings
   actuales, estado de los circuit breakers (pérdida diaria/drawdown),
   e historial diario. Mismo patrón de acceso que /trading. */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const CLAVE_STORAGE = "jx_trading_secret";

function EquityChart({ history, startingCapital }) {
  const width = 600;
  const height = 140;
  const pad = { top: 12, right: 12, bottom: 20, left: 12 };

  if (!history?.length) {
    return <p style={{ color: "var(--ink-soft)", fontSize: "0.85rem" }}>Sin historial todavía.</p>;
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

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <line x1={pad.left} x2={width - pad.right} y1={baselineY} y2={baselineY} stroke="var(--line-soft)" strokeWidth="1" strokeDasharray="4 4" />
      <path d={path} fill="none" stroke={subio ? "#16a34a" : "#dc2626"} strokeWidth="2" />
      {history.map((h, i) => (
        <circle key={h.date} cx={x(i)} cy={y(h.equity)} r="3" fill={subio ? "#16a34a" : "#dc2626"} />
      ))}
      <text x={pad.left} y={height - 4} fontSize="10" fill="var(--ink-soft)">{history[0].date}</text>
      <text x={width - pad.right} y={height - 4} fontSize="10" fill="var(--ink-soft)" textAnchor="end">{ultimo.date}</text>
    </svg>
  );
}

function TablaPesos({ weights, holdings, trendStatus }) {
  return (
    <div className="prose" style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Activo</th>
            <th>Peso objetivo</th>
            <th>Acciones actuales</th>
            <th>Tendencia hoy</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(weights).map(([symbol, weight]) => (
            <tr key={symbol}>
              <td>{symbol}</td>
              <td>{(weight * 100).toFixed(0)}%</td>
              <td>{holdings?.[symbol] ?? 0}</td>
              <td>
                {trendStatus?.[symbol] ? (
                  <span style={{ color: "#16a34a" }}>● peso completo</span>
                ) : (
                  <span style={{ color: "var(--ink-soft)" }}>○ defensivo</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TablaHistorialDiario({ history }) {
  if (!history?.length) return null;
  const ordenado = [...history].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div className="prose" style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Equity</th>
            <th>Retorno acum.</th>
            <th>Pérdida diaria</th>
            <th>Drawdown</th>
            <th>Rebalanceó</th>
          </tr>
        </thead>
        <tbody>
          {ordenado.map((h) => (
            <tr key={h.date}>
              <td>{h.date}</td>
              <td>${h.equity}</td>
              <td style={{ color: h.cumulative_return_pct >= 0 ? "#16a34a" : "#dc2626" }}>
                {h.cumulative_return_pct}%
              </td>
              <td style={{ color: h.daily_loss_breaker_tripped ? "#dc2626" : "inherit" }}>
                {h.daily_loss_pct}%{h.daily_loss_breaker_tripped ? " ⚠" : ""}
              </td>
              <td style={{ color: h.suspended ? "#dc2626" : "inherit" }}>{h.drawdown_pct}%</td>
              <td>{h.rebalanced_today ? "↻" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function QuantPortfolioDetail() {
  const params = useParams();
  const portfolioId = params.id?.replace(/-/g, "_");

  const [secret, setSecret] = useState("");
  const [secretGuardado, setSecretGuardado] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const guardado = sessionStorage.getItem(CLAVE_STORAGE);
    if (guardado) {
      setSecret(guardado);
      setSecretGuardado(true);
    }
  }, []);

  useEffect(() => {
    if (!secretGuardado) return;
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secretGuardado]);

  async function cargar() {
    setError(null);
    try {
      const res = await fetch("/api/quant-portfolios", {
        headers: { "x-admin-secret": secret },
      });
      if (res.status === 401) {
        setError("Clave incorrecta.");
        sessionStorage.removeItem(CLAVE_STORAGE);
        setSecretGuardado(false);
        return;
      }
      setData(await res.json());
    } catch {
      setError("No se pudo cargar el panel.");
    }
  }

  function entrar(e) {
    e.preventDefault();
    sessionStorage.setItem(CLAVE_STORAGE, secret);
    setSecretGuardado(true);
  }

  if (!secretGuardado) {
    return (
      <div className="container admin-login">
        <h1>Quant Portfolios</h1>
        <form onSubmit={entrar}>
          <input
            type="password"
            placeholder="Clave de acceso"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            autoFocus
          />
          <button type="submit">Entrar</button>
        </form>
        {error && <p className="postura-aviso error">{error}</p>}
      </div>
    );
  }

  if (!data && !error) return <div className="container" style={{ paddingTop: 40 }}><p>Cargando…</p></div>;
  if (error) return <div className="container" style={{ paddingTop: 40 }}><p className="postura-aviso error">{error}</p></div>;

  const p = data.portfolios?.[portfolioId];
  if (!p) {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        <p>No se encontró el portafolio &quot;{params.id}&quot;.</p>
        <Link href="/trading/portafolios">← Volver</Link>
      </div>
    );
  }

  const ultimo = p.daily_history[p.daily_history.length - 1];

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <p style={{ marginBottom: 8 }}>
        <Link href="/trading/portafolios">← Quant Portfolios</Link>
      </p>
      <span className="sql-meta">-- {p.rebalance_frequency === "daily" ? "rebalanceo diario" : "rebalanceo mensual"} · benchmark {p.benchmark}</span>
      <h1>{p.name}</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "70ch", marginBottom: 12 }}>{p.tagline}</p>
      <p style={{ color: "var(--ink-soft)", fontSize: "0.85rem", marginBottom: 32 }}>
        Volatilidad objetivo de diseño: {p.design_volatility_target_pct[0]}–{p.design_volatility_target_pct[1]}% anualizado
        (hipótesis de diseño, no medida histórica) · Riesgo por operación: {(p.risk_per_trade_pct * 100).toFixed(2)}%
        · Límite de pérdida diaria: {(p.daily_loss_limit_pct * 100).toFixed(1)}% · Drawdown de revisión: {(p.drawdown_review_pct * 100).toFixed(0)}%
      </p>

      {p.suspended && (
        <div
          className="postura-aviso error"
          style={{ marginBottom: 24, padding: 16, borderRadius: 8 }}
        >
          <strong>🛑 Portafolio suspendido</strong> desde {p.suspended_since}: {p.suspended_reason}
          <br />
          No se liquidó nada — las posiciones actuales se mantienen. Solo se bloquearon nuevas
          compras hasta reautorizar manualmente (<code>python -m src.quant_portfolios.reauthorize {portfolioId}</code>).
        </div>
      )}
      {!p.suspended && ultimo?.daily_loss_breaker_tripped && (
        <div className="postura-aviso error" style={{ marginBottom: 24, padding: 16, borderRadius: 8 }}>
          <strong>⚠ Límite de pérdida diaria alcanzado hoy</strong> — sin nuevas compras hasta mañana.
        </div>
      )}

      <div className="highlights-grid" style={{ marginBottom: 24 }}>
        <div className="highlight-item">
          <span className="highlight-valor">${ultimo.equity}</span>
          <span className="highlight-etiqueta">equity</span>
        </div>
        <div className="highlight-item">
          <span className="highlight-valor">{ultimo.cumulative_return_pct >= 0 ? "+" : ""}{ultimo.cumulative_return_pct}%</span>
          <span className="highlight-etiqueta">retorno acumulado</span>
        </div>
        <div className="highlight-item">
          <span className="highlight-valor">${p.starting_capital}</span>
          <span className="highlight-etiqueta">capital inicial</span>
        </div>
        <div className="highlight-item">
          <span className="highlight-valor">{ultimo.drawdown_pct}%</span>
          <span className="highlight-etiqueta">drawdown actual</span>
        </div>
      </div>

      <h3 style={{ fontSize: "0.95rem", marginBottom: 8 }}>Curva de equity (desde {p.start_date})</h3>
      <EquityChart history={p.daily_history} startingCapital={p.starting_capital} />

      <h3 style={{ fontSize: "0.95rem", margin: "20px 0 8px" }}>Pesos objetivo y posiciones actuales</h3>
      <TablaPesos weights={p.weights} holdings={p.holdings} trendStatus={ultimo.trend_status} />

      <h3 style={{ fontSize: "0.95rem", margin: "20px 0 8px" }}>Historial diario</h3>
      <TablaHistorialDiario history={p.daily_history} />
    </div>
  );
}
