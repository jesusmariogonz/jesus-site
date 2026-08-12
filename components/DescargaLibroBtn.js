"use client";

import { trackDescarga } from "@/lib/track";

export default function DescargaLibroBtn({ libro }) {
  return (
    <a
      href={libro.archivo}
      download
      className="btn"
      onClick={() => trackDescarga(libro.titulo, "biblioteca-detalle")}
    >
      Descargar PDF gratis
    </a>
  );
}
