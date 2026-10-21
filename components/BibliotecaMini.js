import Link from "next/link";
import { LIBROS } from "@/lib/recursos";
import LibroCover from "@/components/LibroCover";

/* Home: los 3 libros más recientes de la Biblioteca (no el catálogo
   completo, que vive en /recursos) — mismo patrón que FeaturedProjects:
   una muestra, con enlace al catálogo completo. */
const DESTACADOS = LIBROS.slice(-3).reverse();

export default function BibliotecaMini() {
  return (
    <section className="jx-wrap biblioteca-mini">
      <div className="biblioteca-mini-head">
        <h2>Biblioteca</h2>
        <Link href="/recursos">Ver toda la biblioteca →</Link>
      </div>
      <p className="biblioteca-mini-texto">
        Menos teoría, más herramientas que puedes usar: libros y guías sobre
        datos, IA y negocio, gratis y de pago.
      </p>
      <div className="biblioteca-mini-grid">
        {DESTACADOS.map((l) => (
          <Link key={l.id} href={`/recursos/${l.id}`} className="biblioteca-mini-card">
            <LibroCover
              variante={l.variante}
              titulo={l.titulo}
              precio={l.precio}
              gratis={!l.precio}
              imagen={l.imagenPortada}
              size="card"
            />
            <h3>{l.titulo}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
