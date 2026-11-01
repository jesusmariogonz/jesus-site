import Link from "next/link";

/* Banner vistoso hacia /pulso-mercado/trading, mismo patrón visual que
   LibrosMercadoBanner pero con su propio tema (oscuro, estilo terminal)
   para que se distinga como la sección "experimento" del sitio. */
export default function TradingAlgoritmicoBanner() {
  return (
    <Link href="/pulso-mercado/trading" className="trading-algo-banner">
      <span className="trading-algo-banner-eyebrow">The Quantitative Experiment</span>
      <p className="trading-algo-banner-titulo">Trading Algorítmico</p>
      <p className="trading-algo-banner-desc">
        Backtesting, paper trading diario y gestión de riesgo de un sistema de inversión
        sistemático — resultados reales, auditables, sin dinero real todavía.
      </p>
      <span className="trading-algo-banner-cta">Ver el dashboard →</span>
    </Link>
  );
}
