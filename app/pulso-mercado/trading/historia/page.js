import Link from "next/link";
import { absUrl } from "@/lib/site";

export const metadata = {
  title: "Historia completa — Trading Algorítmico",
  description:
    "Las 37 decisiones de diseño del sistema de trading algorítmico, en orden cronológico, incluyendo el motor simulado que alimenta este dashboard y el motor en vivo (IBKR) que opera en paralelo.",
  alternates: { canonical: "/pulso-mercado/trading/historia" },
  openGraph: {
    type: "website",
    url: absUrl("/pulso-mercado/trading/historia"),
    title: "Historia completa — Trading Algorítmico",
  },
};

// Cada hito resume uno o más ADRs reales del repo algo_trading_platform
// (docs/adr/0001-0037). `motor` indica a cuál de los dos motores afecta:
// "simulado" (el que alimenta este dashboard), "vivo" (IBKR, paralelo,
// no se refleja en las cifras de esta página — ver ADR 0023) o "ambos".
const HITOS = [
  {
    v: "v1",
    motor: "simulado",
    titulo: "Versión original",
    texto:
      "El stop se fijaba en el precio de entrada y nunca se movía; el efectivo sin posición se quedaba parado, sin invertirse. En 6 meses de datos reales (may–oct 2026) esto dio -0.08% mientras el índice S&P 500 (comprar y mantener) dio +6.76% en el mismo período.",
  },
  {
    v: "v2",
    motor: "simulado",
    titulo: "Trailing stop + cash invertido en SPY",
    texto:
      "El stop ahora sube cada día con el precio (nunca baja) y el efectivo ocioso se invierte en el índice en vez de quedarse parado. Fue el cambio de mayor impacto medido en todo el proyecto: en una ventana de 22 meses, el retorno pasó de +0.23% a +17.75%.",
  },
  {
    v: "v3",
    motor: "simulado",
    titulo: "Circuit breakers reales",
    texto:
      "Se agregó el límite de pérdida diaria y el umbral de drawdown que hoy bloquean o suspenden cada bucket.",
  },
  {
    v: "v4",
    motor: "simulado",
    titulo: "Universo ampliado + fricción real",
    texto:
      "De 32 a 159 símbolos en varias rondas, y comisión + slippage reales incluidas en el motor (antes solo las tenía el backtest formal). Un trailing stop más ancho y un filtro de régimen de mercado se probaron y se descartaron — ambos empeoraron el resultado.",
  },
  {
    v: "v5",
    motor: "simulado",
    titulo: "Mean Reversion RSI(2), un 4to portafolio",
    texto:
      "Se probaron también Donchian Breakout y Risk Parity (re-ponderación por volatilidad inversa): ambos empeoraron el resultado y se descartaron. Mean Reversion RSI(2) sí mostró una correlación baja (0.14) con el resto del sistema en su backtest original — se agregó como un 4to portafolio independiente, con 35% del capital.",
  },
  {
    v: "v6",
    motor: "simulado",
    titulo: "Se revierte Mean Reversion — no sostuvo una auditoría más rigurosa",
    texto:
      "Una validación walk-forward rolling (la misma que ya había descartado a Bollinger %B) encontró un Sharpe fuera de muestra promedio de -0.032 para Mean Reversion, con 2 de 5 ventanas en pérdida. Una investigación de seguimiento encontró además que el +47.90% del backtest original no era reproducible: una corrida posterior con el mismo código dio +19.09%. Se eliminó el bucket (código conservado, no borrado) y se restauró el split original de 3 portafolios (43.33/33.33/23.33).",
  },
  {
    v: "v7",
    motor: "ambos",
    titulo: "Ledger de transacciones del blend + el motor en vivo empieza a invertir el cash ocioso",
    texto:
      "Antes solo se veía el saldo final del blend SPY/GLD, no cómo se llegó ahí — se agregó un registro append-only de cada entrada/salida, en los dos motores. Además, el motor en vivo (que desde su creación dejaba el cash ocioso como efectivo puro, para minimizar órdenes reales durante la validación inicial) pasó a invertirlo con órdenes reales, igual que el motor simulado. Advertencia real documentada en el ADR: con el capital pequeño del momento, SPY (~$766/acción) casi nunca alcanzaba para una sola acción — la inversión se reducía casi por completo a GLD.",
  },
  {
    v: "v8",
    motor: "vivo",
    titulo: "Límite explícito de $2,000 USD en el motor en vivo",
    texto:
      "Un reset de la cuenta paper de IBKR dejó ~$5,400 USD de equity disponible, pero el usuario decidió operar deliberadamente con solo $2,000 USD del total — no el equity completo — mientras se sigue validando el motor en vivo. Decisión de preferencia, no limitación técnica.",
  },
  {
    v: "v9",
    motor: "vivo",
    titulo: "Corrección de un ledger contaminado con datos de prueba",
    texto:
      "El ledger del blend del motor en vivo apareció con ~36 renglones duplicados a un precio que SPY y GLD nunca tuvieron ($101.00) — contaminación de pruebas manuales anteriores que escribieron sobre el archivo real en vez de un mock. Se vació el ledger (sin reconstruir el historial perdido, no había forma confiable de hacerlo) y se corrigió a mano el estado de los buckets contra la posición real verificada en IBKR.",
  },
  {
    v: "v10",
    motor: "vivo",
    titulo: "Fix del Error 10349: TIF explícito en las órdenes",
    texto:
      "Todas las órdenes de mercado del motor en vivo se cancelaban instantáneamente tras un reset de cuenta. La causa real: un bug conocido de la librería cliente ib_async que interpreta un aviso informativo de IBKR (TIF no especificado) como cancelación real de la orden. Se fijó el campo TIF explícitamente a \"DAY\" en vez de dejarlo vacío.",
  },
  {
    v: "v11",
    motor: "vivo",
    titulo: "No confiar ciegamente en el estado reportado de una orden",
    texto:
      "Se encontró que 11 órdenes reportadas como \"fallidas\" por el motor en realidad sí se habían ejecutado en IBKR, confirmado comparando contra las posiciones reales de la cuenta. Desde este cambio, el motor verifica las ejecuciones reales y compara posiciones antes/después de una orden, en vez de confiar únicamente en el estado que reporta el bróker.",
  },
  {
    v: "v12",
    motor: "investigación",
    titulo: "10 hipótesis de sizing y forecasting probabilístico, probadas y mayormente descartadas",
    texto:
      "Investigación pura (nada implementado todavía en este paso): 10 hipótesis de literatura real (momentum crashes predecibles, volatility-managed portfolios, modelos no lineales cross-sectional) probadas con walk-forward rolling sobre las 3 estrategias activas. 7 de 10 se descartaron — incluyendo un meta-modelo de ML con overfitting numérico claro (AUC in-sample 0.93 vs. OOS 0.25, peor que azar) y un forecasting probabilístico que no calibró (el intervalo \"80%\" solo cubrió 70-73% real). Solo 2 candidatos sobrevivieron para el bucket Largo Plazo.",
  },
  {
    v: "v13",
    motor: "ambos",
    titulo: "Cross-sectional momentum en producción para Largo Plazo",
    texto:
      "De los 2 candidatos que sobrevivieron la investigación anterior, se implementó el de mejor retorno/Sharpe: exigir que el símbolo esté en el percentil ≥70 de retorno relativo de su universo, además de la señal propia de la estrategia. En walk-forward: Sharpe 1.33→2.25, retorno 8.91%→19.14%, drawdown 8.76%→6.99%, 0 de 5 ventanas con pérdida (antes 1 de 5) — a cambio de operar ~3 veces menos seguido (descarta 67.5% de las señales candidatas). Se activa solo en Largo Plazo, no en los otros dos buckets. Es el cambio más reciente con impacto directo en lo que muestra este dashboard.",
  },
  {
    v: "v14",
    motor: "vivo",
    titulo: "Candado de horario regular + reconciliación automática",
    texto:
      "El motor en vivo quedó con 14 posiciones reales en IBKR que el estado local desconocía: pruebas manuales fuera de horario mandaron órdenes que IBKR no rechazó, sino que encoló para la siguiente apertura — mucho después de que el código dejara de esperarlas, registrándolas como fallidas aunque sí se ejecutaron. Se agregó un candado que evita abrir posiciones nuevas fuera de horario regular, y una reconciliación automática que absorbe en bloque cualquier posición real desconocida.",
  },
  {
    v: "v15",
    motor: "vivo",
    titulo: "Rebase de capital y recálculo de stops tras reconciliar",
    texto:
      "Tras reconciliar las posiciones reales, se re-basó el capital inicial de cada bucket a su equity actual (para que el retorno acumulado arrancara en 0% desde ese punto) y se recalculó el stop de cada posición con el dato más fresco, sin bajarlo nunca. De paso se corrigió un error 500 al vender un símbolo con una orden encolada por IBKR fuera de horario.",
  },
  {
    v: "v16",
    motor: "ambos",
    titulo: "Stop inicial y tipo de activo para el dashboard",
    texto:
      "Se agregó un campo que guarda el stop inicial de cada posición una sola vez (antes se perdía: el campo se sobreescribe cada vez que el trailing stop sube) y una clasificación de tipo de activo (Commodity / Bond ETF / Equity ETF / Stock). Pendiente real documentado en el ADR original: estos dos campos nuevos todavía no se consumen en este dashboard — falta integrarlos al frontend.",
  },
];

const ETIQUETA_MOTOR = {
  simulado: { texto: "Motor simulado", clase: "historia-motor-simulado" },
  vivo: { texto: "Motor en vivo (IBKR)", clase: "historia-motor-vivo" },
  ambos: { texto: "Ambos motores", clase: "historia-motor-ambos" },
  investigación: { texto: "Investigación — nada en producción", clase: "historia-motor-investigacion" },
};

export default function HistoriaPage() {
  return (
    <section className="section">
      <div className="container horizonte-page activo-page">
        <span className="pulsodash-eyebrow">
          <Link href="/pulso-mercado/trading">Trading Algorítmico</Link> · Historia completa
        </span>
        <h1>Historia completa del sistema</h1>
        <p className="activo-descripcion">
          Las 37 decisiones de diseño documentadas en la{" "}
          <Link href="/pulso-mercado/trading/bitacora">Bitácora de decisiones (ADR)</Link>, en
          orden cronológico y en lenguaje llano. Desde ADR 0023 el proyecto corre dos motores en
          paralelo: el <strong>motor simulado</strong> (el que alimenta las cifras de este
          dashboard) y un <strong>motor en vivo</strong> contra la cuenta paper de Interactive
          Brokers, que valida la ejecución real de órdenes pero no se refleja en los números de
          arriba. Cada hito indica a cuál de los dos afecta.
        </p>

        <ul className="trading-timeline trading-timeline-historia">
          {HITOS.map((h) => {
            const motor = ETIQUETA_MOTOR[h.motor];
            return (
              <li key={h.v} className="trading-timeline-item">
                <span className="trading-timeline-tag">{h.v}</span>
                <span className={`historia-motor-badge ${motor.clase}`}>{motor.texto}</span>
                <strong style={{ display: "block", marginTop: 4 }}>{h.titulo}</strong>
                <p style={{ margin: "4px 0 0" }}>{h.texto}</p>
              </li>
            );
          })}
        </ul>

        <p className="activo-descripcion" style={{ marginTop: 24 }}>
          El detalle técnico completo de cada una (incluyendo las que no llegaron a cambiar
          producción) está en la{" "}
          <Link href="/pulso-mercado/trading/bitacora">Bitácora de decisiones</Link>. La
          metodología de validación (walk-forward rolling, costos reales, qué se probó y se
          descartó) está en{" "}
          <Link href="/pulso-mercado/trading/investigacion">Investigación y metodología</Link>.
        </p>

        <p style={{ marginTop: 32 }}>
          <Link href="/pulso-mercado/trading">← Volver a Trading Algorítmico</Link>
        </p>
      </div>
    </section>
  );
}
