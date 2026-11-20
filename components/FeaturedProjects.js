import Link from "next/link";
import { PROYECTOS } from "@/lib/proyectos";
import ProjectShowcase from "@/components/ProjectShowcase";

/* Home: los proyectos independientes y reproducibles (tipo "independiente"),
   con el mismo diseño de tarjetas de /proyectos: portada, explicación al
   pasar el mouse y enlace al expediente completo. El catálogo completo,
   incluidos los casos de experiencia profesional, vive en /proyectos. */
export default function FeaturedProjects() {
  const independientes = PROYECTOS.filter((p) => p.tipo === "independiente").slice(0, 3);
  if (!independientes.length) return null;

  return (
    <section className="jx-wrap featured-projects">
      <div className="featured-projects-head">
        <h2>Proyectos</h2>
        <Link href="/proyectos">Ver todos los proyectos →</Link>
      </div>
      <p className="featured-projects-intro">
        Proyectos independientes y reproducibles: aquí sí puedo mostrar el detalle técnico
        completo, sin restricciones de confidencialidad.
      </p>
      <ProjectShowcase proyectos={independientes} />
    </section>
  );
}
