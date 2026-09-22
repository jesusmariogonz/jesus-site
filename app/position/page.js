import Link from "next/link";
import { getPulsoMercado, seccion, formatFecha } from "@/lib/posts";
import HorizonteBloque from "@/components/HorizonteBloque";
import HorizonteSubnav from "@/components/HorizonteSubnav";
import { absUrl } from "@/lib/site";

export const metadata = {
  title: "Position",
  description: "Semanas a meses: tendencia, rotación sectorial, relative strength y MA50/MA200 — parte de Pulso de Mercado.",
  alternates: { canonical: "/position" },
  openGraph: {
    type: "website",
    url: absUrl("/position"),
    title: "Position — Pulso de Mercado",
    description: "Semanas a meses: tendencia, rotación sectorial, relative strength y MA50/MA200.",
  },
};

export default function PositionPage() {
  const { daily, weeklyOutlook } = getPulsoMercado();

  return (
    <section className="section">
      <div className="container horizonte-page">
        <header className="horizonte-header horizonte-position">
          <span className="pulsodash-eyebrow">
            <Link href="/pulso-mercado">Pulso de Mercado</Link> · Horizonte
          </span>
          <h1>Position</h1>
          <p className="horizonte-span">Weeks → Months</p>
        </header>

        <HorizonteSubnav actual="/position" />

        <HorizonteBloque
          titulo="Market Trend"
          fuente={daily ? formatFecha(daily.fecha) : null}
          markdown={seccion(daily, "market regime")}
          vacio="Todavía no hay un Daily publicado para dar contexto de tendencia."
        />
        <HorizonteBloque
          titulo="This Week"
          fuente={daily ? formatFecha(daily.fecha) : null}
          markdown={seccion(daily, "position")}
          vacio="Todavía no hay un Daily publicado con novedades de position."
        />
        <HorizonteBloque
          titulo="Position Radar"
          fuente={weeklyOutlook ? `Semana del ${formatFecha(weeklyOutlook.fecha)}` : null}
          markdown={seccion(weeklyOutlook, "position radar")}
          vacio="Todavía no hay un Weekly Outlook publicado con el Position Radar."
        />
      </div>
    </section>
  );
}
