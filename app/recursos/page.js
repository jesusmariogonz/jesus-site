import Link from "next/link";
import { LIBROS } from "@/lib/recursos";
import RecursoCard from "@/components/RecursoCard";

export const metadata = {
  title: "Biblioteca",
  description:
    "Libros sobre datos, analítica, IA y liderazgo — algunos gratis, sin registro; otros de pago, entrega inmediata.",
  alternates: { canonical: "/recursos" },
};

export default function Recursos() {
  return (
    <section className="lib-page">
      <div className="container">
        <div className="lib-hero">
          <span className="sql-meta">biblioteca · {LIBROS.length} libros</span>
          <h1 className="lib-hero-title">Los libros que he escrito.</h1>
          <p className="lib-hero-desc">
            Sobre datos, analítica, IA y liderazgo. Algunos son gratis —
            descarga directa, sin registro ni correo — y otros son de pago,
            con entrega inmediata al comprarlos.
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
