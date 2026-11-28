import Link from "next/link";
import ResumenSemanalCompleto from "@/components/ResumenSemanalCompleto";
import { getUltimaSemana } from "@/lib/trading/resumen-semanal";
import { TRADING_DISCLAIMER } from "@/lib/trading/public-snapshot";
import { absUrl } from "@/lib/site";

export const metadata = {
  title: "Resumen semanal de trading — Pulso de Mercado",
  description:
    "Qué pasó en el mercado y cómo le fue a cada motor de trading algorítmico la última semana: ganancias y pérdidas por activo comprado, con fuentes, y candidatos para la semana siguiente.",
  alternates: { canonical: "/pulso-mercado/trading/resumen-semanal" },
  openGraph: {
    type: "website",
    url: absUrl("/pulso-mercado/trading/resumen-semanal"),
    title: "Resumen semanal de trading — Pulso de Mercado",
  },
};

function rangoLargo(semana) {
  const f = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("es-MX", { day: "numeric", month: "long" });
  };
  const [y] = semana.fin.split("-");
  return `${f(semana.inicio)} al ${f(semana.fin)} de ${y}`;
}

export default function ResumenSemanalPage() {
  const ultima = getUltimaSemana();
  return (
    <section className="section">
      <div className="container horizonte-page activo-page">
        <span className="pulsodash-eyebrow">
          <Link href="/pulso-mercado/trading">Trading Algorítmico</Link> · Resumen semanal
        </span>
        {ultima ? (
          <>
            <h1>Resumen semanal · {rangoLargo(ultima.resumen.semana)}</h1>
            <p className="activo-descripcion">
              Qué pasó la última semana: todos los motores en un solo lugar, día por día, con el foco en la ganancia
              o pérdida de cada activo comprado. Se actualiza cada viernes al cierre del mercado y reemplaza al
              resumen de la semana anterior.
            </p>
            <div className="trading-disclaimer">{TRADING_DISCLAIMER}</div>
            <ResumenSemanalCompleto resumen={ultima.resumen} />
          </>
        ) : (
          <>
            <h1>Resumen semanal</h1>
            <p className="pulsodash-vacio">Todavía no hay un resumen publicado.</p>
          </>
        )}
        <nav className="trading-subnav">
          <Link href="/pulso-mercado/trading">Volver a Trading Algorítmico</Link>
        </nav>
      </div>
    </section>
  );
}
