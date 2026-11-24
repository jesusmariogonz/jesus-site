import Link from "next/link";
import { absUrl } from "@/lib/site";
import ExperimentosShowcase from "@/components/ExperimentosShowcase";
import { EXPERIMENTOS, contarPorEstado } from "@/lib/research/experimentos";

export const metadata = {
  title: "Research Lab — Pulso de Mercado",
  description:
    "El laboratorio de investigación cuantitativa de Pulso de Mercado: hipótesis, experimentos y hallazgos sobre volatilidad, predictibilidad de retornos, regímenes de mercado y anomalías — documentados con la misma transparencia que el sistema de trading algorítmico.",
  alternates: { canonical: "/pulso-mercado/research" },
  openGraph: {
    type: "website",
    url: absUrl("/pulso-mercado/research"),
    title: "Research Lab — Pulso de Mercado",
  },
};

// Dominios de investigación propuestos. Cada uno es una categoría de
// preguntas, no todavía un cuerpo de experimentos — se listan sus
// métodos de referencia para que el visitante entienda el tipo de
// trabajo que entra en cada uno conforme se publique.
const DOMINIOS = [
  {
    slug: "volatility-research",
    nombre: "Volatility Research",
    resumen:
      "Cómo se comporta y se puede anticipar la volatilidad: memoria de la volatilidad realizada, agrupamiento de volatilidad y el premio por riesgo de varianza.",
    metodos: ["HAR-RV", "GARCH / EGARCH", "Realized Volatility", "Volatility Clustering"],
  },
  {
    slug: "return-predictability",
    nombre: "Return Predictability",
    resumen:
      "Si el retorno pasado de un activo contiene información útil sobre su retorno futuro, y en qué horizontes y condiciones.",
    metodos: ["Time-Series Momentum", "Cross-Sectional Momentum", "Mean Reversion", "Overnight vs. Intraday"],
  },
  {
    slug: "market-regimes",
    nombre: "Market Regimes",
    resumen:
      "Si los mercados transitan entre estados estadísticamente distintos (ej. alta/baja volatilidad, tendencia/lateral) y si ese estado se puede detectar a tiempo, no solo describir después.",
    metodos: ["Hidden Markov Models", "Gaussian Mixture Models", "Markov Switching", "Change Point Detection"],
  },
  {
    slug: "market-anomalies",
    nombre: "Market Anomalies",
    resumen:
      "Patrones documentados en la literatura (efectos de calendario, anomalía overnight, baja volatilidad) y si sobreviven al aplicarse al universo de activos de este proyecto, con costos reales.",
    metodos: ["Calendar Effects", "Overnight Anomaly", "Low Volatility Anomaly", "Correlation Anomalies"],
  },
  {
    slug: "factor-research",
    nombre: "Factor Research",
    resumen:
      "Qué variables explican de forma sistemática la diferencia de retornos entre activos, más allá de una sola estrategia — factores de riesgo observables y latentes.",
    metodos: ["Risk Factors", "Latent Factors", "IPCA", "Factor Timing"],
  },
  {
    slug: "financial-ml",
    nombre: "Financial Machine Learning",
    resumen:
      "Modelos de aprendizaje automático aplicados a series financieras, con el mismo estándar de validación fuera de muestra que cualquier otro candidato — nunca una caja negra sin auditoría.",
    metodos: ["XGBoost", "Random Forest", "Bayesian Models", "Meta-labeling"],
  },
  {
    slug: "trend-following-funds",
    nombre: "Fondos de seguimiento de tendencia",
    resumen:
      "Cómo se comportan las estrategias sistemáticas de seguimiento de tendencia (CTA / managed futures) frente a acciones y bonos tradicionales — si aportan diversificación real en crisis ('crisis alpha') y si sus reglas, en gran parte públicas, se pueden replicar con instrumentos líquidos.",
    metodos: ["CTA / Managed Futures", "Time-Series Momentum Multi-Activo", "Crisis Alpha", "Replicación de Reglas Públicas"],
  },
  {
    slug: "pattern-recognition",
    nombre: "Patrones reconocibles para subir y bajar",
    resumen:
      "Si patrones de precio visualmente reconocibles (banderas, triángulos, cabeza-hombros, rupturas de rango) tienen poder predictivo real sobre la dirección futura del precio, más allá de la narrativa que se les atribuye después de los hechos.",
    metodos: ["Chart Patterns", "Candlestick Patterns", "Breakout Detection", "Template Matching"],
  },
];

const ETIQUETAS_ESTADO = ["EXPERIMENTAL", "VALIDATED", "REJECTED", "INCONCLUSIVE"];

export default function ResearchLabPage() {
  const conteo = contarPorEstado();
  return (
    <section className="section">
      <div className="container horizonte-page activo-page">
        <span className="pulsodash-eyebrow">
          <Link href="/pulso-mercado">Pulso de Mercado</Link> · Research Lab
        </span>
        <h1>Research & Discovery</h1>
        <nav className="trading-subnav" style={{ marginTop: 6, marginBottom: 20 }}>
          <Link href="/pulso-mercado/estrategias">Strategy Lab →</Link>
        </nav>
        <p className="activo-descripcion">
          Investigación cuantitativa sobre el comportamiento estadístico de los mercados:
          volatilidad, predictibilidad de retornos, regímenes y anomalías. El estándar aquí es el
          mismo que ya rige el sistema de{" "}
          <Link href="/pulso-mercado/trading">Trading Algorítmico</Link>: un hallazgo no cuenta
          como válido sin validación fuera de muestra, y un resultado negativo se documenta igual
          que uno positivo — es conocimiento, no un fracaso que se oculta.
        </p>

        <div className="research-lab-counters">
          <div className="research-lab-counter">
            <span className="research-lab-counter-valor">{conteo.EXPERIMENTAL}</span>
            <span className="research-lab-counter-etiqueta">Active experiments</span>
          </div>
          <div className="research-lab-counter">
            <span className="research-lab-counter-valor">{conteo.VALIDATED}</span>
            <span className="research-lab-counter-etiqueta">Validated findings</span>
          </div>
          <div className="research-lab-counter">
            <span className="research-lab-counter-valor">{conteo.REJECTED}</span>
            <span className="research-lab-counter-etiqueta">Rejected hypotheses</span>
          </div>
          <div className="research-lab-counter">
            <span className="research-lab-counter-valor">{conteo.INCONCLUSIVE}</span>
            <span className="research-lab-counter-etiqueta">Inconclusive results</span>
          </div>
          <div className="research-lab-counter">
            <span className="research-lab-counter-valor">{conteo.MIXED}</span>
            <span className="research-lab-counter-etiqueta">Mixed results</span>
          </div>
        </div>
        <p className="activo-descripcion" style={{ marginTop: -8 }}>
          Experimentos publicados: EXP-001 (INCONCLUSIVE), EXP-002 (REJECTED), EXP-003 (resultado mixto — 7 pruebas
          independientes, sin una sola etiqueta) y EXP-005 (INCONCLUSIVE — supera a los 4 baselines pero no sobrevive
          la corrección por búsqueda de grilla; validación forward congelada en curso) — ver abajo. Los contadores son
          reales: un resultado inconcluso, mixto o rechazado no cuenta como validado, y se actualizarán solo con
          investigación real publicada.
          </p>

        <div className="activo-bloque">
          <h2>Experimentos</h2>
          <p className="activo-descripcion">
            Cada experimento tiene su propia página con la pregunta, el método, los criterios
            fijados antes de ver resultados y el veredicto. Pasa el mouse sobre una tarjeta para ver
            más. El medidor de estrés de EXP-001 ya no se actualiza: su última lectura quedó
            congelada en la página del experimento.
          </p>
          <ExperimentosShowcase experimentos={EXPERIMENTOS} />
        </div>

        <div className="activo-bloque">
          <h2>Research domains</h2>
          <p className="activo-descripcion">
            Categorías de preguntas que esta sección investigará. Listar un dominio aquí no
            implica que ya exista un experimento corrido — es el mapa de lo que se piensa
            investigar, no un catálogo de resultados.
          </p>
          <div className="research-domains-grid">
            {DOMINIOS.map((d) => (
              <div key={d.slug} className="research-domain-card">
                <h3>{d.nombre}</h3>
                <p>{d.resumen}</p>
                <div className="research-domain-metodos">
                  {d.metodos.map((m) => (
                    <span key={m} className="research-domain-metodo">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="activo-bloque">
          <h2>Cómo se va a etiquetar cada resultado</h2>
          <p className="activo-descripcion">
            Para que nunca se confunda un resultado experimental con uno ya probado, cada hallazgo
            que se publique aquí llevará una de estas etiquetas, visibles siempre junto a la fecha
            y el período de datos usado:
          </p>
          <div className="research-domain-metodos" style={{ marginTop: 4 }}>
            {ETIQUETAS_ESTADO.map((e) => (
              <span key={e} className="research-domain-metodo">
                {e}
              </span>
            ))}
          </div>
          <p className="activo-descripcion" style={{ marginTop: 14 }}>
            Un hallazgo "validado" aquí no se convierte automáticamente en una estrategia de
            producción del sistema de trading — ese paso requiere, además, superar los controles
            de riesgo y la validación walk-forward que ya documenta la{" "}
            <Link href="/pulso-mercado/trading/investigacion">Investigación y metodología</Link>{" "}
            del trading algorítmico.
          </p>
        </div>

        <p style={{ marginTop: 32 }}>
          <Link href="/pulso-mercado">← Volver a Pulso de Mercado</Link>
        </p>
      </div>
    </section>
  );
}
