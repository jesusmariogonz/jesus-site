import Link from "next/link";

/* Propuesta 4: nota destacada + compactas, pills y tiempo de lectura.
   Cada nota: { slug, titulo, resumen, fecha, categoria, minutos }   */

const PILL = {
  Snowflake: "jx-pill-snowflake",
  Databricks: "jx-pill-databricks",
  Azure: "jx-pill-azure",
  Fintech: "jx-pill-fintech",
  Opinión: "jx-pill-opinion",
};

function Pill({ categoria }) {
  return (
    <span className={`jx-pill ${PILL[categoria] || "jx-pill-default"}`}>
      {categoria}
    </span>
  );
}

function Meta({ nota }) {
  const fecha =
    nota.fecha && !isNaN(new Date(nota.fecha))
      ? new Date(nota.fecha).toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;
  const partes = [fecha, nota.minutos ? `${nota.minutos} min de lectura` : null]
    .filter(Boolean)
    .join(" · ");
  if (!partes) return null;
  return <p className="jx-meta">{partes}</p>;
}

export default function NotasDestacadas({ notas }) {
  if (!notas?.length) return null;
  const [principal, ...resto] = notas;

  return (
    <section className="jx-wrap jx-notas">
      <div className="jx-notas-head">
        <h2>Últimas notas</h2>
        <Link href="/blog">Ver todas →</Link>
      </div>

      <div className="jx-notas-grid">
        <Link href={`/blog/${principal.slug}`} className="jx-nota">
          <Pill categoria={principal.categoria} />
          <h3>{principal.titulo}</h3>
          <p>{principal.resumen}</p>
          <Meta nota={principal} />
        </Link>

        <div className="jx-nota-col">
          {resto.slice(0, 2).map((n) => (
            <Link key={n.slug} href={`/blog/${n.slug}`} className="jx-nota-mini">
              <Pill categoria={n.categoria} />
              <h3>{n.titulo}</h3>
              <Meta nota={n} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
