import Link from "next/link";
import { notFound } from "next/navigation";
import { LIBROS } from "@/lib/recursos";
import DescargaLibroBtn from "@/components/DescargaLibroBtn";
import LibroBookIso from "@/components/LibroBookIso";

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
            <DescargaLibroBtn libro={libro} />
          </div>

          <div className="lib-product-cover">
            <LibroBookIso
              titulo={libro.titulo}
              chip={`${libro.paginas}p`}
              cover={libro.cover}
            />
          </div>
        </div>

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
