import Link from "next/link";

/* Banner hacia /pulso-mercado/estrategias, mismo patrón visual que
   ResearchLabBanner/TradingAlgoritmicoBanner, con su propio acento (ámbar)
   para distinguirlo: es el catálogo que une Research y Trading, no una
   tercera sección independiente. Portada abstracta (public/pulso/
   strategy-lab.jpg) — no fotorrealista como las otras dos, generada con
   matplotlib en vez de IA de imágenes.*/
export default function StrategyLabBanner() {
  return (
    <Link href="/pulso-mercado/estrategias" className="strategy-lab-banner">
      <span
        className="area-banner-img"
        style={{ backgroundImage: "url(/pulso/strategy-lab.jpg)" }}
        aria-hidden="true"
      >
        <span className="area-banner-img-overlay" />
      </span>
      <span className="area-banner-body">
        <span className="strategy-lab-banner-eyebrow">Strategy Registry</span>
        <p className="strategy-lab-banner-titulo">Strategy Lab</p>
        <p className="strategy-lab-banner-desc">
          El catálogo único de cada estrategia probada: las que están en producción, las que se
          descartaron con evidencia, y las candidatas de investigación que todavía no se promueven
          a nada.
        </p>
        <span className="strategy-lab-banner-cta">Ver el catálogo →</span>
      </span>
    </Link>
  );
}
