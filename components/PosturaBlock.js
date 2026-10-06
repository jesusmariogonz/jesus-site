"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/components/PostHogProvider";

function formatFechaCorta(iso) {
  try {
    return new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

export default function PosturaBlock({ slug }) {
  const [data, setData] = useState(null);
  const [votando, setVotando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [avisoComentario, setAvisoComentario] = useState(null);

  useEffect(() => {
    let activo = true;
    fetch(`/api/posturas/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => activo && setData(d))
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, [slug]);

  if (!data) return null;

  const totalVotos = (data.votos?.a_favor || 0) + (data.votos?.en_contra || 0);
  const pctFavor = totalVotos ? Math.round(((data.votos.a_favor || 0) / totalVotos) * 100) : 0;
  const pctContra = totalVotos ? 100 - pctFavor : 0;

  async function enviarVoto(voto) {
    if (votando) return;
    setVotando(true);
    try {
      const res = await fetch("/api/posturas/votar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, voto }),
      });
      const d = await res.json();
      if (res.ok) {
        trackEvent("postura_vote", { slug, voto });
        setData((prev) => ({ ...prev, votos: d.votos, miVoto: d.miVoto }));
      }
    } finally {
      setVotando(false);
    }
  }

  async function enviarComentario(e) {
    e.preventDefault();
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    setAvisoComentario(null);
    try {
      const res = await fetch("/api/posturas/comentar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, nombre, texto }),
      });
      const d = await res.json();
      setAvisoComentario({ ok: d.ok, mensaje: d.mensaje });
      trackEvent("postura_comment_submit", { slug, estado: d.estado });
      if (d.ok) {
        setTexto("");
        if (d.comentario) {
          setData((prev) => ({ ...prev, comentarios: [...prev.comentarios, d.comentario] }));
        }
      }
    } catch {
      setAvisoComentario({ ok: false, mensaje: "No se pudo enviar el comentario." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="postura-block">
      <h2 className="postura-pregunta">{data.pregunta}</h2>

      <div className="postura-argumentos">
        <div className="postura-argumento postura-favor">
          <span className="postura-argumento-label">A favor</span>
          <p>{data.aFavor}</p>
        </div>
        <div className="postura-argumento postura-contra">
          <span className="postura-argumento-label">En contra</span>
          <p>{data.enContra}</p>
        </div>
      </div>

      <div className="postura-votar">
        <button
          type="button"
          className={`postura-boton-voto${data.miVoto === "a_favor" ? " activo" : ""}`}
          onClick={() => enviarVoto("a_favor")}
          disabled={votando}
        >
          👍 Estoy de acuerdo
        </button>
        <button
          type="button"
          className={`postura-boton-voto${data.miVoto === "en_contra" ? " activo" : ""}`}
          onClick={() => enviarVoto("en_contra")}
          disabled={votando}
        >
          👎 No estoy de acuerdo
        </button>
      </div>

      {totalVotos > 0 && (
        <div className="postura-resultado">
          <div className="postura-barra">
            <div className="postura-barra-favor" style={{ width: `${pctFavor}%` }} />
          </div>
          <span className="postura-resultado-texto">
            {pctFavor}% a favor · {pctContra}% en contra · {totalVotos} voto{totalVotos !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="postura-comentarios">
        <span className="postura-comentarios-titulo">
          Comentarios {data.comentarios?.length > 0 ? `(${data.comentarios.length})` : ""}
        </span>

        {data.comentarios?.map((c) => (
          <div className="postura-comentario" key={c.id}>
            <div className="postura-comentario-cabeza">
              <strong>{c.nombre}</strong>
              <span>{formatFechaCorta(c.created_at)}</span>
            </div>
            <p>{c.texto}</p>
          </div>
        ))}

        <form className="postura-form" onSubmit={enviarComentario}>
          <input
            type="text"
            placeholder="Tu nombre (opcional)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={60}
          />
          <textarea
            placeholder="Explica tu posición…"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={1000}
            rows={3}
            required
          />
          <button type="submit" disabled={enviando || !texto.trim()}>
            {enviando ? "Enviando…" : "Comentar"}
          </button>
          {avisoComentario && (
            <p className={`postura-aviso${avisoComentario.ok ? "" : " error"}`}>
              {avisoComentario.mensaje}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
