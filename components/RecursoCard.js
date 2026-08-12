"use client";

import { trackDescarga } from "@/lib/track";

export default function RecursoCard({ recurso }) {
  return (
    <article className="tk-card recurso-card">
      <span className="tk-card-formato">PDF · {recurso.paginas} págs.</span>
      <h3 className="tk-card-title">{recurso.titulo}</h3>
      {recurso.subtitulo && (
        <p className="recurso-subtitulo">{recurso.subtitulo}</p>
      )}
      <p className="tk-card-desc">{recurso.resumen}</p>
      <div className="tk-card-footer">
        <span className="tk-card-gratis">GRATIS</span>
        <a
          href={recurso.archivo}
          download
          className="tk-buy"
          onClick={() => trackDescarga(recurso.titulo, "recurso-gratuito")}
        >
          Descargar PDF
        </a>
      </div>
    </article>
  );
}
