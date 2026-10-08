/* ============================================================
   Universo de activos para el Screener y la Cinta de Pulso de
   Mercado. Solo acciones de EE.UU. — Finnhub no da precio en vivo
   para la BMV en el plan gratuito, así que el screener se limita al
   mercado donde sí hay datos completos confirmados.
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

// MELI cotiza en NASDAQ (no en la BMV), por eso sí tiene datos completos.
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

// 10 nombres adicionales de gran capitalización y liquidez, cubriendo
// sectores que aún no estaban representados (salud, industria, semis,
// consumo, energía, telecom).
export const MAS_RELEVANTES = [
  { symbol: "UNH", name: "UnitedHealth Group", sector: "Seguros de salud", mercado: "us" },
  { symbol: "LLY", name: "Eli Lilly and Co.", sector: "Farmacéutica", mercado: "us" },
  { symbol: "COST", name: "Costco Wholesale Corp.", sector: "Retail por membresía", mercado: "us" },
  { symbol: "HD", name: "Home Depot Inc.", sector: "Mejoras para el hogar", mercado: "us" },
  { symbol: "BAC", name: "Bank of America Corp.", sector: "Banca", mercado: "us" },
  { symbol: "ORCL", name: "Oracle Corp.", sector: "Software y nube", mercado: "us" },
  { symbol: "ADBE", name: "Adobe Inc.", sector: "Software creativo", mercado: "us" },
  { symbol: "CRM", name: "Salesforce Inc.", sector: "Software empresarial (CRM)", mercado: "us" },
  { symbol: "T", name: "AT&T Inc.", sector: "Telecomunicaciones", mercado: "us" },
  { symbol: "BA", name: "Boeing Co.", sector: "Aeroespacial y defensa", mercado: "us" },
];

// Commodities y otros activos de referencia, vía ETFs que cotizan en
// EE.UU. (mismo endpoint de Finnhub que las acciones, sin necesitar
// plan premium ni datos de futuros).
export const OTROS_ACTIVOS = [
  { symbol: "GLD", name: "SPDR Gold Shares (oro)", sector: "Commodities", mercado: "us" },
  { symbol: "SLV", name: "iShares Silver Trust (plata)", sector: "Commodities", mercado: "us" },
  { symbol: "USO", name: "United States Oil Fund (petróleo WTI)", sector: "Commodities", mercado: "us" },
  { symbol: "UUP", name: "Invesco DB US Dollar Index (dólar)", sector: "Divisas", mercado: "us" },
];

export const UNIVERSO = [
  ...MAGNIFICAS_7,
  ...BMV,
  ...OTROS_RELEVANTES,
  ...MAS_RELEVANTES,
  ...OTROS_ACTIVOS,
];

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
