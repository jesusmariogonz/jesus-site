"use client";

import { useState } from "react";
import { trackDescarga, descargarProtegido } from "@/lib/track";

export default function DescargaLibroBtn({ libro }) {
  const [descargando, setDescargando] = useState(false);

  const onClick = async () => {
    setDescargando(true);
    const ok = await descargarProtegido(
      libro.id,
      libro.archivo.split("/").pop()
    );
    if (ok) trackDescarga(libro.titulo, "biblioteca-detalle");
    setDescargando(false);
  };

  return (
    <button type="button" className="btn" onClick={onClick} disabled={descargando}>
      {descargando ? "Descargando…" : "Descargar PDF gratis"}
    </button>
  );
}
