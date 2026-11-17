import Link from "next/link";

/* Banner hacia /pulso-mercado/research, mismo patrón visual que
   TradingAlgoritmicoBanner pero con su propio acento (azul en vez de
   verde) para distinguirlo como la sección de investigación cuantitativa,
   separada del trading algorítmico en producción. Lleva una portada
   generada con IA (public/pulso/research-lab.jpg), como las tarjetas de
   /proyectos. */
export default function ResearchLabBanner() {
  return (
    <Link href="/pulso-mercado/research" className="research-lab-banner">
      <span
        className="area-banner-img"
        style={{ backgroundImage: "url(/pulso/research-lab.jpg)" }}
        aria-hidden="true"
      >
        <span className="area-banner-img-overlay" />
      </span>
      <span className="area-banner-body">
        <span className="research-lab-banner-eyebrow">Quantitative Research</span>
        <p className="research-lab-banner-titulo">Research Lab</p>
        <p className="research-lab-banner-desc">
          El laboratorio de investigación cuantitativa de Pulso de Mercado: hipótesis, experimentos
          y hallazgos sobre el comportamiento estadístico de los mercados — con los resultados
          negativos documentados igual que los positivos.
        </p>
        <span className="research-lab-banner-cta">Explorar Research Lab →</span>
      </span>
    </Link>
  );
}
