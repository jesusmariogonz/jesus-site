import Link from "next/link";
import { notFound } from "next/navigation";
import { ACTIVOS, getActivo } from "@/lib/activos";
import { absUrl } from "@/lib/site";

export function generateStaticParams() {
  return ACTIVOS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const activo = getActivo(slug);
  if (!activo) return { title: "Activo" };
  return {
    title: `${activo.nombre} — Glosario de Pulso de Mercado`,
    description: activo.descripcion,
    alternates: { canonical: `/pulso-mercado/activos/${slug}` },
    openGraph: {
      type: "website",
      url: absUrl(`/pulso-mercado/activos/${slug}`),
      title: activo.nombre,
      description: activo.descripcion,
    },
  };
}

export default async function ActivoPage({ params }) {
  const { slug } = await params;
  const activo = getActivo(slug);
  if (!activo) notFound();

  return (
    <section className="section">
      <div className="container horizonte-page activo-page">
        <span className="pulsodash-eyebrow">
          <Link href="/pulso-mercado">Pulso de Mercado</Link> · Glosario
        </span>
        <h1>{activo.nombre}</h1>
        <p className="activo-mercado">{activo.mercado}</p>
        <p className="activo-descripcion">{activo.descripcion}</p>

        <div className="activo-otros">
          <span className="activo-otros-titulo">Otros activos del glosario</span>
          <div className="activo-otros-lista">
            {ACTIVOS.filter((a) => a.slug !== slug).map((a) => (
              <Link key={a.slug} href={`/pulso-mercado/activos/${a.slug}`}>
                {a.nombre}
              </Link>
            ))}
          </div>
        </div>

        <p style={{ marginTop: 32 }}>
          <Link href="/pulso-mercado">← Volver a Pulso de Mercado</Link>
        </p>
      </div>
    </section>
  );
}
