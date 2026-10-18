"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AUTHOR } from "@/lib/site";
import LibroCover from "@/components/LibroCover";
import { trackDescarga, descargarProtegido } from "@/lib/track";

/* ============================================================
   /recursos — catálogo editorial de Biblioteca
   ------------------------------------------------------------
   Reemplaza el agrupado vertical por categoría técnica (Analytics/
   Architecture/Business) por una clasificación editorial en español
   (`tema` en lib/recursos.js: IA, Datos, Negocio, Productividad),
   con chips de filtro arriba, un libro destacado (el más reciente) y
   el resto en una cuadrícula compacta de 2 columnas en móvil / 3 en
   escritorio. Las portadas, los destinos de compra/descarga y las
   páginas de detalle de cada libro no cambian — esto es solo la capa
   de organización visual de /recursos.
   ============================================================ */

const ORDEN_TEMAS = ["IA", "Datos", "Negocio", "Productividad"];

function TemaTag({ tema }) {
  const etiquetas = {
    IA: "IA Y SISTEMAS INTELIGENTES",
    Datos: "DATOS Y ANALÍTICA",
    Negocio: "NEGOCIO Y DECISIONES",
    Productividad: "PRODUCTIVIDAD",
  };
  return <span className="biblio-tag">{etiquetas[tema] || tema.toUpperCase()}</span>;
}

function AccionLibro({ libro, descargando, onDescargar }) {
  const gratis = !libro.precio;
  const detalleUrl = libro.landingUrl || `/recursos/${libro.id}`;

  if (gratis) {
    return (
      <button type="button" className="btn btn-sm" onClick={onDescargar} disabled={descargando}>
        {descargando ? "…" : "Descargar"}
      </button>
    );
  }
  if (libro.stripePriceId) {
    return (
      <a href={libro.checkoutUrl} className="btn btn-sm">
        Comprar
      </a>
    );
  }
  return (
    <Link href={detalleUrl} className="btn ghost btn-sm">
      Ver detalle
    </Link>
  );
}

function LibroDestacado({ libro }) {
  const [descargando, setDescargando] = useState(false);
  const gratis = !libro.precio;
  const detalleUrl = libro.landingUrl || `/recursos/${libro.id}`;

  async function onDescargar() {
    setDescargando(true);
    const ok = await descargarProtegido(libro.id, libro.archivo.split("/").pop());
    if (ok) trackDescarga(libro.titulo, "biblioteca");
    setDescargando(false);
  }

  return (
    <div className="biblio-destacado">
      <span className="biblio-destacado-kicker">01 / Destacado</span>
      <div className="biblio-destacado-cuerpo">
        <Link href={detalleUrl} className="biblio-destacado-cover" aria-label={libro.titulo}>
          <LibroCover
            variante={libro.variante}
            titulo={libro.titulo}
            precio={libro.precio}
            gratis={gratis}
            imagen={libro.imagenPortada}
            size="hero"
          />
        </Link>
        <div className="biblio-destacado-info">
          <TemaTag tema={libro.tema} />
          <h2 className="biblio-destacado-titulo">
            <Link href={detalleUrl}>{libro.titulo}</Link>
          </h2>
          {libro.subtitulo && <p className="biblio-destacado-subtitulo">{libro.subtitulo}</p>}
          <div className="biblio-destacado-footer">
            <span className="biblio-destacado-precio">
              {gratis ? <span className="lib-card-precio-gratis">Gratis</span> : `$${libro.precio} MXN`}
            </span>
            <AccionLibro libro={libro} descargando={descargando} onDescargar={onDescargar} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LibroTarjeta({ libro }) {
  const [descargando, setDescargando] = useState(false);
  const gratis = !libro.precio;
  const detalleUrl = libro.landingUrl || `/recursos/${libro.id}`;

  async function onDescargar() {
    setDescargando(true);
    const ok = await descargarProtegido(libro.id, libro.archivo.split("/").pop());
    if (ok) trackDescarga(libro.titulo, "biblioteca");
    setDescargando(false);
  }

  return (
    <article className="lib-card biblio-card">
      <Link href={detalleUrl} aria-label={libro.titulo} className="lib-card-cover">
        <LibroCover
          variante={libro.variante}
          titulo={libro.titulo}
          precio={libro.precio}
          gratis={gratis}
          imagen={libro.imagenPortada}
        />
      </Link>
      <div className="lib-card-body">
        <TemaTag tema={libro.tema} />
        <h3 className="lib-card-title">
          <Link href={detalleUrl}>{libro.titulo}</Link>
        </h3>
        <p className="lib-card-por">Por {AUTHOR.name}</p>
        {libro.subtitulo && <p className="lib-card-subtitulo">{libro.subtitulo}</p>}

        <div className="lib-card-footer">
          <div className="lib-card-footer-info">
            <span className="lib-card-precio">
              {gratis ? <span className="lib-card-precio-gratis">Gratis</span> : `$${libro.precio} MXN`}
            </span>
          </div>
          <AccionLibro libro={libro} descargando={descargando} onDescargar={onDescargar} />
        </div>
      </div>
    </article>
  );
}

export default function BibliotecaExplorer({ libros }) {
  const [tema, setTema] = useState("todos");

  const conteos = useMemo(() => {
    const c = { todos: libros.length };
    for (const t of ORDEN_TEMAS) c[t] = libros.filter((l) => l.tema === t).length;
    return c;
  }, [libros]);

  // El destacado es siempre el libro de pago más reciente del catálogo
  // (el último agregado a lib/recursos.js) — hoy, AI Solution Architect.
  const destacado = useMemo(() => [...libros].reverse().find((l) => l.precio) || libros[0], [libros]);

  const visibles = useMemo(
    () => libros.filter((l) => (tema === "todos" || l.tema === tema) && l.id !== destacado.id),
    [libros, tema, destacado]
  );
  const mostrarDestacado = tema === "todos" || destacado.tema === tema;

  return (
    <>
      <div className="chip-row biblio-filtros">
        <button type="button" className={tema === "todos" ? "chip active" : "chip"} onClick={() => setTema("todos")}>
          Todos ({conteos.todos})
        </button>
        {ORDEN_TEMAS.filter((t) => conteos[t] > 0).map((t) => (
          <button key={t} type="button" className={tema === t ? "chip active" : "chip"} onClick={() => setTema(t)}>
            {t} ({conteos[t]})
          </button>
        ))}
      </div>

      {mostrarDestacado && (
        <div className="biblio-seccion">
          <h2 className="biblio-seccion-titulo">Selección editorial</h2>
          <LibroDestacado libro={destacado} />
        </div>
      )}

      <div className="biblio-seccion">
        <h2 className="biblio-seccion-titulo">Explora la biblioteca</h2>
        <p className="biblio-seccion-sub">
          {conteos[tema] ?? conteos.todos} publicaciones · {tema === "todos" ? "todos los temas" : `tema: ${tema}`}
        </p>
        {visibles.length === 0 ? (
          <p className="biblio-vacio">No hay más libros en este tema por ahora.</p>
        ) : (
          <div className="lib-grid biblio-grid">
            {visibles.map((libro) => (
              <LibroTarjeta key={libro.id} libro={libro} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
