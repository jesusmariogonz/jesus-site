"use client";

import { useState } from "react";
import Link from "next/link";
import { trackDescarga, descargarProtegido } from "@/lib/track";
import { AUTHOR } from "@/lib/site";
import LibroCover from "@/components/LibroCover";

export default function RecursoCard({ libro }) {
  const [descargando, setDescargando] = useState(false);
  const gratis = !libro.precio;

  const onDescargar = async () => {
    setDescargando(true);
    const ok = await descargarProtegido(
      libro.id,
      libro.archivo.split("/").pop()
    );
    if (ok) trackDescarga(libro.titulo, "biblioteca");
    setDescargando(false);
  };

  return (
    <article className="lib-card">
      <Link href={`/recursos/${libro.id}`} aria-label={libro.titulo}>
        <LibroCover
          variante={libro.variante}
          titulo={libro.titulo}
          eyebrow={libro.detalle?.eyebrow || "Biblioteca"}
          paginas={libro.paginas}
          precio={libro.precio}
          gratis={gratis}
        />
      </Link>
      <div className="lib-card-body">
        <h3 className="lib-card-title">
          <Link href={`/recursos/${libro.id}`}>{libro.titulo}</Link>
        </h3>
        <p className="lib-card-por">Por {AUTHOR.name}</p>
        {libro.subtitulo && (
          <p className="lib-card-subtitulo">{libro.subtitulo}</p>
        )}
        <p className="lib-card-desc">{libro.resumen}</p>
        <div className="lib-card-footer">
          <div className="lib-card-footer-info">
            <span className="lib-card-precio">
              {gratis ? (
                <span className="lib-card-precio-gratis">Gratis</span>
              ) : (
                `$${libro.precio} USD`
              )}
            </span>
            <Link href={`/recursos/${libro.id}`} className="lib-card-verdetalle">
              Ver detalle
            </Link>
          </div>
          {gratis ? (
            <button
              type="button"
              className="btn btn-sm"
              onClick={onDescargar}
              disabled={descargando}
            >
              {descargando ? "…" : "Descargar"}
            </button>
          ) : libro.stripePriceId ? (
            <a href={libro.checkoutUrl} className="btn btn-sm">
              Comprar
            </a>
          ) : (
            <span className="btn ghost btn-sm" aria-disabled="true">
              Próximamente
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
