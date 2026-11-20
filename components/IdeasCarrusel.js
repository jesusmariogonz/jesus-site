import Link from "next/link";
import NotasCarrusel from "@/components/NotasCarrusel";
import Reveal from "@/components/Reveal";

/* Home: sección "Ideas" con el carrusel de lo más reciente (el mismo de /blog). */
export default function IdeasCarrusel({ notas }) {
  if (!notas?.length) return null;
  return (
    <section className="jx-wrap jx-notas">
      <Reveal>
        <div className="jx-notas-head">
          <h2>Ideas que merecen tu atención</h2>
          <Link href="/blog">Ver todas →</Link>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <NotasCarrusel notas={notas} titulo="Lo más reciente" />
      </Reveal>
    </section>
  );
}
