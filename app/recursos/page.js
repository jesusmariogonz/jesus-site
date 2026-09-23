import Link from "next/link";
import { LIBROS } from "@/lib/recursos";
import RecursoCard from "@/components/RecursoCard";

export const metadata = {
  title: "Biblioteca",
  description:
    "Libros sobre datos, analítica, IA y liderazgo — algunos gratis, sin registro; otros de pago, entrega inmediata.",
  alternates: { canonical: "/recursos" },
};

const ORDEN_CATEGORIAS = ["Analytics", "AI", "Data", "Architecture", "Business"];

export default function Recursos() {
  const categorias = ORDEN_CATEGORIAS.filter((cat) =>
    LIBROS.some((l) => l.categoria === cat)
  );

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

        {categorias.map((cat) => (
          <div key={cat} className="lib-categoria">
            <h2 className="lib-categoria-titulo">{cat}</h2>
            <div className="lib-grid">
              {LIBROS.filter((l) => l.categoria === cat).map((l) => (
                <RecursoCard key={l.id} libro={l} />
              ))}
            </div>
          </div>
        ))}

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
