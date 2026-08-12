import Link from "next/link";
import { LIBROS } from "@/lib/recursos";
import RecursoCard from "@/components/RecursoCard";

export const metadata = {
  title: "Biblioteca",
  description:
    "Libros descargables gratis sobre datos, analítica e IA — sin registro, descarga directa.",
  alternates: { canonical: "/recursos" },
};

export default function Recursos() {
  return (
    <section className="lib-page">
      <div className="container">
        <div className="lib-hero">
          <span className="lib-hero-eyebrow">Biblioteca</span>
          <h1 className="lib-hero-title">Libros para descargar, sin costo.</h1>
          <p className="lib-hero-desc">
            Estos no están a la venta: los escribí para compartir lo que uso
            en el día a día con datos y analítica. Descarga directa, sin
            registro ni correo.
          </p>
        </div>

        <div className="lib-grid">
          {LIBROS.map((l) => (
            <RecursoCard key={l.id} libro={l} />
          ))}
        </div>

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
