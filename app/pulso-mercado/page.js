import { Children, cloneElement, isValidElement } from "react";
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
import TickerTape from "@/components/TickerTape";
import MercadosScreener from "@/components/MercadosScreener";
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

// Explicación de cada dimensión del "scorecard" de Market Regime/Market
// Pulse (Trend/Breadth/Momentum/Volatility/Rates/USD): qué significa cada
// una y cómo se mide, para el tooltip de cada chip.
const CONCEPTOS_PULSO = {
  trend: {
    etiqueta: "Trend",
    explicacion:
      "La dirección predominante de los precios en el marco de tiempo vigente. Se mide comparando el precio contra sus medias móviles (ej. de 50 y 200 días) y la pendiente de esas medias: si el precio está por encima y las medias suben, la tendencia es alcista; si está por debajo y bajan, es bajista.",
  },
  breadth: {
    etiqueta: "Breadth",
    explicacion:
      "Qué tan generalizado está un movimiento del mercado, no solo qué tan grande. Se mide con la proporción de acciones que suben contra las que bajan (línea avance-declive) o cuántas están por encima de su media móvil — un rally con \"breadth\" débil depende de pocas acciones y es más frágil.",
  },
  momentum: {
    etiqueta: "Momentum",
    explicacion:
      "La velocidad y aceleración del movimiento reciente de precios, no solo su dirección. Se mide con osciladores técnicos como el RSI o el MACD, que comparan las ganancias y pérdidas recientes para detectar si un movimiento se está acelerando, desacelerando o revirtiendo.",
  },
  volatility: {
    etiqueta: "Volatility",
    explicacion:
      "Qué tan grandes son las oscilaciones de precio, esperadas o recientes. Se mide típicamente con el VIX (la volatilidad implícita que el mercado de opciones del S&P 500 está pagando) o con la volatilidad histórica realizada de los propios precios.",
  },
  rates: {
    etiqueta: "Rates",
    explicacion:
      "La dirección de las tasas de interés de referencia. Se mide con el nivel y la pendiente de los rendimientos de bonos del Tesoro de EU (ej. a 2, 10 y 30 años) — rendimientos al alza generalmente reflejan expectativas de tasas más altas o más inflación.",
  },
  usd: {
    etiqueta: "USD",
    explicacion:
      "La fortaleza del dólar estadounidense frente a otras divisas principales. Se mide con el índice DXY, una canasta ponderada del dólar contra el euro, el yen, la libra y otras monedas — un DXY al alza significa un dólar más fuerte en términos relativos.",
  },
};

// Busca en el markdown de una sección la línea tipo "scorecard"
// (Trend ↑ · Breadth ↓ · Momentum → · ...) que generan las rutinas de
// Market Regime / Market Pulse, la separa del resto del texto y la
// convierte en {clave, simbolo, nota} por dimensión — para renderizarla
// como chips interactivos en vez de texto plano.
function extraerScorecardPulso(markdown) {
  if (!markdown) return { texto: markdown, items: null };
  const lineas = markdown.split("\n");
  const idx = lineas.findIndex(
    (l) => /\bTrend\b/i.test(l) && /\bBreadth\b/i.test(l) && /\bMomentum\b/i.test(l)
  );
  if (idx === -1) return { texto: markdown, items: null };

  const partes = lineas[idx]
    .split("·")
    .map((p) => p.trim())
    .filter(Boolean);
  const items = [];
  for (const parte of partes) {
    const m = parte.match(/^(Trend|Breadth|Momentum|Volatility|Rates|USD)\s*([↑↓→])\s*(.*)$/i);
    if (m && CONCEPTOS_PULSO[m[1].toLowerCase()]) {
      items.push({
        clave: m[1].toLowerCase(),
        simbolo: m[2],
        nota: m[3].replace(/\.\s*$/, "").trim(),
      });
    }
  }
  if (items.length < 4) return { texto: markdown, items: null };

  lineas.splice(idx, 1);
  return { texto: lineas.join("\n").trim(), items };
}

const COLOR_SIMBOLO = { "↑": "#3b82f6", "↓": "#e2725b", "→": "#8a93a6" };

function ScorecardPulso({ items }) {
  return (
    <div className="pulso-scorecard">
      {items.map((it) => {
        const c = CONCEPTOS_PULSO[it.clave];
        return (
          <details key={it.clave} className="pulso-chip">
            <summary>
              <span className="pulso-chip-etiqueta">{c.etiqueta}</span>
              <span className="pulso-chip-simbolo" style={{ color: COLOR_SIMBOLO[it.simbolo] }}>
                {it.simbolo}
              </span>
            </summary>
            <div className="pulso-chip-tooltip">
              <p className="pulso-chip-explicacion">{c.explicacion}</p>
              {it.nota && <p className="pulso-chip-nota">Hoy: {it.nota}</p>}
            </div>
          </details>
        );
      })}
    </div>
  );
}

// Convierte los children de un <th> (texto, o texto con markdown anidado)
// en una cadena plana, para usarla como etiqueta en las celdas de la fila
// (móvil: la tabla se convierte en tarjetas, cada celda necesita saber a
// qué columna pertenece).
function textoPlano(children) {
  return Children.toArray(children)
    .map((c) => (typeof c === "string" ? c : isValidElement(c) ? textoPlano(c.props.children) : ""))
    .join("");
}

// Componentes de tabla para ReactMarkdown que capturan el texto de cada
// <th> y lo inyectan como data-label en el <td> correspondiente de cada
// fila — así el CSS responsive (.pulsodash-calendario en móvil) puede
// mostrar "Fecha: ...", "Evento: ..." como tarjeta en vez de columnas
// angostas. Cierra sobre `encabezados` porque los <th> siempre se
// renderizan antes que las filas del <tbody> en el mismo table.
function componentesTablaConEtiquetas() {
  let encabezados = [];
  return {
    table: (props) => {
      encabezados = [];
      return <table {...props} />;
    },
    th: ({ children, ...props }) => {
      encabezados.push(textoPlano(children));
      return <th {...props}>{children}</th>;
    },
    tr: ({ children, ...props }) => {
      let i = -1;
      const hijos = Children.map(children, (hijo) => {
        if (isValidElement(hijo) && hijo.type === "td") {
          i += 1;
          return cloneElement(hijo, { "data-label": encabezados[i] || "" });
        }
        return hijo;
      });
      return <tr {...props}>{hijos}</tr>;
    },
  };
}

function Seccion({ titulo, subtitulo, markdown, vacio, claseExtra, conScorecard }) {
  const { texto, items } = conScorecard
    ? extraerScorecardPulso(markdown)
    : { texto: markdown, items: null };
  return (
    <div className="pulsodash-panel">
      <div className="pulsodash-panel-head">
        <span className="pulsodash-panel-title">{titulo}</span>
        {subtitulo && <span className="pulsodash-panel-sub">{subtitulo}</span>}
      </div>
      {markdown ? (
        <div className={`pulsodash-panel-body prose${claseExtra ? ` ${claseExtra}` : ""}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={componentesTablaConEtiquetas()}>
            {texto}
          </ReactMarkdown>
          {items && <ScorecardPulso items={items} />}
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
    <>
      <TickerTape />
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
            <Link href="/pulso-mercado/screener">Screener →</Link>
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
            conScorecard
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
              claseExtra="pulsodash-calendario"
            />
          </>
        )}

        <div className="pulsodash-horizons-head">
          <span className="pulsodash-eyebrow">Screener</span>
          <h2>Magníficas 7 y BMV, con datos reales</h2>
        </div>
        <MercadosScreener />
      </div>
      </section>
    </>
  );
}
