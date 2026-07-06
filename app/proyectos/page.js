import { proyectos } from "@/content/proyectos";

export const metadata = { title: "Proyectos" };

export default function Proyectos() {
  return (
    <section className="section">
      <div className="container">
        <span className="sql-meta">proyectos · {proyectos.length}</span>
        <h2>Cosas que he construido</h2>
        <div className="project-grid">
          {proyectos.map((p) => (
            <div className="project-card" key={p.nombre}>
              <span className="sql-meta">proyecto</span>
              <h3>
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener">
                    {p.nombre} ↗
                  </a>
                ) : (
                  p.nombre
                )}
              </h3>
              <p>{p.descripcion}</p>
              <div className="tag-row">
                {p.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
