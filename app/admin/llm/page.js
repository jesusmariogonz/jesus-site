"use client";

/* Panel de uso de LLM — /admin/llm. Misma clave que /admin/moderacion
   (ADMIN_MODERATION_SECRET, guardada solo en sessionStorage). */

import { useEffect, useState } from "react";

const CLAVE_STORAGE = "jx_admin_secret";
const usd = (n) => `$${Number(n || 0).toFixed(n >= 1 ? 2 : 4)}`;
const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : "—");

export default function LlmPage() {
  const [secret, setSecret] = useState("");
  const [listo, setListo] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const g = sessionStorage.getItem(CLAVE_STORAGE);
    if (g) { setSecret(g); setListo(true); }
  }, []);

  useEffect(() => {
    if (!listo) return;
    (async () => {
      setError(null);
      try {
        const res = await fetch("/api/admin/llm?dias=30", { headers: { "x-admin-secret": secret } });
        if (res.status === 401) {
          setError("Clave incorrecta.");
          sessionStorage.removeItem(CLAVE_STORAGE);
          setListo(false);
          return;
        }
        setData(await res.json());
      } catch {
        setError("No se pudieron cargar las métricas.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo]);

  if (!listo) {
    return (
      <div className="container admin-login">
        <h1>Uso de LLM</h1>
        <form onSubmit={(e) => { e.preventDefault(); sessionStorage.setItem(CLAVE_STORAGE, secret); setListo(true); }}>
          <input type="password" placeholder="Clave de administración" value={secret}
            onChange={(e) => setSecret(e.target.value)} autoFocus />
          <button type="submit">Entrar</button>
        </form>
        {error && <p className="postura-aviso error">{error}</p>}
      </div>
    );
  }

  const t = data?.tareas;
  const llamadasTotal = data?.porModelo?.reduce((a, m) => a + m.llamadas, 0) || 0;

  return (
    <div className="container admin-moderacion">
      <h1>Uso de modelos (últimos 30 días)</h1>
      <p className="admin-moderacion-sub">
        Costos estimados con los precios de <code>lib/llm/modelos.js</code>; confírmalos en la consola de Anthropic.
      </p>
      {error && <p className="postura-aviso error">{error}</p>}
      {!data && !error && <p>Cargando…</p>}
      {data && (
        <>
          <h2 className="admin-moderacion-seccion">Resumen</h2>
          <table className="admin-llm-tabla">
            <tbody>
              <tr><td>Tareas</td><td>{t.tareas}</td></tr>
              <tr><td>Costo promedio por tarea</td><td>{usd(t.costo_prom)}</td></tr>
              <tr><td>Tareas resueltas en Haiku / Sonnet / Opus</td>
                  <td>{pct(t.haiku, t.tareas)} / {pct(t.sonnet, t.tareas)} / {pct(t.opus, t.tareas)}</td></tr>
              <tr><td>Tareas escaladas</td><td>{t.escaladas} ({pct(t.escaladas, t.tareas)})</td></tr>
              <tr><td>Costo 24 h / 7 días / 30 días</td>
                  <td>{usd(data.costos.dia)} / {usd(data.costos.semana)} / {usd(data.costos.mes)}</td></tr>
            </tbody>
          </table>

          <h2 className="admin-moderacion-seccion">Por modelo</h2>
          <table className="admin-llm-tabla">
            <thead><tr><th>Modelo</th><th>Llamadas</th><th>Costo</th><th>Latencia prom.</th><th>Tokens in/out</th><th>Tasa de error</th></tr></thead>
            <tbody>
              {data.porModelo.map((m) => (
                <tr key={m.modelo}>
                  <td>{m.tier} <code>{m.modelo}</code></td>
                  <td>{m.llamadas}</td>
                  <td>{usd(m.costo)}</td>
                  <td>{Math.round(m.latencia_prom)} ms</td>
                  <td>{m.tok_in} / {m.tok_out}</td>
                  <td>{pct(m.errores, m.llamadas)}</td>
                </tr>
              ))}
              {llamadasTotal === 0 && <tr><td colSpan={6}>Aún no hay llamadas registradas.</td></tr>}
            </tbody>
          </table>

          <h2 className="admin-moderacion-seccion">Por tipo de tarea</h2>
          <table className="admin-llm-tabla">
            <thead><tr><th>Tipo</th><th>Llamadas</th><th>Costo</th></tr></thead>
            <tbody>
              {data.porTipo.map((x) => (
                <tr key={x.tipo_tarea}><td>{x.tipo_tarea}</td><td>{x.llamadas}</td><td>{usd(x.costo)}</td></tr>
              ))}
            </tbody>
          </table>

          <h2 className="admin-moderacion-seccion">Últimas decisiones (¿por qué ese modelo?)</h2>
          {data.recientes.map((r, i) => (
            <div className="admin-comentario" key={`${r.task_id}-${i}`}>
              <div className="admin-comentario-meta">
                <span><strong>{r.tier}</strong> · {r.tipo_tarea}{r.escalada_desde ? ` · escalada desde ${r.escalada_desde}` : ""}</span>
                <span>{new Date(r.created_at).toLocaleString("es-MX")}</span>
              </div>
              <p className="admin-comentario-justificacion">
                {r.razon_escalacion ? `Escalación: ${r.razon_escalacion}. ` : ""}Routing: {r.razon_routing || "—"}
              </p>
              <p className="admin-comentario-justificacion">
                {r.exito ? "OK" : "FALLÓ"} · {r.tokens_entrada}/{r.tokens_salida} tokens · {usd(r.costo_usd)} · {r.latencia_ms} ms
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
