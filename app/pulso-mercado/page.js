import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getPulsoDashboard,
  getPulsoMercado,
  seccion,
  formatFecha,
  enlazarActivosEnTabla,
} from "@/lib/posts";
import PulsoMercado from "@/components/PulsoMercado";
import { absUrl } from "@/lib/site";

// Dinámico (no estático) para que "Próxima corrida" en cada tarjeta
// siempre refleje la hora actual, no la del último build.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pulso de Mercado",
  description:
    "Qué pasó. Qué cambió. Qué importa. El sistema de inteligencia de mercados de Jesús González: Daily, Weekly Review, Weekly Outlook y Monthly Review, sin predicciones ni recomendaciones.",
  alternates: { canonical: "/pulso-mercado" },
  openGraph: {
    type: "website",
    url: absUrl("/pulso-mercado"),
    title: "Pulso de Mercado",
    description: "Qué pasó. Qué cambió. Qué importa.",
  },
};

function Seccion({ titulo, subtitulo, markdown, vacio }) {
  return (
    <div className="pulsodash-panel">
      <div className="pulsodash-panel-head">
        <span className="pulsodash-panel-title">{titulo}</span>
        {subtitulo && <span className="pulsodash-panel-sub">{subtitulo}</span>}
      </div>
      {markdown ? (
        <div className="pulsodash-panel-body prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      ) : (
        <p className="pulsodash-vacio">{vacio}</p>
      )}
    </div>
  );
}

export default function PulsoMercadoDashboard() {
  const { pulso, snapshot, regimen, importoHoy, swing, position, longTerm } =
    getPulsoDashboard();
  const { daily, weeklyOutlook } = pulso;

  const calendarioSemana = seccion(weeklyOutlook, "macro calendar");

  return (
    <section className="section">
      <div className="container pulsodash">
        <header className="pulsodash-hero">
          <span className="pulsodash-eyebrow">
            Market Pulse{daily ? ` · ${formatFecha(daily.fecha)}` : ""}
          </span>
          <h1>Qué pasó. Qué cambió. Qué importa.</h1>
          <p className="pulsodash-tagline">
            El sistema de inteligencia de mercados de Jesús González — sin
            predicciones ni recomendaciones de compra/venta. Solo lo que
            necesitas para construir tu propio criterio, en tres horizontes:
            Swing, Position y Long Term.
          </p>
          <nav className="horizonte-subnav">
            <Link href="/swing">Swing</Link>
            <Link href="/position">Position</Link>
            <Link href="/long-term">Long Term</Link>
          </nav>
        </header>

        {snapshot && (
          <div className="pulsodash-panel pulsodash-snapshot prose">
            <span className="pulsodash-panel-title">Market Snapshot</span>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {enlazarActivosEnTabla(snapshot)}
            </ReactMarkdown>
          </div>
        )}

        <div className="pulsodash-grid-2">
          <Seccion
            titulo="Qué importó hoy"
            markdown={importoHoy}
            vacio="Todavía no se ha publicado el Daily de hoy. Vuelve más tarde."
          />
          <Seccion
            titulo="Market Regime"
            markdown={regimen}
            vacio="Sin datos de régimen de mercado por ahora."
          />
        </div>

        <div className="pulsodash-horizons-head">
          <span className="pulsodash-eyebrow">The Three Horizons</span>
          <h2>Swing · Position · Long Term</h2>
        </div>
        <div className="pulsodash-horizons">
          <article className="pulsodash-horizon swing">
            <div className="pulsodash-horizon-name">Swing</div>
            <div className="pulsodash-horizon-span">Días → Semanas</div>
            {swing ? (
              <div className="prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {swing.cuerpo}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="pulsodash-vacio">Próximamente.</p>
            )}
            <Link href="/swing" className="pulsodash-horizon-more">
              Ver Swing completo →
            </Link>
          </article>
          <article className="pulsodash-horizon position">
            <div className="pulsodash-horizon-name">Position</div>
            <div className="pulsodash-horizon-span">Semanas → Meses</div>
            {position ? (
              <div className="prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {position.cuerpo}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="pulsodash-vacio">Próximamente.</p>
            )}
            <Link href="/position" className="pulsodash-horizon-more">
              Ver Position completo →
            </Link>
          </article>
          <article className="pulsodash-horizon longterm">
            <div className="pulsodash-horizon-name">Long Term</div>
            <div className="pulsodash-horizon-span">Meses → Años</div>
            {longTerm ? (
              <div className="prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {longTerm.cuerpo}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="pulsodash-vacio">Próximamente.</p>
            )}
            <Link href="/long-term" className="pulsodash-horizon-more">
              Ver Long Term completo →
            </Link>
          </article>
        </div>

        <PulsoMercado pulso={pulso} />

        {calendarioSemana && (
          <>
            <div className="pulsodash-horizons-head">
              <span className="pulsodash-eyebrow">Calendario</span>
              <h2>Fed · Banxico · Datos económicos</h2>
            </div>
            <Seccion
              titulo="Calendario económico de la semana"
              subtitulo={weeklyOutlook ? `Semana del ${formatFecha(weeklyOutlook.fecha)}` : null}
              markdown={calendarioSemana}
              vacio="Todavía no hay un Weekly Outlook publicado con el calendario de la semana."
            />
          </>
        )}
      </div>
    </section>
  );
}
