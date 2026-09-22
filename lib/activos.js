/* ============================================================
   Glosario de activos/índices que aparecen en el Market Snapshot
   de Pulso de Mercado. Cada entrada tiene alias (para reconocer el
   nombre tal como lo escribe la Routine en la tabla) y una ficha
   con mercado + descripción para /pulso-mercado/activos/[slug].
   ============================================================ */

export const ACTIVOS = [
  {
    slug: "sp500",
    nombre: "S&P 500",
    alias: ["s&p 500", "s&p500", "sp 500", "sp500"],
    mercado: "Renta variable — Estados Unidos",
    descripcion:
      "Índice bursátil que agrupa a las 500 empresas más grandes que cotizan en bolsas de Estados Unidos, ponderado por capitalización de mercado. Es el termómetro más citado de la salud de la bolsa estadounidense y sirve como referencia (benchmark) para la mayoría de los fondos indexados del mundo.",
  },
  {
    slug: "nasdaq",
    nombre: "Nasdaq Composite",
    alias: ["nasdaq composite", "nasdaq 100", "nasdaq"],
    mercado: "Renta variable — Estados Unidos",
    descripcion:
      "Índice que agrupa a todas las empresas que cotizan en la bolsa Nasdaq, con fuerte peso de tecnología y semiconductores (Apple, Microsoft, Nvidia, Amazon, entre las más grandes). Suele moverse con más fuerza que el S&P 500 porque está más concentrado en un solo sector.",
  },
  {
    slug: "russell-2000",
    nombre: "Russell 2000",
    alias: ["russell 2000", "russell2000"],
    mercado: "Renta variable — Estados Unidos",
    descripcion:
      "Índice de las 2,000 empresas de menor capitalización (small caps) dentro del universo Russell 3000. Es más sensible a las tasas de interés y al crédito doméstico que los índices de mega-capitalización, por lo que sirve para medir la \"amplitud\" real de un rally del mercado.",
  },
  {
    slug: "dow-jones",
    nombre: "Dow Jones",
    alias: ["dow jones", "dow jones industrial average", "dow"],
    mercado: "Renta variable — Estados Unidos",
    descripcion:
      "El Dow Jones Industrial Average agrupa a 30 empresas industriales y de consumo de gran tamaño en EU. Es el índice bursátil más antiguo del país; al ser un promedio ponderado por precio (no por capitalización), reacciona distinto a S&P 500 o Nasdaq ante el mismo movimiento de mercado.",
  },
  {
    slug: "vix",
    nombre: "VIX",
    alias: ["vix", "cboe volatility index"],
    mercado: "Volatilidad — Estados Unidos",
    descripcion:
      "El \"índice del miedo\": mide la volatilidad implícita que el mercado de opciones espera para el S&P 500 en los próximos 30 días. Un VIX bajo (menor a 15-16) refleja calma/complacencia; uno alto (arriba de 25-30) refleja nerviosismo o estrés en el mercado.",
  },
  {
    slug: "ipc",
    nombre: "S&P/BMV IPC",
    alias: ["s&p/bmv ipc", "ipc", "indice de precios y cotizaciones"],
    mercado: "Renta variable — México",
    descripcion:
      "El Índice de Precios y Cotizaciones es el principal indicador de la Bolsa Mexicana de Valores, compuesto por las emisoras más representativas y líquidas que cotizan en México. Equivale al S&P 500 mexicano.",
  },
  {
    slug: "usd-mxn",
    nombre: "USD/MXN",
    alias: ["usd/mxn", "usdmxn", "peso mexicano", "tipo de cambio"],
    mercado: "Divisas (FX) — México / Estados Unidos",
    descripcion:
      "El tipo de cambio peso-dólar: cuántos pesos mexicanos cuesta un dólar estadounidense. Se mueve por diferenciales de tasas entre Banxico y la Fed, flujos de comercio (incluyendo petróleo), remesas y el apetito global por riesgo emergente.",
  },
  {
    slug: "us10y",
    nombre: "US 10Y",
    alias: ["us 10y", "10 year treasury", "treasury a 10 años", "10y"],
    mercado: "Renta fija — Estados Unidos",
    descripcion:
      "El rendimiento (yield) del bono del Tesoro de Estados Unidos a 10 años. Es la referencia global de la \"tasa libre de riesgo\" a largo plazo: influye en hipotecas, valuaciones de acciones de crecimiento y en el costo de financiamiento de gobiernos y empresas en todo el mundo.",
  },
  {
    slug: "wti",
    nombre: "WTI",
    alias: ["wti", "west texas intermediate", "petroleo wti"],
    mercado: "Commodities — Energía",
    descripcion:
      "West Texas Intermediate: la referencia (benchmark) de precio del petróleo crudo producido en Estados Unidos. Junto con el Brent (referencia europea/global), es uno de los dos precios de petróleo más seguidos del mundo y afecta directamente la inflación y las finanzas públicas de países petroleros como México.",
  },
  {
    slug: "brent",
    nombre: "Brent",
    alias: ["brent", "petroleo brent"],
    mercado: "Commodities — Energía",
    descripcion:
      "Referencia de precio del petróleo crudo extraído del Mar del Norte, usada como benchmark global (fuera de EU) para fijar el precio de gran parte del petróleo que se comercia en el mundo.",
  },
  {
    slug: "dxy",
    nombre: "DXY",
    alias: ["dxy", "indice dolar", "us dollar index"],
    mercado: "Divisas (FX) — Estados Unidos",
    descripcion:
      "Índice que mide el valor del dólar estadounidense frente a una canasta de seis divisas principales (euro, yen, libra, dólar canadiense, corona sueca y franco suizo). Un DXY al alza generalmente presiona a la baja a monedas emergentes como el peso mexicano.",
  },
];

const NORMALIZAR = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

/** Busca en el glosario el activo que corresponde al texto de una celda
 *  de tabla (ej. "S&P 500", "Nasdaq Composite (máximo histórico)"). */
export function buscarActivo(textoCelda) {
  const texto = NORMALIZAR(textoCelda);
  return (
    ACTIVOS.find((a) => a.alias.some((alias) => texto.includes(NORMALIZAR(alias)))) ||
    null
  );
}

export function getActivo(slug) {
  return ACTIVOS.find((a) => a.slug === slug) || null;
}
