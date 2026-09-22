import { getPulsoMercado, seccion, formatFecha } from "@/lib/posts";
import HorizonteBloque from "@/components/HorizonteBloque";
import { absUrl } from "@/lib/site";

export const metadata = {
  title: "Calendario",
  description: "Fed, Banxico, earnings y datos económicos que pueden mover el mercado — parte de Pulso de Mercado.",
  alternates: { canonical: "/calendario" },
  openGraph: {
    type: "website",
    url: absUrl("/calendario"),
    title: "Calendario — Pulso de Mercado",
    description: "Fed, Banxico, earnings y datos económicos que pueden mover el mercado.",
  },
};

export default function CalendarioPage() {
  const { daily, weeklyOutlook } = getPulsoMercado();

  return (
    <section className="section">
      <div className="container horizonte-page">
        <header className="horizonte-header">
          <span className="pulsodash-eyebrow">Pulso de Mercado · Calendario</span>
          <h1>Calendario</h1>
          <p className="horizonte-span">Fed · Banxico · Earnings · Datos económicos</p>
        </header>

        <HorizonteBloque
          titulo="Calendario económico de la semana"
          fuente={weeklyOutlook ? `Semana del ${formatFecha(weeklyOutlook.fecha)}` : null}
          markdown={seccion(weeklyOutlook, "calendario economico")}
          vacio="Todavía no hay un Weekly Outlook publicado con el calendario de la semana."
        />
        <HorizonteBloque
          titulo="Calendario de earnings de la semana"
          fuente={weeklyOutlook ? `Semana del ${formatFecha(weeklyOutlook.fecha)}` : null}
          markdown={seccion(weeklyOutlook, "calendario de earnings")}
          vacio="Todavía no hay un Weekly Outlook publicado con earnings de la semana."
        />
        <HorizonteBloque
          titulo="Earnings y calendario de hoy"
          fuente={daily ? formatFecha(daily.fecha) : null}
          markdown={seccion(daily, "earnings y calendario")}
          vacio="Todavía no hay un Daily publicado con el calendario de hoy."
        />
        <HorizonteBloque
          titulo="Qué vigilar mañana"
          fuente={daily ? formatFecha(daily.fecha) : null}
          markdown={seccion(daily, "que vigilar mañana")}
          vacio="Todavía no hay un Daily publicado."
        />
      </div>
    </section>
  );
}
