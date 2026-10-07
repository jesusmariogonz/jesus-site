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

function EstrellasFijas({ n }) {
  return (
    <span className="resena-estrellas" aria-label={`${n} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? "on" : ""}>
          ★
        </span>
      ))}
    </span>
  );
}

function SelectorEstrellas({ valor, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="resena-selector" role="radiogroup" aria-label="Calificación">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={i <= (hover || valor) ? "on" : ""}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          aria-label={`${i} estrella${i > 1 ? "s" : ""}`}
          aria-checked={valor === i}
          role="radio"
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productoId }) {
  const [data, setData] = useState(null);
  const [nombre, setNombre] = useState("");
  const [estrellas, setEstrellas] = useState(0);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    let activo = true;
    fetch(`/api/resenas/${productoId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => activo && setData(d))
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, [productoId]);

  async function enviar(e) {
    e.preventDefault();
    if (!texto.trim() || !estrellas || enviando) return;
    setEnviando(true);
    setAviso(null);
    try {
      const res = await fetch("/api/resenas/comentar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productoId, nombre, estrellas, texto }),
      });
      const d = await res.json();
      setAviso({ ok: d.ok, mensaje: d.mensaje });
      trackEvent("product_review_submit", { productoId, estado: d.estado, estrellas });
      if (d.ok) {
        setTexto("");
        setEstrellas(0);
        if (d.resena) {
          setData((prev) => ({
            resumen: {
              n: (prev?.resumen?.n || 0) + 1,
              promedio:
                ((prev?.resumen?.promedio || 0) * (prev?.resumen?.n || 0) + d.resena.estrellas) /
                ((prev?.resumen?.n || 0) + 1),
            },
            resenas: [d.resena, ...(prev?.resenas || [])],
          }));
        }
      }
    } catch {
      setAviso({ ok: false, mensaje: "No se pudo enviar la reseña." });
    } finally {
      setEnviando(false);
    }
  }

  const n = data?.resumen?.n || 0;
  const promedio = data?.resumen?.promedio || 0;

  return (
    <div className="resenas-block">
      <div className="resenas-cabeza">
        <h2 className="tk-product-block-title">Reseñas</h2>
        {n > 0 && (
          <span className="resenas-resumen">
            <EstrellasFijas n={Math.round(promedio)} /> {promedio.toFixed(1)} · {n} reseña{n !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {n === 0 && (
        <p className="resenas-vacio">
          Todavía no hay reseñas de este producto — sé el primero en dejar la tuya.
        </p>
      )}

      {data?.resenas?.map((r) => (
        <div className="resena-item" key={r.id}>
          <div className="resena-item-cabeza">
            <EstrellasFijas n={r.estrellas} />
            <strong>{r.nombre}</strong>
            <span>{formatFechaCorta(r.created_at)}</span>
          </div>
          <p>{r.texto}</p>
        </div>
      ))}

      <form className="resena-form" onSubmit={enviar}>
        <p className="resena-form-titulo">Deja tu reseña</p>
        <SelectorEstrellas valor={estrellas} onChange={setEstrellas} />
        <input
          type="text"
          placeholder="Tu nombre (opcional)"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={60}
        />
        <textarea
          placeholder="¿Qué te pareció? ¿Te sirvió para lo que buscabas?"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          maxLength={1000}
          rows={3}
          required
        />
        <button type="submit" disabled={enviando || !texto.trim() || !estrellas}>
          {enviando ? "Enviando…" : "Publicar reseña"}
        </button>
        {aviso && (
          <p className={`postura-aviso${aviso.ok ? "" : " error"}`}>{aviso.mensaje}</p>
        )}
      </form>
    </div>
  );
}
