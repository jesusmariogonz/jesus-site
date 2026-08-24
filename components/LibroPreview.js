"use client";

import { useEffect, useRef, useState } from "react";
import DescargaLibroBtn from "@/components/DescargaLibroBtn";

export default function LibroPreview({ libro }) {
  const gratis = !libro.precio;
  const canvasRef = useRef(null);
  const pdfRef = useRef(null);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [estado, setEstado] = useState("cargando"); // cargando | listo | error

  useEffect(() => {
    let cancelado = false;

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();

        const doc = await pdfjs.getDocument({ url: `/api/recursos/${libro.id}/preview` }).promise;
        if (cancelado) return;
        pdfRef.current = doc;
        setTotalPaginas(doc.numPages);
        setEstado("listo");
      } catch (err) {
        console.error("LibroPreview: error cargando el PDF:", err);
        if (!cancelado) setEstado("error");
      }
    })();

    return () => {
      cancelado = true;
      pdfRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libro.id]);

  useEffect(() => {
    if (estado !== "listo" || !pdfRef.current) return;
    let cancelado = false;

    (async () => {
      const page = await pdfRef.current.getPage(pagina);
      if (cancelado) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const contenedor = canvas.parentElement;
      const escalaBase = page.getViewport({ scale: 1 });
      const escala = (contenedor?.clientWidth || escalaBase.width) / escalaBase.width;
      const viewport = page.getViewport({ scale: escala });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport }).promise;
    })();

    return () => {
      cancelado = true;
    };
  }, [estado, pagina]);

  return (
    <div className="lib-preview">
      <div className="lib-preview-frame">
        {estado === "error" && (
          <p className="lib-preview-error">No pudimos cargar la vista previa.</p>
        )}
        {estado === "cargando" && <p className="lib-preview-cargando">Cargando vista previa…</p>}
        <canvas ref={canvasRef} className={estado === "listo" ? "on" : ""} />
      </div>

      {estado === "listo" && (
        <div className="lib-preview-nav">
          <button
            type="button"
            className="lib-preview-nav-btn"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina <= 1}
            aria-label="Página anterior"
          >
            ← Anterior
          </button>
          <span className="lib-preview-nav-pagina">
            Página {pagina} de {totalPaginas}
          </span>
          <button
            type="button"
            className="lib-preview-nav-btn"
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={pagina >= totalPaginas}
            aria-label="Página siguiente"
          >
            Siguiente →
          </button>
        </div>
      )}

      <div className="lib-preview-cta">
        <p className="lib-preview-nota">
          Primeras {totalPaginas || 10} páginas gratis.{" "}
          {gratis
            ? "El libro completo también es gratis."
            : "Sigue leyendo el libro completo al comprarlo."}
        </p>
        {gratis ? (
          <DescargaLibroBtn libro={libro} />
        ) : libro.stripePriceId ? (
          <a href={libro.checkoutUrl} className="btn">
            Comprar para seguir leyendo · ${libro.precio} MXN
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
