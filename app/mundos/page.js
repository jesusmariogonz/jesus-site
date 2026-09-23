import Link from "next/link";
import { MUNDOS, getPostsPorMundo } from "@/lib/mundos";

export const metadata = {
  title: "Mundos",
  description:
    "Las notas de Jesús González organizadas en 8 mundos temáticos: IA, datos, negocio, México, mercados y más.",
  alternates: { canonical: "/mundos" },
};

export default function Mundos() {
  const porMundo = getPostsPorMundo();
  return (
    <section className="section">
      <div className="container">
        <span className="sql-meta">mundos · 8 temas</span>
        <h2>Mundos</h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: "60ch", margin: "0 0 24px" }}>
          Todo lo que escribo cae en uno de estos 8 mundos. Las categorías de
          siempre (Data Engineering, IA, Fintech, etc.) siguen ahí abajo; esto
          es solo otra forma de navegar por tema.
        </p>
        <ul className="post-list">
          {Object.entries(MUNDOS).map(([slug, m]) => (
            <li key={slug} className="post-card">
              <Link href={`/mundos/${slug}`}>
                <h3>{m.nombre}</h3>
              </Link>
              <p>{m.descripcion}</p>
              <span className="sql-meta">
                {porMundo[slug].length}{" "}
                {porMundo[slug].length === 1 ? "nota" : "notas"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
