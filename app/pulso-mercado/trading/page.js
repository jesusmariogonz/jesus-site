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
          <span className="trading-intro-kicker">Cómo se construyó</span>
          <h2>Cuatro rondas de pruebas antes de llegar a este diseño</h2>
          <p>
            El diseño actual no salió completo desde el día uno — cada cambio se probó contra el
            motor completo antes de adoptarse, y se documenta aquí incluyendo lo que se descartó:
          </p>
          <ul>
            <li>
              <strong>Versión original</strong> — el stop se fijaba en el precio de entrada y
              nunca se movía; el efectivo sin posición se quedaba parado, sin invertirse. En 6
              meses de datos reales (may–oct 2026) esto dio <strong>-0.08%</strong> mientras el
              índice S&amp;P 500 (comprar y mantener) dio <strong>+6.76%</strong> en el mismo
              período.
            </li>
            <li>
              <strong>Trailing stop + cash invertido en SPY</strong> — el stop ahora sube cada día
              con el precio (nunca baja) y el efectivo ocioso se invierte en el índice en vez de
              quedarse parado. Fue el cambio de mayor impacto medido: en una ventana de 22 meses,
              el retorno pasó de <strong>+0.23% a +17.75%</strong>.
            </li>
            <li>
              <strong>Circuit breakers reales</strong> — se agregó el límite de pérdida diaria y
              el umbral de drawdown que hoy bloquean o suspenden cada bucket (ver tabla de abajo).
            </li>
            <li>
              <strong>Universo ampliado + fricción real</strong> — de 32 a 146 símbolos en dos
              rondas, y comisión + slippage reales incluidas en el motor (antes solo las tenía el
              backtest formal, no el paper trading). Un trailing stop más ancho y un filtro de
              régimen de mercado se probaron y se <strong>descartaron</strong> — ambos empeoraron
              el resultado, y se reportan aquí igual que los cambios que sí funcionaron.
            </li>
          </ul>
        </div>

        <div className="trading-intro-card">
          <span className="trading-intro-kicker">Cómo está construido hoy</span>
          <h2>Tres portafolios, cada uno con sus propias reglas</h2>
          <p>
            El capital de referencia (USD 1,000) se divide en tres "buckets" independientes, cada
            uno con su propia estrategia, universo y límites de riesgo:
          </p>
          <div className="prose" style={{ overflowX: "auto", marginTop: 12 }}>
            <table>
              <thead>
                <tr>
                  <th>Bucket</th>
                  <th>Asignación</th>
                  <th>Universo</th>
                  <th>Estrategia</th>
                  <th>Riesgo/op.</th>
                  <th>Límite diario</th>
                  <th>Drawdown revisión</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Largo Plazo</td>
                  <td>43.33%</td>
                  <td>13 ETFs</td>
                  <td>Time-Series Momentum</td>
                  <td>1%</td>
                  <td>1%</td>
                  <td>6%</td>
                </tr>
                <tr>
                  <td>Mediano Plazo</td>
                  <td>33.33%</td>
                  <td>74 símbolos</td>
                  <td>Trend Following + Momentum/Breakout</td>
                  <td>1%</td>
                  <td>1.5%</td>
                  <td>10%</td>
                </tr>
                <tr>
                  <td>Riesgo Alto</td>
                  <td>23.33%</td>
                  <td>45 símbolos</td>
                  <td>Trend Following + Momentum/Breakout</td>
                  <td>2%</td>
                  <td>2%</td>
                  <td>15%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="trading-intro-card">
          <span className="trading-intro-kicker">Resultado de las pruebas</span>
          <h2>Lo último que se midió, con fricción real incluida</h2>
          <p>
            Último backtest completo sobre los 146 símbolos actuales, enero 2024 – octubre 2026,
            con 0.05% de comisión + 0.05% de slippage por lado (costos reales de operar, no un
            escenario optimista) y el split de producción 43.33/33.33/23.33:
          </p>
          <ul>
            <li><strong>+32.76%</strong> de retorno neto acumulado en el período.</li>
            <li><strong>336</strong> operaciones cerradas en total.</li>
            <li>
              Riesgo Alto fue el bucket con más margen relativo: <strong>+47.59%</strong> en ese
              mismo período, tras ampliar su universo de 30 a 45 símbolos.
            </li>
          </ul>
          <p style={{ marginTop: 10 }}>
            Esto es backtesting — una simulación sobre precios ya conocidos, no el resultado del
            paper trading diario de abajo. Las dos mediciones nunca se combinan en un mismo
            gráfico en esta página.
          </p>
        </div>

        <div className="trading-intro-card">
          <span className="trading-intro-kicker">Qué controla el riesgo</span>
          <h2>El sistema se detiene solo cuando algo sale mal</h2>
          <p>
            Si la pérdida del día supera el límite diario de su bucket, se bloquean nuevas
            compras el resto de la sesión — pero nunca se bloquea cerrar una posición ya abierta.
            Si el drawdown desde el máximo histórico supera el umbral de revisión, el bucket
            completo queda suspendido (sin liquidar nada) hasta reautorización manual. Nada de
            esto se desactiva para "dejar correr" una buena racha.
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
