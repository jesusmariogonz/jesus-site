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

        <div className="trading-disclaimer">{TRADING_DISCLAIMER}</div>

        <TradingPublicoExplorer data={data} />
      </div>
    </section>
  );
}
