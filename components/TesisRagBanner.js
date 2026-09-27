import Link from "next/link";

/* Banner dentro de /blog que apunta a la serie de la tesis "Persistencia
   no gobernada en sistemas RAG" (10 entregas semanales, domingos 7am
   CDMX). Solo aparece si ya existe al menos una entrega publicada. */
export default function TesisRagBanner({ publicadas = 0 }) {
  if (publicadas === 0) return null;

  return (
    <div className="tesis-rag-banner">
      <div className="tesis-rag-banner-texto">
        <span className="tesis-rag-banner-tag">Serie en curso · 10 semanas</span>
        <span className="tesis-rag-banner-titulo">
          Tesis: Persistencia no gobernada en sistemas RAG
        </span>
        <span className="tesis-rag-banner-sub">
          {publicadas} de 10 entregas publicadas — nueva entrega cada domingo.
        </span>
      </div>
      <Link href="/tesis-rag" className="tesis-rag-banner-btn">
        Ver la tesis →
      </Link>
    </div>
  );
}
