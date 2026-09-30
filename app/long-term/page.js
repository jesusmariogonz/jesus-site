import Link from "next/link";
import { getPulsoMercado, seccion, formatFecha } from "@/lib/posts";
import HorizonteBloque from "@/components/HorizonteBloque";
import HorizonteSubnav from "@/components/HorizonteSubnav";
import { absUrl } from "@/lib/site";

// Dinámico para que "Próxima actualización" siempre refleje la hora
// actual, no la del último build.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Long Term",
  description: "Meses a años: macro, valuaciones, earnings y temas estructurales (IA, energía, nearshoring) — parte de Pulso de Mercado.",
  alternates: { canonical: "/long-term" },
  openGraph: {
    type: "website",
    url: absUrl("/long-term"),
    title: "Long Term — Pulso de Mercado",
    description: "Meses a años: macro, valuaciones, earnings y temas estructurales.",
  },
};

export default function LongTermPage() {
  const { daily, weeklyOutlook, monthly } = getPulsoMercado();

  return (
    <section className="section">
      <div className="container horizonte-page">
        <header className="horizonte-header horizonte-longterm">
          <span className="pulsodash-eyebrow">
            <Link href="/pulso-mercado">Pulso de Mercado</Link> · Horizonte
          </span>
          <h1>Long Term</h1>
          <p className="horizonte-span">Months → Years</p>
        </header>

        <HorizonteSubnav actual="/long-term" />

        <HorizonteBloque
          titulo="Structural View"
          fuente={daily ? formatFecha(daily.fecha) : null}
          tipoCorrida="daily"
          markdown={seccion(daily, "long term")}
          vacio="Sin cambios estructurales reportados en el Daily más reciente."
        />
        <HorizonteBloque
          titulo="Themes to Watch"
          fuente={weeklyOutlook ? `Semana del ${formatFecha(weeklyOutlook.fecha)}` : null}
          tipoCorrida="weeklyOutlook"
          markdown={seccion(weeklyOutlook, "long-term radar")}
          vacio="Todavía no hay un Weekly Outlook publicado con temas de largo plazo."
        />
        <HorizonteBloque
          titulo="Thesis Changes"
          fuente={monthly ? formatFecha(monthly.fecha) : null}
          tipoCorrida="monthly"
          markdown={seccion(monthly, "thesis tracker")}
          vacio="Todavía no hay un Monthly Review publicado con cambios de tesis."
        />
      </div>
    </section>
  );
}
