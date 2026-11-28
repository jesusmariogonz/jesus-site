import Link from "next/link";
import { notFound } from "next/navigation";
import ResumenSemanalCompleto from "@/components/ResumenSemanalCompleto";
import { listarSemanas, getSemana } from "@/lib/trading/resumen-semanal";
import { TRADING_DISCLAIMER } from "@/lib/trading/public-snapshot";
import { absUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return listarSemanas().map((semana) => ({ semana }));
}

function rangoLargo(semana) {
  const f = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("es-MX", { day: "numeric", month: "long" });
  };
  const [y] = semana.fin.split("-");
  return `${f(semana.inicio)} al ${f(semana.fin)} de ${y}`;
}

export async function generateMetadata({ params }) {
  const { semana } = await params;
  const resumen = getSemana(semana);
  if (!resumen) return { title: "Resumen semanal" };
  const titulo = `Resumen semanal de trading · ${rangoLargo(resumen.semana)} — Pulso de Mercado`;
  return {
    title: titulo,
    description:
      "Qué pasó en el mercado y cómo le fue a cada motor de trading algorítmico esta semana: ganancias y pérdidas por activo comprado, con fuentes, y candidatos para la semana siguiente.",
    alternates: { canonical: `/pulso-mercado/trading/resumen-semanal/${semana}` },
    openGraph: { type: "website", url: absUrl(`/pulso-mercado/trading/resumen-semanal/${semana}`), title: titulo },
  };
}

export default async function ResumenSemanalPage({ params }) {
  const { semana } = await params;
  const resumen = getSemana(semana);
  if (!resumen) notFound();

  const semanas = listarSemanas(); // más reciente primero
  const i = semanas.indexOf(semana);
  const anterior = semanas[i + 1];
  const siguiente = semanas[i - 1];

  return (
    <section className="section">
      <div className="container horizonte-page activo-page">
        <span className="pulsodash-eyebrow">
          <Link href="/pulso-mercado/trading">Trading Algorítmico</Link> ·{" "}
          <Link href="/pulso-mercado/trading/resumen-semanal">Resumen semanal</Link>
        </span>
        <h1>Resumen semanal · {rangoLargo(resumen.semana)}</h1>
        <p className="activo-descripcion">
          Todos los motores en un solo lugar, día por día, con el foco en la ganancia o pérdida de cada activo
          comprado. Se publica cada viernes al cierre del mercado.
        </p>
        <div className="trading-disclaimer">{TRADING_DISCLAIMER}</div>

        <ResumenSemanalCompleto resumen={resumen} />

        <nav className="trading-subnav">
          {anterior && <Link href={`/pulso-mercado/trading/resumen-semanal/${anterior}`}>← Semana anterior</Link>}
          {siguiente && <Link href={`/pulso-mercado/trading/resumen-semanal/${siguiente}`}>Semana siguiente →</Link>}
          <Link href="/pulso-mercado/trading/resumen-semanal">Todas las semanas</Link>
          <Link href="/pulso-mercado/trading">Volver a Trading Algorítmico</Link>
        </nav>
      </div>
    </section>
  );
}
