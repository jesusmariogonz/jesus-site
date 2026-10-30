"use client";

/* ============================================================
   Dashboard privado — /trading
   ------------------------------------------------------------
   Lectura de solo-consulta del proyecto algo_trading_platform
   (repo aparte: github.com/jesusmariogonz/algo_trading_platform).
   Mismo patrón de acceso que /admin/moderacion: clave simple
   (TRADING_DASHBOARD_SECRET en Vercel) guardada en sessionStorage,
   sin sistema de usuarios.

   Hoy muestra un snapshot MANUAL (ver lib/trading-snapshot.json) —
   no hay conexión en vivo al motor todavía. Eso es intencional: el
   motor vive en Postgres/un servidor aparte (ver ADR 0002 del otro
   repo), no en este sitio. Cuando exista una API real, solo cambia
   app/api/trading/route.js — esta página no se toca.
   ============================================================ */

import { useEffect, useState } from "react";

const CLAVE_STORAGE = "jx_trading_secret";

function formatFecha(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function MetricaDestacada({ etiqueta, valor }) {
  return (
    <div className="highlight-item">
      <span className="highlight-valor">{valor}</span>
      <span className="highlight-etiqueta">{etiqueta}</span>
    </div>
  );
}

function TablaBacktest({ summary }) {
  return (
    <div className="prose" style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Símbolo</th>
            <th>Retorno total</th>
            <th>Sharpe</th>
            <th>Max drawdown</th>
            <th>Win rate</th>
            <th>Operaciones</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((r) => (
            <tr key={r.symbol}>
              <td>{r.symbol}</td>
              <td>{r.total_return_pct}%</td>
              <td>{r.sharpe_ratio}</td>
              <td>{r.max_drawdown_pct}%</td>
              <td>{r.win_rate_pct}%</td>
              <td>{r.total_trades}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TablaWalkForward({ walkForward }) {
  if (!walkForward) {
    return <p style={{ color: "var(--ink-soft)" }}>Sin walk-forward registrado todavía.</p>;
  }
  const consistentes = walkForward.windows.filter((w) => (w.pct_symbols_profitable || 0) >= 50).length;
  return (
    <>
      <p style={{ color: "var(--ink-soft)", marginBottom: 12 }}>
        {consistentes}/{walkForward.windows.length} ventanas con ≥50% de símbolos en positivo.
      </p>
      <div className="prose" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Ventana</th>
              <th>Período</th>
              <th>Operaciones</th>
              <th>% símbolos positivos</th>
              <th>Retorno prom./símbolo</th>
            </tr>
          </thead>
          <tbody>
            {walkForward.windows.map((w) => (
              <tr key={w.window}>
                <td>{w.window}</td>
                <td>
                  {w.start} → {w.end}
                </td>
                <td>{w.total_trades}</td>
                <td>{w.pct_symbols_profitable ?? "—"}%</td>
                <td>{w.avg_return_pct_per_trade_sum ?? "—"}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function EstrategiaCard({ id, data }) {
  const mejor = data.backtest.summary[0];
  return (
    <div className="article-highlights" style={{ marginBottom: 32 }}>
      <span className="article-highlights-titulo">
        {data.name} · v{data.strategy_version}
      </span>

      <div className="highlights-grid" style={{ marginBottom: 20 }}>
        <MetricaDestacada etiqueta="símbolos probados" valor={data.backtest.universe_size} />
        <MetricaDestacada etiqueta="mejor retorno" valor={`${mejor.total_return_pct}% (${mejor.symbol})`} />
        <MetricaDestacada
          etiqueta="comisión + slippage"
          valor={`${(data.backtest.fees * 100).toFixed(2)}% + ${(data.backtest.slippage * 100).toFixed(2)}%`}
        />
      </div>

      <h3 style={{ fontSize: "1rem", marginBottom: 8 }}>Backtest completo</h3>
      <TablaBacktest summary={data.backtest.summary} />

      <h3 style={{ fontSize: "1rem", margin: "24px 0 8px" }}>Walk-forward</h3>
      <TablaWalkForward walkForward={data.walk_forward} />
    </div>
  );
}

export default function TradingDashboard() {
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
      const res = await fetch("/api/trading", {
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
        <h1>Trading</h1>
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

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <span className="sql-meta">-- trading · algo_trading_platform</span>
      <h1>Panel de investigación cuantitativa</h1>

      {!data && !error && <p>Cargando…</p>}
      {error && <p className="postura-aviso error">{error}</p>}

      {data && (
        <>
          <p style={{ color: "var(--ink-soft)", maxWidth: "70ch", marginBottom: 32 }}>
            Snapshot manual sincronizado el {formatFecha(data.generated_at)} desde{" "}
            <code>algo_trading_platform</code>. Sin conexión en vivo todavía — estas
            estrategias están en fase de investigación, sin dinero real ni ejecución
            automática.
          </p>

          {Object.entries(data.strategies).map(([id, estrategia]) => (
            <EstrategiaCard key={id} id={id} data={estrategia} />
          ))}
        </>
      )}
    </div>
  );
}
