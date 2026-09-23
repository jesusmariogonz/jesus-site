import Link from "next/link";
import { MUNDOS } from "@/lib/mundos";

/* Home: vitrina de los 8 mundos temáticos, como puente entre "quién
   soy" (Hero/SqlCard/FeaturedProjects) y "qué escribo" (NotasDestacadas). */
export default function MundosGrid() {
  return (
    <section className="jx-wrap mundos-home">
      <div className="mundos-home-head">
        <h2>Mundos</h2>
        <Link href="/mundos">Ver todos →</Link>
      </div>
      <div className="mundos-home-grid">
        {Object.entries(MUNDOS).map(([slug, m]) => (
          <Link key={slug} href={`/mundos/${slug}`} className="mundo-home-card">
            <h3>{m.nombre}</h3>
            <p>{m.descripcion}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
