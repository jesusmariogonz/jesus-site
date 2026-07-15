"use client";

import { useState } from "react";

/* Botonera al final de cada nota:
   - Conectar con Jesús en LinkedIn (perfil)
   - Compartir la nota: LinkedIn, Facebook, copiar enlace,
     y "Compartir…" nativo del dispositivo si está disponible. */

const LINKEDIN_PERFIL =
  "https://www.linkedin.com/in/jesus-mario-gonzalez-siller-545301ab/";

export default function ShareRow({ titulo }) {
  const [copiado, setCopiado] = useState(false);

  const url = () => window.location.href;

  const abrir = (buildUrl) => {
    const destino = buildUrl(encodeURIComponent(url()));
    // En pantallas táctiles el popup con tamaño fijo hace que la app
    // nativa intercepte el enlace y pierda la URL a compartir; ahí
    // abrimos en pestaña normal. En escritorio sí usamos popup.
    const esMovil = window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;
    window.open(
      destino,
      "_blank",
      esMovil ? "noopener" : "noopener,width=640,height=520"
    );
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      /* clipboard no disponible */
    }
  };

  const nativo = async () => {
    try {
      await navigator.share({ title: titulo, url: url() });
    } catch {
      /* usuario canceló */
    }
  };

  const puedeNativo =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div className="share-row">
      <a
        className="btn"
        href={LINKEDIN_PERFIL}
        target="_blank"
        rel="noopener"
      >
        Conecta conmigo en LinkedIn
      </a>
      <div className="share-social">
        <span className="share-label">Compartir:</span>
        <button
          type="button"
          className="btn ghost btn-sm"
          onClick={() =>
            abrir((u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`)
          }
        >
          LinkedIn
        </button>
        <button
          type="button"
          className="btn ghost btn-sm"
          onClick={() =>
            abrir((u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`)
          }
        >
          Facebook
        </button>
        <button type="button" className="btn ghost btn-sm" onClick={copiar}>
          {copiado ? "✓ Copiado" : "Copiar enlace"}
        </button>
        {puedeNativo && (
          <button type="button" className="btn ghost btn-sm" onClick={nativo}>
            Compartir…
          </button>
        )}
      </div>
    </div>
  );
}
