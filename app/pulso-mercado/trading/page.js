import { getTradingPublicSnapshot, TRADING_DISCLAIMER } from "@/lib/trading/public-snapshot";
import TradingPublicoExplorer from "@/components/TradingPublicoExplorer";
import { absUrl } from "@/lib/site";

export const metadata = {
  title: "Trading Algorítmico — Pulso de Mercado",
  description:
    "Laboratorio público de investigación cuantitativa: backtesting, paper trading diario y gestión de riesgo de un sistema de inversión algorítmica, con resultados auditables y sin dinero real.",
  alternates: { canonical: "/pulso-mercado/trading" },
  openGraph: {
    type: "website",
    url: absUrl("/pulso-mercado/trading"),
    title: "Trading Algorítmico — Pulso de Mercado",
    description: TRADING_DISCLAIMER,
  },
};

function BloqueExplicativo() {
  return (
    <div className="trading-intro">
      <div className="trading-intro-grid">
        <div className="trading-intro-card">
          <span className="trading-intro-kicker">Qué es esto</span>
          <h2>Un experimento de inversión cuantitativa, en público</h2>
          <p>
            Este es un proyecto personal: un sistema de trading sistemático que decide cuándo
            comprar y vender sin intervención manual diaria, siguiendo reglas fijas en vez de
            intuición. Aquí documento cómo se construyó, cómo se prueba y qué resultados reales
            va dando — con las ganancias y las pérdidas por igual. No es un servicio de señales
            ni una recomendación de inversión: es la bitácora pública de cómo investigo si un
            sistema así funciona antes de considerar arriesgar dinero real en él.
          </p>
        </div>

        <div className="trading-intro-card">
          <span className="trading-intro-kicker">Cómo está construido</span>
          <h2>Tres portafolios, cada uno con su propio nivel de riesgo</h2>
          <p>
            El capital de referencia (USD 1,000) se divide en tres "buckets" independientes, cada
            uno con su propia estrategia, su propio universo de símbolos y su propio límite de
            pérdida diaria y de drawdown antes de suspenderse automáticamente:
          </p>
          <ul>
            <li>
              <strong>Largo Plazo (43.3%)</strong> — Time-Series Momentum sobre 13 ETFs, el
              bucket más conservador, con el límite de pérdida diaria más bajo (1%).
            </li>
            <li>
              <strong>Mediano Plazo (33.3%)</strong> — Trend Following + Momentum/Breakout sobre
              74 símbolos, riesgo intermedio.
            </li>
            <li>
              <strong>Riesgo Alto (23.3%)</strong> — la misma familia de estrategias sobre 45
              símbolos más volátiles, con el límite de pérdida diaria más amplio (2%).
            </li>
          </ul>
        </div>

        <div className="trading-intro-card">
          <span className="trading-intro-kicker">Dos mediciones que nunca se mezclan</span>
          <h2>Backtesting no es lo mismo que paper trading</h2>
          <p>
            <strong>Backtesting:</strong> cómo se hubiera comportado la estrategia aplicada a
            precios históricos — útil para investigar una idea, pero conocido de antemano (el
            modelo "ya sabe" qué pasó). <strong>Paper trading:</strong> el motor corre todos los
            días de mercado, en tiempo real, con las mismas reglas que usaría con dinero real,
            pero sin ejecutar ninguna orden de verdad. El paper trading es la prueba honesta —
            por eso esta página nunca combina ambas curvas en un mismo gráfico.
          </p>
        </div>

        <div className="trading-intro-card">
          <span className="trading-intro-kicker">Qué controla el riesgo</span>
          <h2>El sistema se detiene solo cuando algo sale mal</h2>
          <p>
            Cada bucket tiene un riesgo máximo por operación (1-2% del capital del bucket), un
            límite de pérdida diaria que bloquea nuevas compras el resto del día si se alcanza, y
            un umbral de drawdown que suspende por completo el bucket (sin liquidar lo que ya
            tiene abierto) hasta que se reautorice manualmente. Nada de esto se desactiva para
            "dejar correr" una buena racha.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TradingPublicoPage() {
  const data = getTradingPublicSnapshot();

  return (
    <section className="section">
      <div className="container pulsodash">
        <header className="pulsodash-hero">
          <span className="pulsodash-eyebrow">Pulso de Mercado · The Quantitative Experiment</span>
          <h1>Trading Algorítmico</h1>
          <p className="pulsodash-tagline">
            Un experimento público de inversión cuantitativa: estrategias sistemáticas,
            gestión de riesgo, resultados de backtesting y paper trading diario,
            documentados con la misma transparencia que el resto de Pulso de Mercado.
          </p>
        </header>

        <BloqueExplicativo />

        <div className="trading-disclaimer">{TRADING_DISCLAIMER}</div>

        <TradingPublicoExplorer data={data} />
      </div>
    </section>
  );
}
