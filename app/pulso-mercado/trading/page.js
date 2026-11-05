import Link from "next/link";
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

function BloqueExplicativo({ resumen }) {
  const capitalTexto = resumen.monedaUSD
    ? "USD 1,000"
    : `$${resumen.capitalInicialTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN (equivalente a USD 1,000 al tipo de cambio del ${resumen.usdMxnRateFecha})`;
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
          <h2>Seis rondas de pruebas antes de llegar a este diseño</h2>
          <p>
            El diseño actual no salió completo desde el día uno — cada cambio se probó contra el
            motor completo antes de adoptarse, y se documenta aquí incluyendo lo que se descartó:
          </p>
          <ul className="trading-timeline">
            <li className="trading-timeline-item">
              <span className="trading-timeline-tag">v1</span>
              <strong>Versión original</strong> — el stop se fijaba en el precio de entrada y
              nunca se movía; el efectivo sin posición se quedaba parado, sin invertirse. En 6
              meses de datos reales (may–oct 2026) esto dio <strong>-0.08%</strong> mientras el
              índice S&amp;P 500 (comprar y mantener) dio <strong>+6.76%</strong> en el mismo
              período.
            </li>
            <li className="trading-timeline-item">
              <span className="trading-timeline-tag">v2</span>
              <strong>Trailing stop + cash invertido en SPY</strong> — el stop ahora sube cada día
              con el precio (nunca baja) y el efectivo ocioso se invierte en el índice en vez de
              quedarse parado. Fue el cambio de mayor impacto medido: en una ventana de 22 meses,
              el retorno pasó de <strong>+0.23% a +17.75%</strong>.
            </li>
            <li className="trading-timeline-item">
              <span className="trading-timeline-tag">v3</span>
              <strong>Circuit breakers reales</strong> — se agregó el límite de pérdida diaria y
              el umbral de drawdown que hoy bloquean o suspenden cada bucket (ver tabla de abajo).
            </li>
            <li className="trading-timeline-item">
              <span className="trading-timeline-tag">v4</span>
              <strong>Universo ampliado + fricción real</strong> — de 32 a 159 símbolos en varias
              rondas, y comisión + slippage reales incluidas en el motor (antes solo las tenía el
              backtest formal, no el paper trading). Un trailing stop más ancho y un filtro de
              régimen de mercado se probaron y se <strong>descartaron</strong> — ambos empeoraron
              el resultado, y se reportan aquí igual que los cambios que sí funcionaron.
            </li>
            <li className="trading-timeline-item">
              <span className="trading-timeline-tag">v5</span>
              <strong>Mean Reversion RSI(2), un 4to portafolio</strong> — todas las estrategias
              anteriores comparten la misma lógica (comprar fortaleza, seguir la tendencia). Se
              probaron también Donchian Breakout y una re-ponderación por volatilidad inversa
              (Risk Parity): ambos empeoraron el resultado y se descartaron. Mean Reversion RSI(2)
              (comprar debilidad temporal dentro de una tendencia alcista confirmada) sí mostró una
              correlación baja (0.14) con el resto del sistema en su backtest original — se
              agregó como un 4to portafolio independiente, con 35% del capital.
            </li>
            <li className="trading-timeline-item">
              <span className="trading-timeline-tag">v6</span>
              <strong>Se revierte Mean Reversion — no sostuvo una auditoría más rigurosa</strong> —
              una validación walk-forward (la misma que ya había descartado otro candidato,
              Bollinger %B) encontró un Sharpe fuera de muestra promedio de -0.032 para Mean
              Reversion, con 2 de 5 ventanas en pérdida. Una investigación de seguimiento encontró
              además que el +47.90% del backtest original no era reproducible: con el mismo
              código y universo, un backtest corrido después dio +19.09% — consistente con el
              mismo problema de revisión retroactiva de datos ya documentado en v4. Se eliminó el
              bucket y se restauró el split original de 3 portafolios (43.33/33.33/23.33), sin
              borrar el código de la estrategia por si aparece evidencia mejor en el futuro.
            </li>
          </ul>
        </div>

        <div className="trading-intro-card">
          <span className="trading-intro-kicker">Cómo está construido hoy</span>
          <h2>Tres portafolios, cada uno con sus propias reglas</h2>
          <p>
            El capital de referencia ({capitalTexto}) se divide en tres "buckets" independientes, cada
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
                  <td>26 ETFs</td>
                  <td>Time-Series Momentum</td>
                  <td>2%</td>
                  <td>1%</td>
                  <td>6%</td>
                </tr>
                <tr>
                  <td>Mediano Plazo</td>
                  <td>33.33%</td>
                  <td>74 símbolos</td>
                  <td>Trend Following + Momentum/Breakout</td>
                  <td>2%</td>
                  <td>1.5%</td>
                  <td>10%</td>
                </tr>
                <tr>
                  <td>Riesgo Alto</td>
                  <td>23.33%</td>
                  <td>45 símbolos</td>
                  <td>Trend Following + Momentum/Breakout</td>
                  <td>3%</td>
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
            Último backtest completo con los 3 buckets actuales (tras revertir Mean Reversion),
            sobre 36 meses de datos reales congelados, con 0.05% de comisión + 0.05% de slippage
            por lado (costos reales de operar, no un escenario optimista) y el split de
            producción 43.33/33.33/23.33:
          </p>
          <ul>
            <li><strong>+34.00%</strong> de retorno neto acumulado en el período.</li>
            <li><strong>12.91%</strong> de drawdown máximo.</li>
            <li>
              Mean Reversion RSI(2) llegó a probarse con los 4 buckets reales (+43.61% retorno,
              11.75% drawdown) pero esa cifra no sobrevivió una validación walk-forward más
              estricta ni resultó reproducible en una corrida posterior — se descartó y el
              sistema volvió a esta configuración de 3 buckets (ver timeline arriba y
              Bitácora de decisiones para el detalle completo).
            </li>
          </ul>
          <p style={{ marginTop: 10 }}>
            Esto es backtesting — una simulación sobre precios ya conocidos, no el resultado del
            paper trading diario de abajo. Las dos mediciones nunca se combinan en un mismo
            gráfico en esta página. Los 3 buckets actuales se restauraron el 5-nov-2026 tras
            revertir Mean Reversion — el paper trading diario con esta configuración todavía
            tiene muy poco historial propio.
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

        <BloqueExplicativo resumen={data.resumen} />

        <div className="trading-disclaimer">{TRADING_DISCLAIMER}</div>

        <nav className="trading-subnav">
          <Link href="/pulso-mercado/trading/investigacion">Investigación →</Link>
          <Link href="/pulso-mercado/trading/bitacora">Bitácora de decisiones →</Link>
        </nav>

        <TradingPublicoExplorer data={data} />
      </div>
    </section>
  );
}
