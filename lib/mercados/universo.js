/* ============================================================
   Universo de activos para el Screener y la Cinta de Pulso de
   Mercado. Símbolos en formato Finnhub — las acciones de EE.UU.
   no llevan sufijo; las de la BMV usan sufijo ".MX" (cobertura
   internacional de Finnhub depende del plan — si no hay datos, el
   screener lo muestra como "no disponible", nunca inventado).
   ============================================================ */

export const MAGNIFICAS_7 = [
  { symbol: "NVDA", name: "NVIDIA Corp.", sector: "Semiconductores e IA", mercado: "us" },
  { symbol: "MSFT", name: "Microsoft Corp.", sector: "Software y nube", mercado: "us" },
  { symbol: "AAPL", name: "Apple Inc.", sector: "Electrónica de consumo", mercado: "us" },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Tecnología y publicidad", mercado: "us" },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "E-commerce y cloud (AWS)", mercado: "us" },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Redes sociales y publicidad", mercado: "us" },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Vehículos eléctricos y energía", mercado: "us" },
];

export const BMV = [
  { symbol: "AMXL.MX", name: "América Móvil", sector: "Telecomunicaciones", mercado: "mx" },
  { symbol: "CEMEXCPO.MX", name: "Cemex", sector: "Materiales de construcción", mercado: "mx" },
  { symbol: "BIMBOA.MX", name: "Grupo Bimbo", sector: "Consumo básico", mercado: "mx" },
  { symbol: "FEMSAUBD.MX", name: "FEMSA", sector: "Consumo / retail", mercado: "mx" },
  { symbol: "MELI", name: "MercadoLibre", sector: "E-commerce y fintech (NASDAQ)", mercado: "us" },
];

export const UNIVERSO = [...MAGNIFICAS_7, ...BMV];

/** Símbolos de la cinta superior — un mix de índices (vía ETF) y
 *  nombres de referencia, igual al estilo de Alfia. */
export const CINTA = [
  { symbol: "GLD", name: "SPDR Gold Shares" },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "SPY", name: "S&P 500" },
  { symbol: "DIA", name: "Dow 30" },
  { symbol: "QQQ", name: "Nasdaq 100" },
  { symbol: "IWM", name: "Russell 2000" },
];
