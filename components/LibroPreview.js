"use client";

import DescargaLibroBtn from "@/components/DescargaLibroBtn";

export default function LibroPreview({ libro }) {
  const gratis = !libro.precio;

  return (
    <div className="lib-preview">
      <div className="lib-preview-frame">
        <iframe
          src={`/api/recursos/${libro.id}/preview#toolbar=0`}
          title={`Vista previa — primeras 10 páginas de ${libro.titulo}`}
          loading="lazy"
        />
      </div>
      <div className="lib-preview-cta">
        <p className="lib-preview-nota">
          Primeras 10 páginas gratis.{" "}
          {gratis
            ? "El libro completo también es gratis."
            : "Sigue leyendo el libro completo al comprarlo."}
        </p>
        {gratis ? (
          <DescargaLibroBtn libro={libro} />
        ) : libro.stripePriceId ? (
          <a href={libro.checkoutUrl} className="btn">
            Comprar para seguir leyendo · ${libro.precio}
          </a>
        ) : (
          <span className="btn ghost" aria-disabled="true">
            Próximamente
          </span>
        )}
      </div>
    </div>
  );
}
