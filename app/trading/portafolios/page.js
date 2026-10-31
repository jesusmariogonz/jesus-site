"use client";

/* ============================================================
   /trading/portafolios — índice de los 3 Quant Portfolios
   ------------------------------------------------------------
   Conservative Alpha / Balanced Growth / Aggressive Momentum.
   Modelo DISTINTO y COEXISTENTE con el dashboard de 4 buckets en
   /trading — decisión explícita del usuario de comparar ambos
   enfoques antes de decidir cuál usar (o seguir con ambos).
   Mismo patrón de acceso (clave simple, TRADING_DASHBOARD_SECRET).
   ============================================================ */

import Link from "next/link";
import { useEffect, useState } from "react";

const CLAVE_STORAGE = "jx_trading_secret";

const RIESGO_COLOR = {
  conservative_alpha: "#16a34a",
  balanced_growth: "#d97706",
  aggressive_momentum: "#dc2626",
};

export default function QuantPortfoliosIndex() {
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

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <span className="sql-meta">-- trading · quant portfolios</span>
      <h1>Quant Portfolios</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "70ch", marginBottom: 12 }}>
        Tres productos con identidad propia — no tres versiones del mismo
        portafolio con distinto % de riesgo. Cada uno tiene su propio motor
        algorítmico, reglas de rebalanceo, límites de riesgo y benchmark.
        Coexiste con el{" "}
        <Link href="/trading">panel de buckets por horizonte</Link> —
        ambos modelos se están probando en paralelo.
      </p>
      <p style={{ color: "var(--ink-soft)", maxWidth: "70ch", marginBottom: 32 }}>
        Simulado, sin dinero real. Los $1,000 de referencia se reparten
        en partes iguales entre los 3 (para comparar el modelo, no son 3
        cuentas financiadas por separado).
      </p>

      {!data && !error && <p>Cargando…</p>}
      {error && <p className="postura-aviso error">{error}</p>}

      {data && (
        <div className="highlights-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {Object.entries(data.portfolios).map(([id, p]) => {
            const ultimo = p.daily_history[p.daily_history.length - 1];
            return (
              <Link
                key={id}
                href={`/trading/portafolios/${id.replace(/_/g, "-")}`}
                className="article-highlights"
                style={{ display: "block", textDecoration: "none", color: "inherit" }}
              >
                <span
                  className="article-highlights-titulo"
                  style={{ color: RIESGO_COLOR[id] }}
                >
                  {p.name}
                </span>
                <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)", margin: "6px 0 14px" }}>
                  {p.tagline}
                </p>
                <div className="highlight-item" style={{ marginBottom: 8 }}>
                  <span className="highlight-valor">${ultimo?.equity ?? p.starting_capital}</span>
                  <span className="highlight-etiqueta">
                    equity · {ultimo?.cumulative_return_pct >= 0 ? "+" : ""}
                    {ultimo?.cumulative_return_pct ?? 0}%
                  </span>
                </div>
                {p.suspended && (
                  <span style={{ color: "#dc2626", fontSize: "0.8rem", fontWeight: 700 }}>
                    🛑 Suspendido
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
