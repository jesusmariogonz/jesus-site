import Link from "next/link";
import NotaCover from "@/components/NotaCover";
import Reveal from "@/components/Reveal";

/* Últimas notas — layout editorial: nota principal con portada
   grande + dos compactas con miniatura. */

function Meta({ nota }) {
  const partes = [
    nota.minutos ? `${nota.minutos} min de lectura` : null,
  ].filter(Boolean);
  if (!partes.length) return null;
  return (
    <p className="jx-meta">
      {partes.join(" · ")} <span className="jx-flecha">→</span>
    </p>
  );
}

export default function NotasDestacadas({ notas }) {
  if (!notas?.length) return null;
  const [principal, ...resto] = notas;

  return (
    <section className="jx-wrap jx-notas">
      <Reveal>
        <div className="jx-notas-head">
          <h2>Últimas notas</h2>
          <Link href="/blog">Ver todas →</Link>
        </div>
      </Reveal>

      <div className="jx-notas-grid">
        <Reveal delay={0.05}>
          <Link href={`/blog/${principal.slug}`} className="jx-nota jx-nota-cover">
            <NotaCover categoria={principal.categoria} imagen={principal.imagen} size="lg" />
            <div className="jx-nota-body">
              <h3>{principal.titulo}</h3>
              <p>{principal.resumen}</p>
              <Meta nota={principal} />
            </div>
          </Link>
        </Reveal>

        <div className="jx-nota-col">
          {resto.slice(0, 2).map((n, i) => (
            <Reveal key={n.slug} delay={0.12 + i * 0.08}>
              <Link href={`/blog/${n.slug}`} className="jx-nota-mini jx-nota-mini-cover">
                <NotaCover categoria={n.categoria} imagen={n.imagen} size="sm" />
                <div>
                  <h3>{n.titulo}</h3>
                  <Meta nota={n} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
