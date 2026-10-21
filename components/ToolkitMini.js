import Link from "next/link";
import { TOOLKIT_PRODUCTOS } from "@/lib/toolkit";

/* Home: antes era un párrafo de texto suelto entre Proyectos y
   Biblioteca — ahora es una tarjeta visual, mismo patrón que
   FeaturedProjects/BibliotecaMini, con un solo producto destacado en
   vez de competir con el catálogo completo de /the-toolkit. */
const DESTACADO_ID = "sql-retail";

export default function ToolkitMini() {
  const producto = TOOLKIT_PRODUCTOS.find((p) => p.id === DESTACADO_ID);
  if (!producto) return null;

  return (
    <section className="jx-wrap toolkit-mini">
      <div className="toolkit-mini-card">
        <div
          className="toolkit-mini-img"
          style={{ backgroundImage: `url(${producto.imagen})` }}
        />
        <div className="toolkit-mini-body">
          <span className="toolkit-mini-eyebrow">The Toolkit</span>
          <h2>Menos teoría. Más herramientas que puedes usar.</h2>
          <p>
            <strong>{producto.nombre}.</strong> {producto.resumen}
          </p>
          <div className="toolkit-mini-cta">
            <Link href={`/the-toolkit/${producto.id}`} className="btn">
              Ver este kit →
            </Link>
            <Link href="/the-toolkit" className="btn ghost">
              Ver todo el Toolkit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
