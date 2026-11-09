import Link from "next/link";
import { absUrl } from "@/lib/site";

export const metadata = {
  title: "Investigación — Trading Algorítmico",
  description:
    "Metodología, estrategias y experimentos descartados del sistema de trading algorítmico: qué se probó, qué funcionó y qué no, con la evidencia real detrás de cada decisión.",
  alternates: { canonical: "/pulso-mercado/trading/investigacion" },
  openGraph: {
    type: "website",
    url: absUrl("/pulso-mercado/trading/investigacion"),
    title: "Investigación — Trading Algorítmico",
  },
};

export default function InvestigacionPage() {
  return (
    <section className="section">
      <div className="container horizonte-page activo-page">
        <span className="pulsodash-eyebrow">
          <Link href="/pulso-mercado/trading">Trading Algorítmico</Link> · Investigación ·
          Strategy Research &amp; Validation
        </span>
        <h1>Investigación y metodología</h1>
        <p className="activo-descripcion">
          Esta página documenta cómo se prueba cada cambio antes de llegar a producción, las tres
          estrategias que componen el sistema hoy, y — con el mismo nivel de detalle — los
          experimentos que se probaron y no funcionaron, incluyendo uno que llegó a operar con
          capital real antes de revertirse. El historial completo, decisión por decisión, está en
          la <Link href="/pulso-mercado/trading/bitacora">Bitácora de decisiones</Link>.
        </p>

        <div className="activo-bloque">
          <h2>Metodología de backtesting</h2>
          <p>
            Cada estrategia se prueba sobre precios históricos reales (vía yfinance) con comisión
            y slippage incluidos (0.05% + 0.05% por lado) — los mismos costos que asumiría operar
            de verdad, no un escenario optimista sin fricción. Las comparaciones entre variantes
            (ej. "con este cambio" vs. "sin él") usan una descarga de datos única y congelada: se
            detectó y corrigió un problema real donde volver a pedir el mismo período de datos en
            momentos distintos podía cambiar barras puntuales lo suficiente para voltear señales
            de entrada/salida que estaban justo en el límite, inflando o desinflando resultados
            sobre 36 meses de simulación (ver ADR 0012 en la Bitácora).
          </p>
          <p>
            Desde ADR 0025, cualquier candidato nuevo también pasa por un <strong>walk-forward
            rolling</strong> de 5 ventanas (12 meses de entrenamiento / 6 meses de prueba fuera de
            muestra, paso de 4 meses) antes de considerarse para capital real — un backtest de
            muestra completa, por bueno que se vea, dejó de ser evidencia suficiente por sí solo
            después de que esa misma prueba expusiera que dos candidatos distintos (Bollinger %B y
            Mean Reversion RSI(2), ver abajo) perdían dinero en 2 de cada 5 ventanas reales,
            aunque sus números agregados de 36 meses se vieran bien.
          </p>
          <p>
            El número de referencia oficial del sistema —el que reemplaza a los reportados en
            ADRs anteriores, descartados por venir de corridas no comparables entre sí— es{" "}
            <strong>+34.00% de retorno neto</strong> y <strong>12.91% de drawdown máximo</strong>{" "}
            en 36 meses (noviembre 2023–octubre 2026), con la configuración de 3 buckets, universo
            y fricción que opera hoy en producción.
          </p>
        </div>

        <div className="activo-bloque">
          <h2>Las tres estrategias en producción</h2>
          <ul className="activo-lista">
            <li>
              <strong>Time-Series Momentum</strong> (bucket Largo Plazo, 26 ETFs) — compara el
              precio contra su propio historial de 12 y 6 meses; sigue tendencias de fondo, sin
              comparar contra otros activos. Desde el 6-nov-2026 (ADR 0034) se le exige además un
              filtro de <strong>cross-sectional momentum</strong>: el símbolo debe estar en el
              percentil ≥70 de retorno relativo dentro de su propio universo, el mismo día —
              descarta ~67.5% de las señales candidatas a cambio de un Sharpe fuera de muestra de
              2.25 frente a 1.33 sin el filtro (ver{" "}
              <Link href="/pulso-mercado/trading/historia">historia completa</Link>).
            </li>
            <li>
              <strong>Trend Following</strong> (buckets Mediano Plazo y Riesgo Alto) — alineación
              de medias móviles (SMA) con confirmación de volumen.
            </li>
            <li>
              <strong>Momentum/Breakout</strong> (buckets Mediano Plazo y Riesgo Alto) — ruptura de
              máximos recientes con fuerza relativa mínima y contracción previa de volatilidad.
            </li>
          </ul>
          <p>
            Todas comparten el mismo mecanismo de salida de fondo: un trailing stop basado en ATR
            que solo sube (nunca baja) a medida que el precio avanza, y el efectivo que no está en
            ninguna posición se invierte en un blend 50% SPY / 50% oro en vez de quedarse parado
            — el cambio individual de mayor impacto medido en todo el proyecto.
          </p>
        </div>

        <div className="activo-bloque">
          <h2>Un experimento que llegó a producción y se revirtió</h2>
          <p>
            <strong>Mean Reversion RSI(2)</strong> (comprar debilidad temporal, RSI(2) &lt; 10,
            dentro de una tendencia alcista confirmada) se aprobó como 4to bucket con 35% del
            capital real tras un backtest de muestra completa (+47.90% aislado, correlación 0.14
            con el resto del sistema). Cuando se le aplicó después la misma validación
            walk-forward rolling que acababa de descartar a otro candidato (Bollinger %B, ver
            abajo), el resultado fue peor: Sharpe fuera de muestra promedio de <strong>-0.032</strong>,
            2 de 5 ventanas con pérdida, y ningún peso de asignación mejoraba el portafolio de
            control — monotónicamente peor cuanto más peso se le daba. Una investigación de
            seguimiento encontró además que el +47.90% original no era reproducible: con el mismo
            código y universo, una corrida posterior dio +19.09%. Se eliminó el bucket y se
            restauró la configuración original de 3 portafolios — el código de la estrategia se
            conserva, sin borrar, por si aparece evidencia mejor en el futuro.
          </p>
        </div>

        <div className="activo-bloque">
          <h2>Qué se probó y se descartó</h2>
          <p>
            Publicar solo lo que funcionó daría una imagen falsa de cuánto se prueba antes de
            decidir algo. Esto es lo que se intentó y no pasó el control:
          </p>
          <ul className="activo-lista">
            <li>
              <strong>Bucket de criptomonedas</strong> — backtest negativo en la mayoría de los
              símbolos (BTC -46.9%, SOL -54%, XRP -59% según la estrategia) con las mismas reglas
              de acciones; confirmado en paper trading real durante varias semanas antes de
              eliminarse por completo.
            </li>
            <li>
              <strong>Quant Portfolios</strong> — un segundo modelo paralelo de 3 productos con
              identidad propia, construido para compararse contra el modelo de buckets. La
              comparación nunca llegó a completarse; se eliminó una vez que el modelo de buckets
              recibió las mismas mejoras de gestión de riesgo.
            </li>
            <li>
              <strong>Semiconductores y defensa como universo adicional</strong> — bajó el retorno
              (22.07%→16.05%) sin reducir el drawdown; el sistema ya tenía exposición razonable a
              esos sectores vía los símbolos existentes.
            </li>
            <li>
              <strong>Blend de bonos (AGG) o casi-cash (SGOV) como destino del cash ocioso</strong>{" "}
              — SGOV en particular volteó el sistema completo a resultado negativo (-8.37%),
              confirmando que gran parte del retorno viene de estar expuesto al mercado casi todo
              el tiempo, no solo de las señales de entrada/salida.
            </li>
            <li>
              <strong>Donchian Breakout como tercera estrategia</strong> — compitió por el mismo
              cupo de símbolos que Momentum/Breakout y le ganó la mayoría de las entradas,
              diluyendo la estrategia que ya funcionaba mejor en vez de sumar una fuente de
              retorno independiente.
            </li>
            <li>
              <strong>Risk Parity (ponderación por volatilidad inversa)</strong> — sobre-asignó
              capital a Largo Plazo, el bucket más débil del sistema, por confundir baja
              volatilidad con buena relación riesgo/retorno.
            </li>
            <li>
              <strong>Trailing stop más ancho en Riesgo Alto y filtro de régimen de mercado</strong>{" "}
              — ambos empeoraron el resultado en el período probado (predominantemente alcista).
            </li>
            <li>
              <strong>Bollinger %B</strong> — de un barrido de más de 11 estrategias candidatas,
              fue la única que destacó en el backtest de muestra completa (+104.87%). Un
              walk-forward rolling de 5 ventanas expuso que 2 de cada 5 perdían dinero fuera de
              muestra (Sharpe OOS promedio 1.076, una ventana en -0.81) — se descartó por
              inconsistencia temporal, no por el número agregado, que por sí solo parecía
              excelente.
            </li>
          </ul>
        </div>

        <div className="activo-bloque">
          <h2>Limitaciones conocidas</h2>
          <ul className="activo-lista">
            <li>
              El paper trading real con la configuración actual de 3 buckets se restauró el 5 de
              noviembre de 2026 (tras la reversión de Mean Reversion) — todavía tiene muy poco
              historial propio; el número de referencia (+34.00%/12.91%) es de backtesting, no del
              desempeño en vivo todavía.
            </li>
            <li>
              Varios bugs de software reales se encontraron y corrigieron durante el desarrollo
              (una reinterpretación de unidades guardadas que desplomó equity -75% en un tick, un
              bug de rebalanceo que infló un resultado a +103,254%, una revisión retroactiva de
              datos que distorsionó un índice sintético ~25.6% en un día, y la discrepancia no
              resuelta del todo entre +47.90% y +19.09% en el backtest de Mean Reversion) — todos
              se documentan en la Bitácora en vez de omitirse, junto con las correcciones
              aplicadas.
            </li>
            <li>
              La comparación directa del sistema contra comprar y mantener SPY todavía no existe
              como serie diaria del paper trading — solo a nivel de backtest por estrategia (ver
              Dashboard para el detalle completo de lo pendiente).
            </li>
          </ul>
        </div>

        <p style={{ marginTop: 32 }}>
          <Link href="/pulso-mercado/trading">← Volver a Trading Algorítmico</Link>
        </p>
      </div>
    </section>
  );
}
