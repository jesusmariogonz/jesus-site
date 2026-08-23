import Link from "next/link";
import { notFound } from "next/navigation";
import { LIBROS } from "@/lib/recursos";
import DescargaLibroBtn from "@/components/DescargaLibroBtn";
import LibroCover from "@/components/LibroCover";
import AutorLibro from "@/components/AutorLibro";
import LibroPreview from "@/components/LibroPreview";

/* La vista previa (primeras 10 páginas) no aplica a manuales que ya
   son de 10 páginas o menos — ahí no hay nada que "seguir leyendo". */
const PAGINAS_MIN_PREVIEW = 11;

export function generateStaticParams() {
  return LIBROS.map((l) => ({ slug: l.id }));
}

export function generateMetadata({ params }) {
  const libro = LIBROS.find((l) => l.id === params.slug);
  if (!libro) return {};
  return {
    title: libro.titulo,
    description: libro.resumen,
    alternates: { canonical: `/recursos/${libro.id}` },
  };
}

export default function LibroDetalle({ params }) {
  const libro = LIBROS.find((l) => l.id === params.slug);
  if (!libro) notFound();

  const d = libro.detalle || {};

  return (
    <section className="lib-page">
      <div className="container tk-product-container">
        <Link href="/recursos" className="lib-back">
          ← Biblioteca
        </Link>

        <div className="lib-product-hero">
          <div className="lib-product-copy">
            {d.eyebrow && (
              <span className="lib-hero-eyebrow">{d.eyebrow}</span>
            )}
            <h1 className="lib-product-title">{libro.titulo}</h1>
            {libro.subtitulo && (
              <p className="lib-product-subtitulo">{libro.subtitulo}</p>
            )}
            {d.hook && <p className="lib-product-hook">{d.hook}</p>}
            {libro.precio ? (
              libro.stripePriceId ? (
                <a href={libro.checkoutUrl} className="btn">
                  Comprar ahora · ${libro.precio}
                </a>
              ) : (
                <span className="btn ghost" aria-disabled="true">
                  Próximamente
                </span>
              )
            ) : (
              <DescargaLibroBtn libro={libro} />
            )}
          </div>

          <div className="lib-product-cover">
            <div className="lib-book-wrap">
              <LibroCover
                variante={libro.variante}
                titulo={libro.titulo}
                eyebrow={d.eyebrow || "Biblioteca"}
                paginas={libro.paginas}
                precio={libro.precio}
                gratis={!libro.precio}
                size="hero"
              />
            </div>
          </div>
        </div>

        {libro.paginas >= PAGINAS_MIN_PREVIEW && (
          <div className="lib-product-section">
            <h2>Lee las primeras páginas</h2>
            <LibroPreview libro={libro} />
          </div>
        )}

        {d.paraQuien?.length > 0 && (
          <div className="lib-product-section">
            <h2>¿Para quién es?</h2>
            <ul>
              {d.paraQuien.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {d.incluye?.length > 0 && (
          <div className="lib-product-section">
            <h2>Qué incluye</h2>
            <ul>
              {d.incluye.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {d.resultado && (
          <div className="lib-product-section">
            <h2>Al terminar</h2>
            <p className="lib-product-resultado">{d.resultado}</p>
          </div>
        )}

        <AutorLibro />

        <div className="lib-cta-final">
          <p>¿Buscas algo más a fondo, con ejercicios y plantillas?</p>
          <Link href="/the-toolkit" className="btn">
            Conoce The Toolkit →
          </Link>
        </div>
      </div>
    </section>
  );
}
