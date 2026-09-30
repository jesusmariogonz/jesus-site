import Link from "next/link";
import { getPulsoMercado, seccion, formatFecha } from "@/lib/posts";
import HorizonteBloque from "@/components/HorizonteBloque";
import HorizonteSubnav from "@/components/HorizonteSubnav";
import { absUrl } from "@/lib/site";

// Dinámico para que "Próxima actualización" siempre refleje la hora
// actual, no la del último build.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Swing",
  description: "Días a semanas: momentum, breakouts, pullbacks y catalizadores puntuales — parte de Pulso de Mercado.",
  alternates: { canonical: "/swing" },
  openGraph: {
    type: "website",
    url: absUrl("/swing"),
    title: "Swing — Pulso de Mercado",
    description: "Días a semanas: momentum, breakouts, pullbacks y catalizadores puntuales.",
  },
};

export default function SwingPage() {
  const { daily, weeklyOutlook } = getPulsoMercado();

  return (
    <section className="section">
      <div className="container horizonte-page">
        <header className="horizonte-header horizonte-swing">
          <span className="pulsodash-eyebrow">
            <Link href="/pulso-mercado">Pulso de Mercado</Link> · Horizonte
          </span>
          <h1>Swing</h1>
          <p className="horizonte-span">Days → Weeks</p>
        </header>

        <HorizonteSubnav actual="/swing" />

        <HorizonteBloque
          titulo="Market Context"
          fuente={daily ? formatFecha(daily.fecha) : null}
          tipoCorrida="daily"
          markdown={seccion(daily, "market regime")}
          vacio="Todavía no hay un Daily publicado para dar contexto de mercado."
        />
        <HorizonteBloque
          titulo="Today's Setups"
          fuente={daily ? formatFecha(daily.fecha) : null}
          tipoCorrida="daily"
          markdown={seccion(daily, "swing")}
          vacio="Todavía no hay un Daily publicado con setups de swing."
        />
        <HorizonteBloque
          titulo="Swing Radar"
          fuente={weeklyOutlook ? `Semana del ${formatFecha(weeklyOutlook.fecha)}` : null}
          tipoCorrida="weeklyOutlook"
          markdown={seccion(weeklyOutlook, "swing radar")}
          vacio="Todavía no hay un Weekly Outlook publicado con el Swing Radar."
        />
      </div>
    </section>
  );
}
