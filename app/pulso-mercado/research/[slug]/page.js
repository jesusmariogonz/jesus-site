import Link from "next/link";
import { notFound } from "next/navigation";
import { absUrl } from "@/lib/site";
import { EXPERIMENTOS, getExperimento } from "@/lib/research/experimentos";
import EmergencyGauge from "@/components/EmergencyGauge";
import Exp001Resultado from "@/components/Exp001Resultado";
import Exp001Reporte from "@/components/research/Exp001Reporte";
import Exp002Resultado from "@/components/Exp002Resultado";
import Exp002Reporte from "@/components/research/Exp002Reporte";

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
        <h2>El medidor de estrés de este experimento</h2>
        <p className="activo-descripcion">
          Un medidor sencillo del modelo de este experimento: combina tendencia, volatilidad,
          correlación entre sectores, crédito, amplitud y velocidad de la caída. Entre más se acerca a
          rojo, más se parece el mercado de ese día a los episodios de estrés del pasado.{" "}
          <strong>Ya no se actualiza</strong>: el 17 de noviembre de 2026 se retiró de la página
          principal de Pulso de Mercado y se dejó de calcular a diario. Lo que ves abajo es su última
          lectura, congelada. Sigue siendo informativo y experimental: el resultado del experimento es
          inconcluso, no validado, y no es una predicción ni una recomendación.
        </p>
        <EmergencyGauge />
        <p className="activo-descripcion" style={{ marginTop: 14 }}>
          El indicador que sí se actualiza a diario es el{" "}
          <Link href="/pulso-mercado">medidor de riesgo y volatilidad</Link> de la página principal
          de Pulso de Mercado, que es otro modelo.
        </p>
      </div>
    </>
  ),
  "exp-002-growth-max-global": () => (
    <>
      <Exp002Reporte />
      <div className="activo-bloque">
        <details>
          <summary><strong>Resumen corto para lectores generales</strong></summary>
          <div style={{ marginTop: 12 }}>
            <Exp002Resultado />
          </div>
        </details>
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
