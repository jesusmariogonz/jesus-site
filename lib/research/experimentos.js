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
  {
    slug: "exp-002-growth-max-global",
    id: "EXP-002",
    nombre: "Growth-Max Global",
    dominio: "Asset Allocation",
    // EXPERIMENTAL | VALIDATED | REJECTED | INCONCLUSIVE
    estado: "REJECTED",
    fecha: "2026-11-13",
    imagen: "/research/exp-002.jpg",
    resumen:
      "Una grilla de 17,280 variantes de asignación de capital, sobre 65 instrumentos globales, que buscaba maximizar el crecimiento compuesto aceptando más riesgo.",
    pregunta:
      "¿Puede una política de apalancamiento y rotación de régimen macro, elegida entre miles de variantes, hacer crecer el capital más rápido que un portafolio simple 60/40, fuera de la muestra con la que se eligió?",
    hallazgo:
      "La variante ganadora no superó al benchmark 60/40 en el periodo de prueba bloqueado (2020–2026): solo le ganó en el 8.4% de los escenarios simulados, muy por debajo del 80% exigido. A mayor apalancamiento, peor resultado.",
    chips: ["Momentum", "Régimen macro", "Apalancamiento", "Kelly fraccional", "Frontera de riesgo"],
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
