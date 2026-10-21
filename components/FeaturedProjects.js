import Link from "next/link";
import { PROYECTOS } from "@/lib/proyectos";

/* Home: 3 proyectos representativos (no el catálogo completo) como
   evidencia de experiencia en AI/GenAI, Data/Analytics y Business
   impact. El catálogo completo vive en /proyectos.

   Cada tarjeta muestra problema → solución → impacto en vez de solo
   la descripción general — el salto de calidad que pide mostrar
   resultados, no solo temas. */
const DESTACADOS = ["genai", "recomendacion", "lealtad"];

export default function FeaturedProjects() {
  const proyectos = DESTACADOS.map((id) => PROYECTOS.find((p) => p.id === id)).filter(
    Boolean
  );

  return (
    <section className="jx-wrap featured-projects">
      <div className="featured-projects-head">
        <h2>Proyectos</h2>
        <Link href="/proyectos">Ver todos los proyectos →</Link>
      </div>
      <div className="featured-projects-grid">
        {proyectos.map((p) => (
          <article key={p.id} className="featured-project-card">
            <span className="featured-project-cat">{p.chips[0]}</span>
            <h3>{p.corto}</h3>
            <dl className="featured-project-pse">
              {p.problema && (
                <div>
                  <dt>Problema</dt>
                  <dd>{p.problema}</dd>
                </div>
              )}
              {p.solucion && (
                <div>
                  <dt>Solución</dt>
                  <dd>{p.solucion}</dd>
                </div>
              )}
              {p.impacto && (
                <div>
                  <dt>Impacto</dt>
                  <dd>{p.impacto}</dd>
                </div>
              )}
            </dl>
            <span className="featured-project-region">{p.region}</span>
            <Link href="/proyectos" className="featured-project-cta">
              Ver caso →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
