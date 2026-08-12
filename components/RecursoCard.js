"use client";

import Link from "next/link";
import { trackDescarga } from "@/lib/track";

export default function LibroCard({ libro }) {
  return (
    <article className="lib-card">
      <div className="lib-card-cover">
        <span className="lib-card-cover-title">{libro.titulo}</span>
      </div>
      <span className="lib-card-formato">PDF · {libro.paginas} págs.</span>
      <h3 className="lib-card-title">
        <Link href={`/recursos/${libro.id}`}>{libro.titulo}</Link>
      </h3>
      {libro.subtitulo && (
        <p className="lib-card-subtitulo">{libro.subtitulo}</p>
      )}
      <p className="lib-card-desc">{libro.resumen}</p>
      <div className="lib-card-footer">
        <span className="lib-badge-gratis">GRATIS</span>
        <Link href={`/recursos/${libro.id}`} className="btn ghost btn-sm">
          Ver detalle
        </Link>
        <a
          href={libro.archivo}
          download
          className="btn btn-sm"
          onClick={() => trackDescarga(libro.titulo, "biblioteca")}
        >
          Descargar
        </a>
      </div>
    </article>
  );
}
