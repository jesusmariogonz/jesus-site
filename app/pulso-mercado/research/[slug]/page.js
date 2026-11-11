import Link from "next/link";
import { notFound } from "next/navigation";
import { absUrl } from "@/lib/site";
import { EXPERIMENTOS, getExperimento } from "@/lib/research/experimentos";
import Exp001Resultado from "@/components/Exp001Resultado";
import Exp001Reporte from "@/components/research/Exp001Reporte";

// Contenido de detalle de cada experimento, por slug. Un experimento nuevo
// agrega aquí su componente de resultado.
const DETALLES = {
  "exp-001-modelo-de-emergencia": () => (
    <>
      <Exp001Reporte />
      <div className="activo-bloque">
        <details>
          <summary><strong>Resumen corto para lectores generales</strong></summary>
          <div style={{ marginTop: 12 }}>
            <Exp001Resultado />
          </div>
        </details>
      </div>
      <div className="activo-bloque">
        <h2>El medidor que sale de este experimento</h2>
        <p className="activo-descripcion">
          El modelo alimenta un indicador diario de estrés de mercado, visible para todos en la{" "}
          <Link href="/pulso-mercado">página principal de Pulso de Mercado</Link>. Sigue siendo
          informativo y experimental: el resultado de este experimento es inconcluso, no validado.
        </p>
      </div>
    </>
  ),
};

export function generateStaticParams() {
  return EXPERIMENTOS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const e = getExperimento(slug);
  if (!e) return {};
  const title = `${e.id}: ${e.nombre} — Research Lab`;
  return {
    title,
    description: e.resumen,
    alternates: { canonical: `/pulso-mercado/research/${e.slug}` },
    openGraph: {
      type: "article",
      url: absUrl(`/pulso-mercado/research/${e.slug}`),
      title,
      description: e.resumen,
      images: [{ url: absUrl(e.imagen) }],
    },
  };
}

export default async function ExperimentoPage({ params }) {
  const { slug } = await params;
  const e = getExperimento(slug);
  const Detalle = DETALLES[slug];
  if (!e || !Detalle) notFound();

  return (
    <section className="section">
      <div className="container horizonte-page activo-page">
        <span className="pulsodash-eyebrow">
          <Link href="/pulso-mercado">Pulso de Mercado</Link> ·{" "}
          <Link href="/pulso-mercado/research">Research Lab</Link> · {e.id}
        </span>
        <h1>{e.nombre}</h1>
        <p className="activo-descripcion">
          <span className={`pshow-tipo exp-estado exp-estado--${e.estado.toLowerCase()}`}>{e.estado}</span>{" "}
          {e.dominio} · {e.fecha}
        </p>
        <p className="activo-descripcion">{e.resumen}</p>

        <Detalle />

        <p style={{ marginTop: 32 }}>
          <Link href="/pulso-mercado/research">← Volver al Research Lab</Link>
        </p>
      </div>
    </section>
  );
}
