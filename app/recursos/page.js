import Link from "next/link";
import { LIBROS } from "@/lib/recursos";
import BibliotecaExplorer from "@/components/BibliotecaExplorer";

export const metadata = {
  title: "Biblioteca",
  description:
    "Libros y frameworks para entender mejor los datos, la inteligencia artificial y los sistemas de negocio — algunos gratis, otros de pago, entrega inmediata.",
  alternates: { canonical: "/recursos" },
};

export default function Recursos() {
  return (
    <section className="lib-page">
      <div className="container">
        <div className="lib-hero">
          <span className="sql-meta">biblioteca · jesús gonzález</span>
          <h1 className="lib-hero-title">Biblioteca</h1>
          <p className="lib-hero-desc">
            Libros y frameworks para entender mejor los datos, la
            inteligencia artificial y los sistemas de negocio.
          </p>
        </div>

        <BibliotecaExplorer libros={LIBROS} />

        <div className="lib-cta-final biblio-cta-toolkit">
          <p>¿Buscas llevar las ideas a la práctica?</p>
          <Link href="/the-toolkit" className="btn">
            Conoce The Toolkit →
          </Link>
        </div>
      </div>
    </section>
  );
}
