"use client";

/* ============================================================
   Dashboard privado — /trading
   ------------------------------------------------------------
   Lectura de solo-consulta del proyecto algo_trading_platform
   (repo aparte: github.com/jesusmariogonz/algo_trading_platform).
   Mismo patrón de acceso que /admin/moderacion: clave simple
   (TRADING_DASHBOARD_SECRET en Vercel) guardada en sessionStorage,
   sin sistema de usuarios.

   Hoy muestra snapshots MANUALES/sincronizados por rutina (ver
   lib/trading-snapshot.json para investigación/backtest y
   lib/paper-trading-snapshot.json para el paper trading diario) —
   no hay conexión en vivo al motor todavía. Eso es intencional: el
   motor vive en Postgres/un servidor aparte (ver ADR 0002 del otro
   repo), no en este sitio. Cuando exista una API real, solo cambia
   app/api/trading/route.js — esta página no se toca.
   ============================================================ */

import Link from "next/link";
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

const BUCKET_LABELS = {
  largo_plazo: "Largo Plazo (40%)",
  mediano_plazo: "Mediano Plazo (30%)",
  riesgo_alto: "Riesgo Alto (20%)",
  muy_alta_volatilidad: "Muy Alta Volatilidad (10%)",
};

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
    history.length === 1
      ? width / 2
      : pad.left + (i / (history.length - 1)) * (width - pad.left - pad.right);
  const y = (v) => height - pad.bottom - ((v - min) / range) * (height - pad.top - pad.bottom);

  const path = history.map((h, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(h.equity).toFixed(1)}`).join(" ");
  const baselineY = y(startingCapital);
  const ultimo = history[history.length - 1];
  const subio = ultimo.equity >= startingCapital;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <line
        x1={pad.left}
        x2={width - pad.right}
        y1={baselineY}
        y2={baselineY}
        stroke="var(--line-soft)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <path d={path} fill="none" stroke={subio ? "#16a34a" : "#dc2626"} strokeWidth="2" />
      {history.map((h, i) => (
        <circle key={h.date} cx={x(i)} cy={y(h.equity)} r="3" fill={subio ? "#16a34a" : "#dc2626"} />
      ))}
      <text x={pad.left} y={height - 4} fontSize="10" fill="var(--ink-soft)">
        {history[0].date}
      </text>
      <text x={width - pad.right} y={height - 4} fontSize="10" fill="var(--ink-soft)" textAnchor="end">
        {ultimo.date}
      </text>
    </svg>
  );
}

function TablaPosiciones({ posiciones, tipo }) {
  if (!posiciones?.length) {
    return <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>Ninguna.</p>;
  }
  return (
    <div className="prose" style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Símbolo</th>
            <th>Estrategia</th>
            <th>Entrada</th>
            <th>Precio entrada</th>
            {tipo === "abiertas" ? <th>Stop</th> : <th>Salida</th>}
            {tipo === "abiertas" ? <th>Acciones</th> : <th>P&amp;L</th>}
            {tipo === "cerradas" && <th>Razón</th>}
          </tr>
        </thead>
        <tbody>
          {posiciones.map((p, i) => (
            <tr key={`${p.symbol}-${p.entry_date}-${i}`}>
              <td>{p.symbol}</td>
              <td>{p.strategy}</td>
              <td>{p.entry_date}</td>
              <td>${p.entry_price}</td>
              {tipo === "abiertas" ? <td>${p.stop_price}</td> : <td>${p.exit_price}</td>}
              {tipo === "abiertas" ? (
                <td>{p.shares}</td>
              ) : (
                <td style={{ color: p.pnl >= 0 ? "#16a34a" : "#dc2626" }}>
                  ${p.pnl} ({p.pnl_pct}%)
                </td>
              )}
              {tipo === "cerradas" && <td>{p.reason === "stop_hit" ? "Stop" : "Señal"}</td>}
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
            <th>Abiertas</th>
            <th>Cerradas hoy</th>
            <th>P&amp;L realizado hoy</th>
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
              <td>{h.open_count}</td>
              <td>{h.closed_today}</td>
              <td>{h.realized_pnl_today !== 0 ? `$${h.realized_pnl_today}` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaperTradingBucketCard({ bucketKey, bucket }) {
  const label = BUCKET_LABELS[bucketKey] || bucketKey;

  if (!bucket) {
    return (
      <div className="article-highlights" style={{ marginBottom: 24, opacity: 0.6 }}>
        <span className="article-highlights-titulo">{label}</span>
        <p style={{ color: "var(--ink-soft)", marginTop: 8 }}>
          Sin estrategia construida todavía — sin paper trading en este bucket.
        </p>
      </div>
    );
  }

  const ultimo = bucket.daily_history[bucket.daily_history.length - 1];
  const totalCerradas = bucket.closed_positions.length;
  const ganadoras = bucket.closed_positions.filter((p) => p.pnl > 0).length;
  const winRate = totalCerradas ? Math.round((ganadoras / totalCerradas) * 100) : null;

  return (
    <div className="article-highlights" style={{ marginBottom: 32 }}>
      <span className="article-highlights-titulo">{label}</span>

      <div className="highlights-grid" style={{ marginBottom: 20 }}>
        <MetricaDestacada etiqueta="equity" valor={`$${ultimo.equity}`} />
        <MetricaDestacada
          etiqueta="retorno acumulado"
          valor={`${ultimo.cumulative_return_pct >= 0 ? "+" : ""}${ultimo.cumulative_return_pct}%`}
        />
        <MetricaDestacada etiqueta="capital inicial" valor={`$${bucket.starting_capital}`} />
        <MetricaDestacada etiqueta="abiertas / cerradas" valor={`${ultimo.open_count} / ${totalCerradas}`} />
        {winRate !== null && <MetricaDestacada etiqueta="win rate" valor={`${winRate}%`} />}
      </div>

      <h3 style={{ fontSize: "0.95rem", marginBottom: 8 }}>Curva de equity (desde {bucket.start_date})</h3>
      <EquityChart history={bucket.daily_history} startingCapital={bucket.starting_capital} />

      <h3 style={{ fontSize: "0.95rem", margin: "20px 0 8px" }}>Posiciones abiertas hoy</h3>
      <TablaPosiciones posiciones={bucket.open_positions} tipo="abiertas" />

      <h3 style={{ fontSize: "0.95rem", margin: "20px 0 8px" }}>
        Posiciones cerradas ({totalCerradas})
      </h3>
      <TablaPosiciones posiciones={[...bucket.closed_positions].reverse().slice(0, 10)} tipo="cerradas" />

      <h3 style={{ fontSize: "0.95rem", margin: "20px 0 8px" }}>Historial diario</h3>
      <TablaHistorialDiario history={bucket.daily_history} />
    </div>
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
      <p style={{ marginBottom: 24 }}>
        <Link href="/trading/portafolios">→ Ver los 3 Quant Portfolios (Conservative Alpha / Balanced Growth / Aggressive Momentum)</Link>
      </p>

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

          <section style={{ marginBottom: 56 }}>
            <h2>Paper Trading — en curso</h2>
            <p style={{ color: "var(--ink-soft)", maxWidth: "70ch", marginBottom: 24 }}>
              Simulación diaria, sin dinero real: cada día de mercado el motor abre y
              cierra posiciones con las mismas reglas que operaría en vivo, usando los
              precios reales de cierre. El objetivo es acumular 3-4 semanas de este
              historial antes de evaluar si vale la pena pasar a dinero real.
              {data.paperTrading?.generated_at && (
                <> Última actualización: {formatFecha(data.paperTrading.generated_at)}.</>
              )}
            </p>
            {Object.keys(BUCKET_LABELS).map((bucketKey) => (
              <PaperTradingBucketCard
                key={bucketKey}
                bucketKey={bucketKey}
                bucket={data.paperTrading?.buckets?.[bucketKey]}
              />
            ))}
          </section>

          <section>
            <h2>Investigación y backtesting</h2>
            {Object.entries(data.strategies).map(([id, estrategia]) => (
              <EstrategiaCard key={id} id={id} data={estrategia} />
            ))}
          </section>
        </>
      )}
    </div>
  );
}
