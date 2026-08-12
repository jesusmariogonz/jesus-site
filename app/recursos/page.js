import Link from "next/link";
import { RECURSOS_GRATUITOS } from "@/lib/recursos";
import RecursoCard from "@/components/RecursoCard";

export const metadata = {
  title: "Recursos gratuitos",
  description:
    "Libros y guías descargables gratis sobre datos, analítica e IA — sin registro, descarga directa.",
  alternates: { canonical: "/recursos" },
};

export default function Recursos() {
  return (
    <section className="tk-page">
      <div className="container">
        <div className="tk-hero">
          <span className="tk-hero-eyebrow">Recursos gratuitos</span>
          <h1 className="tk-hero-title">Libros para descargar, sin costo.</h1>
          <p className="tk-hero-desc">
            Estos no están a la venta: los escribí para compartir lo que uso
            en el día a día con datos y analítica. Descarga directa, sin
            registro ni correo.
          </p>
        </div>

        <div className="tk-grid">
          {RECURSOS_GRATUITOS.map((r) => (
            <RecursoCard key={r.id} recurso={r} />
          ))}
        </div>

        <div className="tk-cta-final">
          <p>¿Buscas algo más a fondo, con ejercicios y plantillas?</p>
          <Link href="/the-toolkit" className="tk-banner-cta">
            Conoce The Toolkit →
          </Link>
        </div>
      </div>
    </section>
  );
}
