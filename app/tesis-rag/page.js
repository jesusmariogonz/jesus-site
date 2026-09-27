import Link from "next/link";
import { getPostsBySerie } from "@/lib/posts";
import Reveal from "@/components/Reveal";
import { SITE_NAME, absUrl } from "@/lib/site";

export const metadata = {
  title: "Tesis: Persistencia no gobernada en sistemas RAG",
  description:
    "Serie de 10 entregas semanales: una tesis científica sobre fugas de confidencialidad y fallas del derecho al olvido en sistemas RAG, con experimentos reales y pruebas de hipótesis.",
  alternates: { canonical: "/tesis-rag" },
  openGraph: {
    type: "website",
    url: absUrl("/tesis-rag"),
    title: `Tesis: Persistencia no gobernada en sistemas RAG · ${SITE_NAME}`,
    description:
      "Serie de 10 entregas semanales: una tesis científica sobre fugas de confidencialidad y fallas del derecho al olvido en sistemas RAG.",
  },
};

const TOTAL_SEMANAS = 10;

const SECCIONES = {
  1: "Introducción + Planteamiento del problema",
  2: "Marco teórico + Metodología (parte 1)",
  3: "Metodología (parte 2) — Diseño del Experimento 1",
  4: "Resultados (parte 1) — Experimento 1, sin mitigación",
  5: "Resultados (parte 2) — Experimento 1, con mitigación",
  6: "Metodología (parte 3) — Diseño del Experimento 2",
  7: "Resultados (parte 3) — Experimento 2, sin mitigación",
  8: "Resultados (parte 4) — Experimento 2, con mitigación",
  9: "Discusión",
  10: "Conclusiones + Anexos + documento consolidado",
};

function semanaDe(post) {
  const m = /semana-(\d+)/.exec(post.slug);
  return m ? parseInt(m[1], 10) : null;
}

export default function TesisRag() {
  const entregas = getPostsBySerie("tesis-rag");
  const porSemana = {};
  for (const p of entregas) {
    const s = semanaDe(p);
    if (s) porSemana[s] = p;
  }
  const publicadas = Object.keys(porSemana).length;
  const pct = Math.round((publicadas / TOTAL_SEMANAS) * 100);

  return (
    <section className="section">
      <div className="container tesis-rag-page">
        <Reveal>
          <span className="sql-meta">tesis · domingos 7am CDMX</span>
          <h2>Persistencia no gobernada en sistemas RAG</h2>
          <p className="tesis-rag-subtitulo">
            Midiendo y mitigando fugas de confidencialidad y fallas del
            derecho al olvido en sistemas RAG — una tesis científica en 10
            entregas semanales, con experimentos reales corridos contra la
            API de Anthropic y pruebas de hipótesis estadísticas, no
            narrativa especulativa.
          </p>
        </Reveal>

        <Reveal delay={0.03}>
          <div className="tesis-rag-progreso">
            <div className="tesis-rag-progreso-barra">
              <div
                className="tesis-rag-progreso-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="tesis-rag-progreso-texto">
              {publicadas} de {TOTAL_SEMANAS} entregas publicadas
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <ol className="tesis-rag-lista">
            {Array.from({ length: TOTAL_SEMANAS }, (_, i) => i + 1).map(
              (semana) => {
                const post = porSemana[semana];
                return (
                  <li
                    key={semana}
                    className={`tesis-rag-item${post ? " tesis-rag-item-lista" : " tesis-rag-item-pendiente"}`}
                  >
                    <span className="tesis-rag-semana">
                      Semana {String(semana).padStart(2, "0")}
                    </span>
                    <span className="tesis-rag-seccion">
                      {SECCIONES[semana]}
                    </span>
                    {post ? (
                      <Link href={`/blog/${post.slug}`} className="tesis-rag-link">
                        {post.titulo} →
                      </Link>
                    ) : (
                      <span className="tesis-rag-pendiente-badge">
                        pendiente
                      </span>
                    )}
                  </li>
                );
              }
            )}
          </ol>
        </Reveal>

        <Reveal delay={0.07}>
          <p className="tesis-rag-nota">
            Cada entrega enlaza con la anterior. Sigue la serie desde{" "}
            <Link href="/blog">Ideas</Link>, o vuelve a esta página cada
            domingo para ver la nueva entrega.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
