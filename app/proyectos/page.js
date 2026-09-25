import Link from "next/link";
import ProjectsMap from "@/components/ProjectsMap";
import ProjectShowcase from "@/components/ProjectShowcase";
import StatsStrip from "@/components/StatsStrip";

export const metadata = {
  title: "Proyectos",
  description:
    "Proyectos de datos, analítica e inteligencia artificial en México, Latinoamérica y Europa.",
  alternates: { canonical: "/proyectos" },
};

export default function Proyectos() {
  return (
    <section className="section">
      <div className="container">
        <header>
          <span className="sql-meta">proyectos · 8 · 7 países</span>
          <h1>Proyectos en el mundo</h1>
          <p className="pmap-intro">
            Iniciativas de datos, analítica e inteligencia artificial en las
            que he participado, desde México y Latinoamérica hasta Europa.
          </p>
        </header>

        <StatsStrip />

        <ProjectShowcase />

        <h2 style={{ marginTop: 8 }}>¿Dónde?</h2>
        <ProjectsMap />

        <div className="lib-cta-final">
          <p>¿Quieres conocer mi trayectoria completa, leer cómo pienso estos problemas, o llevarte plantillas listas para usar?</p>
          <Link href="/sobre-mi" className="btn ghost">
            Sobre mí →
          </Link>{" "}
          <Link href="/blog" className="btn ghost" style={{ marginLeft: 10 }}>
            Leer el blog →
          </Link>{" "}
          <Link href="/the-toolkit" className="btn" style={{ marginLeft: 10 }}>
            Ver Toolkit →
          </Link>
        </div>
      </div>
    </section>
  );
}
