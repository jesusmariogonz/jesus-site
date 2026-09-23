import Link from "next/link";
import { MUNDOS } from "@/lib/mundos";

/* Debajo del carrusel de "Ideas": una tarjeta por mundo con su
   descripción y las últimas 3 notas (título + minutos de lectura), para
   que quien entra pueda decidir a qué mundo meterse antes de navegar. */
export default function IdeasMundos({ notas = [] }) {
  const porMundo = {};
  for (const slug of Object.keys(MUNDOS)) porMundo[slug] = [];
  for (const n of notas) {
    if (porMundo[n.mundo]) porMundo[n.mundo].push(n);
  }

  const mundosConNotas = Object.entries(MUNDOS).filter(
    ([slug]) => porMundo[slug].length > 0
  );

  if (mundosConNotas.length === 0) return null;

  return (
    <div className="ideas-mundos">
      <h3 className="ideas-mundos-titulo">Elige un mundo</h3>
      <div className="ideas-mundos-grid">
        {mundosConNotas.map(([slug, m]) => (
          <article key={slug} className="ideas-mundo-card">
            <h4>{m.nombre}</h4>
            <p className="ideas-mundo-desc">{m.descripcion}</p>
            <ul className="ideas-mundo-notas">
              {porMundo[slug].slice(0, 3).map((n) => (
                <li key={n.slug}>
                  <Link href={`/blog/${n.slug}`}>{n.titulo}</Link>
                  {n.minutos ? (
                    <span className="ideas-mundo-nota-min">
                      {n.minutos} min
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
            <Link href={`/blog/mundo/${slug}`} className="ideas-mundo-cta">
              Ver todas las notas de {m.nombre} →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
