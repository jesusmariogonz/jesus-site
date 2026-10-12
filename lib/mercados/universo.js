/* ============================================================
   Universo de activos para el Screener y la Cinta de Pulso de
   Mercado. Solo acciones de EE.UU. — Finnhub no da precio en vivo
   para la BMV en el plan gratuito, así que el screener se limita al
   mercado donde sí hay datos completos confirmados.

   El orden de cada grupo, y el orden en que se concatenan al final
   en UNIVERSO, es deliberado: de más a menos importante/reconocido,
   porque el screener los muestra en ese mismo orden (no hay re-orden
   automático por capitalización de mercado — esta fuente gratuita no
   la provee de forma confiable para todo el universo).

   Tamaño del universo: no es "todas las acciones de EE.UU." (serían
   miles) sino las ~94 más grandes y líquidas, cubriendo los 11
   sectores GICS — el límite real es el plan gratuito de Finnhub
   (~60 llamadas/minuto): un universo de miles de símbolos excedería
   ese límite en cada actualización. Las fichas de activos fuera de
   este universo (buscadas por símbolo en el sitio) siguen
   funcionando igual, vía /api/mercados/ficha.
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

// Ampliación por sector: nombres grandes y líquidos que todavía no
// estaban cubiertos, para que el screener represente los 11 sectores
// GICS y no solo tecnología/consumo. Ordenados dentro de cada sector
// de mayor a menor capitalización/reconocimiento aproximado.
export const FINANCIERO = [
  { symbol: "GS", name: "Goldman Sachs Group", sector: "Banca de inversión", mercado: "us" },
  { symbol: "MS", name: "Morgan Stanley", sector: "Banca de inversión", mercado: "us" },
  { symbol: "WFC", name: "Wells Fargo & Co.", sector: "Banca", mercado: "us" },
  { symbol: "C", name: "Citigroup Inc.", sector: "Banca", mercado: "us" },
  { symbol: "AXP", name: "American Express Co.", sector: "Pagos y crédito", mercado: "us" },
  { symbol: "MA", name: "Mastercard Inc.", sector: "Pagos y fintech", mercado: "us" },
  { symbol: "SPGI", name: "S&P Global Inc.", sector: "Servicios financieros y datos", mercado: "us" },
  { symbol: "BLK", name: "BlackRock Inc.", sector: "Gestión de activos", mercado: "us" },
  { symbol: "SCHW", name: "Charles Schwab Corp.", sector: "Banca y correduría", mercado: "us" },
  { symbol: "PYPL", name: "PayPal Holdings", sector: "Pagos digitales", mercado: "us" },
];

export const SALUD = [
  { symbol: "ABBV", name: "AbbVie Inc.", sector: "Farmacéutica", mercado: "us" },
  { symbol: "MRK", name: "Merck & Co.", sector: "Farmacéutica", mercado: "us" },
  { symbol: "PFE", name: "Pfizer Inc.", sector: "Farmacéutica", mercado: "us" },
  { symbol: "TMO", name: "Thermo Fisher Scientific", sector: "Equipo e insumos médicos", mercado: "us" },
  { symbol: "ABT", name: "Abbott Laboratories", sector: "Equipo e insumos médicos", mercado: "us" },
  { symbol: "DHR", name: "Danaher Corp.", sector: "Equipo e insumos médicos", mercado: "us" },
  { symbol: "AMGN", name: "Amgen Inc.", sector: "Biotecnología", mercado: "us" },
  { symbol: "ISRG", name: "Intuitive Surgical", sector: "Equipo médico (robótica quirúrgica)", mercado: "us" },
  { symbol: "GILD", name: "Gilead Sciences", sector: "Biotecnología", mercado: "us" },
  { symbol: "CVS", name: "CVS Health Corp.", sector: "Salud y farmacias", mercado: "us" },
];

export const TECNOLOGIA_AMPLIADA = [
  { symbol: "CSCO", name: "Cisco Systems", sector: "Redes y telecom", mercado: "us" },
  { symbol: "IBM", name: "IBM Corp.", sector: "Tecnología empresarial", mercado: "us" },
  { symbol: "AMD", name: "Advanced Micro Devices", sector: "Semiconductores", mercado: "us" },
  { symbol: "QCOM", name: "Qualcomm Inc.", sector: "Semiconductores", mercado: "us" },
  { symbol: "TXN", name: "Texas Instruments", sector: "Semiconductores", mercado: "us" },
  { symbol: "INTC", name: "Intel Corp.", sector: "Semiconductores", mercado: "us" },
  { symbol: "MU", name: "Micron Technology", sector: "Semiconductores (memoria)", mercado: "us" },
  { symbol: "AMAT", name: "Applied Materials", sector: "Equipo de semiconductores", mercado: "us" },
  { symbol: "NOW", name: "ServiceNow Inc.", sector: "Software empresarial", mercado: "us" },
  { symbol: "INTU", name: "Intuit Inc.", sector: "Software financiero", mercado: "us" },
  { symbol: "PANW", name: "Palo Alto Networks", sector: "Ciberseguridad", mercado: "us" },
  { symbol: "UBER", name: "Uber Technologies", sector: "Plataformas y movilidad", mercado: "us" },
];

export const CONSUMO = [
  { symbol: "MCD", name: "McDonald's Corp.", sector: "Restaurantes", mercado: "us" },
  { symbol: "SBUX", name: "Starbucks Corp.", sector: "Restaurantes", mercado: "us" },
  { symbol: "NKE", name: "Nike Inc.", sector: "Vestimenta deportiva", mercado: "us" },
  { symbol: "LOW", name: "Lowe's Companies", sector: "Mejoras para el hogar", mercado: "us" },
  { symbol: "TGT", name: "Target Corp.", sector: "Retail", mercado: "us" },
  { symbol: "PEP", name: "PepsiCo Inc.", sector: "Bebidas y alimentos", mercado: "us" },
  { symbol: "PM", name: "Philip Morris International", sector: "Tabaco", mercado: "us" },
  { symbol: "CL", name: "Colgate-Palmolive Co.", sector: "Consumo básico", mercado: "us" },
];

export const INDUSTRIAL_ENERGIA = [
  { symbol: "CVX", name: "Chevron Corp.", sector: "Energía", mercado: "us" },
  { symbol: "COP", name: "ConocoPhillips", sector: "Energía (exploración y producción)", mercado: "us" },
  { symbol: "CAT", name: "Caterpillar Inc.", sector: "Maquinaria industrial", mercado: "us" },
  { symbol: "GE", name: "General Electric Co.", sector: "Industrial y aeroespacial", mercado: "us" },
  { symbol: "HON", name: "Honeywell International", sector: "Industrial diversificado", mercado: "us" },
  { symbol: "RTX", name: "RTX Corp. (Raytheon)", sector: "Aeroespacial y defensa", mercado: "us" },
  { symbol: "UNP", name: "Union Pacific Corp.", sector: "Ferrocarriles", mercado: "us" },
  { symbol: "UPS", name: "United Parcel Service", sector: "Logística y transporte", mercado: "us" },
  { symbol: "DE", name: "Deere & Co.", sector: "Maquinaria agrícola", mercado: "us" },
];

export const COMUNICACION_SERVICIOS = [
  { symbol: "VZ", name: "Verizon Communications", sector: "Telecomunicaciones", mercado: "us" },
  { symbol: "TMUS", name: "T-Mobile US", sector: "Telecomunicaciones", mercado: "us" },
  { symbol: "CMCSA", name: "Comcast Corp.", sector: "Medios y telecom", mercado: "us" },
  { symbol: "NEE", name: "NextEra Energy", sector: "Utilities (energía renovable)", mercado: "us" },
  { symbol: "DUK", name: "Duke Energy Corp.", sector: "Utilities", mercado: "us" },
];

export const MATERIALES_BIENES_RAICES = [
  { symbol: "LIN", name: "Linde plc", sector: "Químicos industriales", mercado: "us" },
  { symbol: "FCX", name: "Freeport-McMoRan", sector: "Minería (cobre)", mercado: "us" },
  { symbol: "PLD", name: "Prologis Inc.", sector: "Bienes raíces (REIT industrial)", mercado: "us" },
  { symbol: "AMT", name: "American Tower Corp.", sector: "Bienes raíces (REIT torres de telecom)", mercado: "us" },
];

// Commodities, divisas e índices de referencia, vía ETFs que cotizan en
// EE.UU. (mismo endpoint de Finnhub que las acciones, sin necesitar
// plan premium ni datos de futuros).
export const OTROS_ACTIVOS = [
  { symbol: "SPY", name: "SPDR S&P 500 ETF", sector: "Índice (S&P 500)", mercado: "us" },
  { symbol: "QQQ", name: "Invesco QQQ Trust (Nasdaq 100)", sector: "Índice (Nasdaq 100)", mercado: "us" },
  { symbol: "DIA", name: "SPDR Dow Jones Industrial Average ETF", sector: "Índice (Dow 30)", mercado: "us" },
  { symbol: "IWM", name: "iShares Russell 2000 ETF", sector: "Índice (Russell 2000)", mercado: "us" },
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
  ...FINANCIERO,
  ...SALUD,
  ...TECNOLOGIA_AMPLIADA,
  ...CONSUMO,
  ...INDUSTRIAL_ENERGIA,
  ...COMUNICACION_SERVICIOS,
  ...MATERIALES_BIENES_RAICES,
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
