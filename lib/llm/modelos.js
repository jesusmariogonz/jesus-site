/* Catálogo de modelos y precios (USD por millón de tokens).
   Los IDs son los que ya usaba el sitio (Haiku) y los alias vigentes de
   Sonnet y Opus. Los precios son ESTIMACIONES para el panel de costos:
   confírmalos en console.anthropic.com y ajústalos aquí si cambian
   (o usa LLM_MODEL_SONNET / LLM_MODEL_OPUS para cambiar el ID sin deploy
   de código). Orden de la jerarquía: haiku → sonnet → opus. */

export const TIERS = ["haiku", "sonnet", "opus"];

export const MODELOS = {
  haiku: {
    id: process.env.LLM_MODEL_HAIKU || "claude-haiku-4-5",
    precio: { entrada: 1, salida: 5 },
  },
  sonnet: {
    id: process.env.LLM_MODEL_SONNET || "claude-sonnet-4-5",
    precio: { entrada: 3, salida: 15 },
  },
  opus: {
    id: process.env.LLM_MODEL_OPUS || "claude-opus-4-5",
    precio: { entrada: 5, salida: 25 },
  },
};

export function costoEstimado(tier, tokensEntrada, tokensSalida) {
  const p = MODELOS[tier].precio;
  return (tokensEntrada * p.entrada + tokensSalida * p.salida) / 1_000_000;
}

/** Siguiente nivel de la jerarquía, o null si ya es el último. */
export function siguienteTier(tier) {
  const i = TIERS.indexOf(tier);
  return i >= 0 && i < TIERS.length - 1 ? TIERS[i + 1] : null;
}
