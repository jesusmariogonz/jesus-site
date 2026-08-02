import ProjectsMap from "@/components/ProjectsMap";
import ProjectShowcase from "@/components/ProjectShowcase";

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

        <ProjectShowcase />

        <h2 style={{ marginTop: 8 }}>¿Dónde?</h2>
        <ProjectsMap />
      </div>
    </section>
  );
}
