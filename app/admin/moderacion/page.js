"use client";

/* ============================================================
   Panel de moderación — /admin/moderacion
   ------------------------------------------------------------
   Muestra los comentarios que la IA clasificó como "ambiguos" (ni
   claramente limpios ni claramente tóxicos) para que tú decidas.
   Protegido con una clave simple (ADMIN_MODERATION_SECRET en Vercel),
   la misma idea que NEWSLETTER_NOTIFY_SECRET — no es un login de
   usuarios, solo evita que cualquiera entre a aceptar/rechazar.
   La clave se guarda en sessionStorage (se borra al cerrar la
   pestaña), nunca en la URL ni en localStorage.
   ============================================================ */

import { useEffect, useState } from "react";

const CLAVE_STORAGE = "jx_admin_secret";

export default function ModeracionPage() {
  const [secret, setSecret] = useState("");
  const [secretGuardado, setSecretGuardado] = useState(false);
  const [pendientes, setPendientes] = useState(null);
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState(null);

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
      const res = await fetch("/api/admin/comentarios", {
        headers: { "x-admin-secret": secret },
      });
      if (res.status === 401) {
        setError("Clave incorrecta.");
        sessionStorage.removeItem(CLAVE_STORAGE);
        setSecretGuardado(false);
        return;
      }
      const data = await res.json();
      setPendientes(data.pendientes || []);
    } catch {
      setError("No se pudo cargar la cola de moderación.");
    }
  }

  function entrar(e) {
    e.preventDefault();
    sessionStorage.setItem(CLAVE_STORAGE, secret);
    setSecretGuardado(true);
  }

  async function decidir(id, decision) {
    setProcesando(id);
    try {
      const res = await fetch("/api/admin/comentarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ id, decision }),
      });
      if (res.ok) {
        setPendientes((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setProcesando(null);
    }
  }

  if (!secretGuardado) {
    return (
      <div className="container admin-login">
        <h1>Moderación</h1>
        <form onSubmit={entrar}>
          <input
            type="password"
            placeholder="Clave de administración"
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
    <div className="container admin-moderacion">
      <h1>Comentarios pendientes de revisión</h1>
      <p className="admin-moderacion-sub">
        Clasificados por la IA como ambiguos — no se publican hasta que tú decidas.
      </p>

      {error && <p className="postura-aviso error">{error}</p>}

      {pendientes === null && <p>Cargando…</p>}
      {pendientes?.length === 0 && <p>No hay comentarios pendientes 🎉</p>}

      {pendientes?.map((c) => (
        <div className="admin-comentario" key={c.id}>
          <div className="admin-comentario-meta">
            <span>
              <strong>{c.nombre}</strong> en <code>{c.slug}</code>
            </span>
            <span>{new Date(c.created_at).toLocaleString("es-MX")}</span>
          </div>
          <p className="admin-comentario-texto">{c.texto}</p>
          {c.justificacion && (
            <p className="admin-comentario-justificacion">Nota de la IA: {c.justificacion}</p>
          )}
          <div className="admin-comentario-acciones">
            <button
              type="button"
              className="admin-boton-aceptar"
              disabled={procesando === c.id}
              onClick={() => decidir(c.id, "aceptar")}
            >
              ✓ Aceptar
            </button>
            <button
              type="button"
              className="admin-boton-rechazar"
              disabled={procesando === c.id}
              onClick={() => decidir(c.id, "rechazar")}
            >
              ✕ Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
