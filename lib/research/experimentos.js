/* Catálogo de experimentos del Research Lab. Para agregar uno nuevo:
   1) añade un objeto aquí, 2) genera su imagen en public/research/<slug>.jpg,
   3) crea su contenido de detalle en app/pulso-mercado/research/[slug]/page.js
   (mapa DETALLES). Los contadores de /pulso-mercado/research se calculan
   desde `estado`, así que nunca se desalinean del catálogo. */

export const EXPERIMENTOS = [
  {
    slug: "exp-001-modelo-de-emergencia",
    id: "EXP-001",
    nombre: "Modelo de emergencia multifactor",
    dominio: "Market Regimes",
    // EXPERIMENTAL | VALIDATED | REJECTED | INCONCLUSIVE
    estado: "INCONCLUSIVE",
    fecha: "2026-11-11",
    imagen: "/research/exp-001.jpg",
    resumen:
      "Un índice de estrés de mercado que combina seis señales para reducir la peor caída de una cartera de acciones sin sacrificar su rendimiento.",
    pregunta:
      "¿Puede un índice multifactor de estrés de mercado reducir la peor caída de una cartera de acciones sin sacrificar su rendimiento de largo plazo, frente a reglas simples?",
    hallazgo:
      "Cumple tres de los cuatro criterios pre-registrados; su ventaja sobre la regla simple SMA200 es demasiado pequeña, con solo tres episodios de crisis evaluables, para distinguirla de la casualidad.",
    chips: ["Tendencia", "Volatilidad", "Crédito", "Amplitud", "Correlación"],
  },
];

export function getExperimento(slug) {
  return EXPERIMENTOS.find((e) => e.slug === slug) || null;
}

export function contarPorEstado() {
  const c = { EXPERIMENTAL: 0, VALIDATED: 0, REJECTED: 0, INCONCLUSIVE: 0 };
  for (const e of EXPERIMENTOS) if (e.estado in c) c[e.estado] += 1;
  return c;
}
