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

// BMV (AMXL.MX, CEMEXCPO.MX, BIMBOA.MX, FEMSAUBD.MX) se quitó: Finnhub no
// da precio en vivo para la Bolsa Mexicana en el plan gratuito, así que
// siempre salían "no disponible". MELI cotiza en NASDAQ, sí tiene datos.
export const BMV = [
  { symbol: "MELI", name: "MercadoLibre", sector: "E-commerce y fintech (NASDAQ)", mercado: "us" },
];

// Otros nombres grandes y líquidos de EE.UU., con datos completos
// confirmados (precio + histórico), para ampliar el universo más allá
// de las Magníficas 7.
export const OTROS_RELEVANTES = [
  { symbol: "NFLX", name: "Netflix Inc.", sector: "Streaming y entretenimiento", mercado: "us" },
  { symbol: "AVGO", name: "Broadcom Inc.", sector: "Semiconductores", mercado: "us" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Banca", mercado: "us" },
  { symbol: "V", name: "Visa Inc.", sector: "Pagos y fintech", mercado: "us" },
  { symbol: "WMT", name: "Walmart Inc.", sector: "Retail", mercado: "us" },
  { symbol: "XOM", name: "Exxon Mobil Corp.", sector: "Energía", mercado: "us" },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Salud y farmacéutica", mercado: "us" },
  { symbol: "PG", name: "Procter & Gamble Co.", sector: "Consumo básico", mercado: "us" },
  { symbol: "KO", name: "Coca-Cola Co.", sector: "Bebidas y consumo", mercado: "us" },
  { symbol: "DIS", name: "Walt Disney Co.", sector: "Medios y entretenimiento", mercado: "us" },
];

export const UNIVERSO = [...MAGNIFICAS_7, ...BMV, ...OTROS_RELEVANTES];

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
