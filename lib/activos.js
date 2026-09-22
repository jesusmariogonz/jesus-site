/* ============================================================
   Glosario de activos/índices que aparecen en el Market Snapshot
   de Pulso de Mercado. Cada entrada tiene alias (para reconocer el
   nombre tal como lo escribe la Routine en la tabla) y una ficha
   detallada para /pulso-mercado/activos/[slug].
   ============================================================ */

export const ACTIVOS = [
  {
    slug: "sp500",
    nombre: "S&P 500",
    alias: ["s&p 500", "s&p500", "sp 500", "sp500"],
    mercado: "Renta variable — Estados Unidos",
    descripcion:
      "Índice bursátil que agrupa a las 500 empresas más grandes que cotizan en bolsas de Estados Unidos, ponderado por capitalización de mercado (las empresas más grandes pesan más en el índice). Es el termómetro más citado de la salud de la bolsa estadounidense y sirve como benchmark para la mayoría de los fondos indexados del mundo — cuando alguien dice \"el mercado subió\", casi siempre se refiere a este índice.",
    comoSeCalcula:
      "Lo administra S&P Dow Jones Indices. Suma el valor de mercado (precio × acciones en circulación) de las 500 empresas incluidas, ajustado por el porcentaje de acciones realmente disponibles para comprar (float ajustado), y lo compara contra un valor base.",
    queLoMueve: [
      "Resultados trimestrales (earnings) y guidance de las empresas que lo componen, sobre todo las de mayor peso (Apple, Microsoft, Nvidia, Amazon).",
      "Decisiones y comunicación de la Reserva Federal sobre tasas de interés.",
      "Datos macro de EU: inflación (CPI/PCE), empleo (payrolls) y crecimiento (GDP).",
      "Flujos de fondos indexados y de pensiones, que compran/venden el índice como bloque.",
    ],
    porQueImporta:
      "Es la referencia contra la que se mide el desempeño de casi cualquier portafolio de renta variable global, incluidos fondos que invierten en México. Su tendencia también influye en el apetito por riesgo hacia mercados emergentes como el mexicano.",
  },
  {
    slug: "nasdaq",
    nombre: "Nasdaq Composite",
    alias: ["nasdaq composite", "nasdaq 100", "nasdaq"],
    mercado: "Renta variable — Estados Unidos",
    descripcion:
      "Índice que agrupa a todas las empresas que cotizan en la bolsa Nasdaq, con fuerte peso de tecnología y semiconductores (Apple, Microsoft, Nvidia, Amazon, Meta, entre las más grandes). Suele moverse con más fuerza que el S&P 500 —para arriba y para abajo— porque está más concentrado en un solo sector.",
    comoSeCalcula:
      "Promedio ponderado por capitalización de mercado de todas las acciones comunes listadas en el Nasdaq (más de 3,000 empresas), a diferencia del Nasdaq-100 que solo incluye a las 100 más grandes no financieras.",
    queLoMueve: [
      "Earnings de las \"megacaps\" tecnológicas y noticias sobre inteligencia artificial y semiconductores.",
      "El nivel de las tasas de largo plazo (el 10Y): tasas más altas presionan más a estas empresas porque sus ganancias esperadas están más lejos en el tiempo.",
      "Regulación antimonopolio o de exportación de chips.",
    ],
    porQueImporta:
      "Funciona como termómetro del optimismo (o pánico) sobre el ciclo de inversión en IA y cómputo, el tema estructural más citado en Pulso de Mercado bajo Long Term.",
  },
  {
    slug: "russell-2000",
    nombre: "Russell 2000",
    alias: ["russell 2000", "russell2000"],
    mercado: "Renta variable — Estados Unidos",
    descripcion:
      "Índice de las 2,000 empresas de menor capitalización (small caps) dentro del universo Russell 3000. Es más sensible a las tasas de interés y al crédito doméstico que los índices de mega-capitalización, por lo que sirve para medir la \"amplitud\" real de un rally del mercado: si sube junto con el S&P 500/Nasdaq, la fortaleza es amplia; si no, el rally está concentrado en pocos nombres.",
    comoSeCalcula:
      "Lo administra FTSE Russell. Toma las 2,000 empresas más pequeñas del índice Russell 3000 (que cubre el 98% del mercado accionario de EU) y las pondera por capitalización de mercado ajustada por float.",
    queLoMueve: [
      "El costo del crédito: las small caps dependen más de financiamiento bancario y bonos de corto plazo que las grandes empresas.",
      "Expectativas sobre la economía doméstica de EU (menos exposición a ingresos internacionales que las megacaps).",
      "Rotación entre \"growth\" (tecnología grande) y \"value\"/small caps.",
    ],
    porQueImporta:
      "Una divergencia entre Nasdaq/S&P 500 subiendo y el Russell 2000 cayendo es una señal clásica de un mercado con liderazgo estrecho y potencialmente más frágil — justo el tipo de contexto que Pulso de Mercado marca en Market Regime.",
  },
  {
    slug: "dow-jones",
    nombre: "Dow Jones",
    alias: ["dow jones", "dow jones industrial average", "dow"],
    mercado: "Renta variable — Estados Unidos",
    descripcion:
      "El Dow Jones Industrial Average agrupa a 30 empresas industriales y de consumo de gran tamaño en EU (Boeing, Coca-Cola, Goldman Sachs, entre otras). Es el índice bursátil más antiguo del país (desde 1896) y el más citado en medios generalistas, aunque hoy es menos representativo del mercado que el S&P 500.",
    comoSeCalcula:
      "A diferencia de casi todos los índices modernos, es un promedio ponderado por precio, no por capitalización: una acción de $500 pesa más en el índice que una de $50, sin importar el tamaño real de la empresa. Por eso puede moverse distinto al S&P 500 ante la misma noticia.",
    queLoMueve: [
      "Resultados de sus 30 componentes, especialmente los de precio de acción más alto.",
      "Noticias sobre manufactura, aranceles y comercio internacional (mayor peso industrial que el S&P 500 o el Nasdaq).",
    ],
    porQueImporta:
      "Su metodología distinta lo hace útil como contraste: si el Dow y el S&P 500 se mueven en direcciones distintas el mismo día, suele ser por el peso desproporcionado de una o dos acciones caras dentro del Dow, no por un cambio real de tendencia.",
  },
  {
    slug: "vix",
    nombre: "VIX",
    alias: ["vix", "cboe volatility index"],
    mercado: "Volatilidad — Estados Unidos",
    descripcion:
      "El \"índice del miedo\": mide la volatilidad implícita que el mercado de opciones espera para el S&P 500 en los próximos 30 días. Un VIX bajo (menor a 15-16) refleja calma o complacencia; uno alto (arriba de 25-30) refleja nerviosismo o estrés genuino en el mercado.",
    comoSeCalcula:
      "Lo publica el CBOE (Chicago Board Options Exchange) a partir de los precios de opciones put y call sobre el S&P 500 con vencimiento cercano a 30 días. No mide volatilidad pasada, sino la que el mercado está dispuesto a pagar por protegerse hacia adelante.",
    queLoMueve: [
      "Incertidumbre sobre eventos próximos: decisiones de la Fed, elecciones, tensiones geopolíticas.",
      "Caídas bruscas del S&P 500 (el VIX tiende a subir cuando el mercado cae, y viceversa — correlación históricamente negativa).",
      "Posicionamiento de fondos que compran/venden protección (opciones) de forma masiva.",
    ],
    porQueImporta:
      "Un VIX que cae con fuerza el mismo día que el mercado sube confirma que el rally viene acompañado de menor percepción de riesgo, no solo de precio — una distinción que Pulso de Mercado usa en su scorecard de Market Regime.",
  },
  {
    slug: "ipc",
    nombre: "S&P/BMV IPC",
    alias: ["s&p/bmv ipc", "ipc", "indice de precios y cotizaciones"],
    mercado: "Renta variable — México",
    descripcion:
      "El Índice de Precios y Cotizaciones es el principal indicador de la Bolsa Mexicana de Valores (BMV), compuesto por las emisoras más representativas y líquidas que cotizan en México (América Móvil, Grupo México, Walmex, entre las de mayor peso). Equivale, en función, al S&P 500 mexicano.",
    comoSeCalcula:
      "Lo administra S&P Dow Jones Indices en conjunto con la BMV. Pondera por capitalización de mercado ajustada por float a las emisoras que cumplen criterios de bursatilidad (qué tan fácil es comprar/vender sus acciones) y revisa la muestra periódicamente.",
    queLoMueve: [
      "El tipo de cambio USD/MXN: un peso más fuerte suele beneficiar a las emisoras con ingresos en pesos y costos en dólares, y viceversa.",
      "Tasas de Banxico y su diferencial frente a la Fed.",
      "El desempeño de Wall Street, dado que muchos inversionistas institucionales globales asignan a México dentro de su porción de mercados emergentes.",
      "Precio del petróleo y noticias sobre Pemex, por su peso fiscal en la economía mexicana.",
    ],
    porQueImporta:
      "Es el punto de referencia obligado para cualquier inversionista o empresa que quiera entender si el capital extranjero está entrando o saliendo de activos mexicanos en un día o semana determinada.",
  },
  {
    slug: "usd-mxn",
    nombre: "USD/MXN",
    alias: ["usd/mxn", "usdmxn", "peso mexicano", "tipo de cambio"],
    mercado: "Divisas (FX) — México / Estados Unidos",
    descripcion:
      "El tipo de cambio peso-dólar: cuántos pesos mexicanos cuesta un dólar estadounidense. Es una de las divisas emergentes más líquidas y seguidas del mundo, en parte por el tamaño del comercio entre México y EU bajo el T-MEC.",
    comoSeCalcula:
      "Se cotiza continuamente en el mercado interbancario global (no tiene una sola \"bolsa\"); Banxico publica un tipo de cambio de referencia (FIX) una vez al día a partir de cotizaciones de bancos, usado para fines contables y contractuales, pero el precio de mercado se mueve las 24 horas.",
    queLoMueve: [
      "El diferencial de tasas entre Banxico y la Fed: entre más alto, más atractivo el peso para el carry trade (pedir prestado en una divisa barata para invertir en una de tasa más alta).",
      "El precio del petróleo (ingresos petroleros del gobierno) y el flujo de remesas.",
      "El apetito global por riesgo: en episodios de aversión al riesgo, los inversionistas suelen vender divisas emergentes y comprar dólares.",
      "Noticias comerciales o arancelarias entre México y Estados Unidos.",
    ],
    porQueImporta:
      "Afecta directamente la inflación importada, el costo de la deuda en dólares de empresas mexicanas y la competitividad de las exportaciones — es probablemente el precio individual más vigilado de la economía mexicana.",
  },
  {
    slug: "us10y",
    nombre: "US 10Y",
    alias: ["us 10y", "10 year treasury", "treasury a 10 años", "10y"],
    mercado: "Renta fija — Estados Unidos",
    descripcion:
      "El rendimiento (yield) del bono del Tesoro de Estados Unidos a 10 años. Es la referencia global de la \"tasa libre de riesgo\" a largo plazo: influye en hipotecas, valuaciones de acciones de crecimiento y en el costo de financiamiento de gobiernos y empresas en todo el mundo.",
    comoSeCalcula:
      "El Tesoro de EU emite el bono a un precio y tasa fijos (cupón); el yield que se reporta a diario es la tasa de retorno efectiva si se compra el bono a su precio actual de mercado, que sube cuando el precio del bono baja y viceversa (relación inversa precio-yield).",
    queLoMueve: [
      "Expectativas sobre la trayectoria de tasas de la Fed y la inflación de largo plazo.",
      "La oferta de deuda del Tesoro (cuánto necesita emitir el gobierno de EU) frente a la demanda de compradores como bancos centrales extranjeros.",
      "Percepción de riesgo fiscal de Estados Unidos.",
    ],
    porQueImporta:
      "Cuando el 10Y sube, presiona a la baja a las acciones de crecimiento (tecnología) y encarece el crédito en todo el mundo, incluido México; cuando baja, suele ser un viento a favor para activos de riesgo — es una de las variables que más aparece en Market Regime y en la sección Position de Pulso de Mercado.",
  },
  {
    slug: "wti",
    nombre: "WTI",
    alias: ["wti", "west texas intermediate", "petroleo wti"],
    mercado: "Commodities — Energía",
    descripcion:
      "West Texas Intermediate: la referencia (benchmark) de precio del petróleo crudo producido en Estados Unidos. Junto con el Brent (referencia europea/global), es uno de los dos precios de petróleo más seguidos del mundo y afecta directamente la inflación y las finanzas públicas de países petroleros como México.",
    comoSeCalcula:
      "Se cotiza principalmente a través de contratos de futuros en el NYMEX (parte del CME Group), sobre un crudo ligero y de baja densidad de azufre entregado en Cushing, Oklahoma, el punto de entrega físico de referencia.",
    queLoMueve: [
      "Decisiones de producción de la OPEP+ y de productores de EU (shale).",
      "Tensión geopolítica en regiones productoras (Medio Oriente, Rusia).",
      "Expectativas de demanda global, ligadas al crecimiento económico de China y EU.",
      "Niveles de inventarios semanales en EU (reportes de la EIA).",
    ],
    porQueImporta:
      "Para México, el precio del petróleo afecta directamente los ingresos petroleros del gobierno y el balance fiscal; una caída fuerte y sostenida es un riesgo macro relevante, no solo una noticia de mercado.",
  },
  {
    slug: "brent",
    nombre: "Brent",
    alias: ["brent", "petroleo brent"],
    mercado: "Commodities — Energía",
    descripcion:
      "Referencia de precio del petróleo crudo extraído del Mar del Norte, usada como benchmark global (fuera de EU) para fijar el precio de gran parte del petróleo que se comercia en el mundo, incluida buena parte de las exportaciones mexicanas de crudo.",
    comoSeCalcula:
      "Se cotiza en el mercado de futuros ICE, sobre crudo producido en campos del Mar del Norte (Brent, Forties, Oseberg, Ekofisk). A diferencia del WTI, es un crudo transportado por barco, lo que lo hace más sensible a rutas marítimas y tensiones geopolíticas globales.",
    queLoMueve: [
      "Los mismos factores que el WTI (OPEP+, geopolítica, demanda global), pero con mayor sensibilidad a rutas de transporte marítimo (ej. Estrecho de Ormuz, Mar Rojo).",
      "El diferencial Brent-WTI, que refleja diferencias de oferta/logística entre EU y el resto del mundo.",
    ],
    porQueImporta:
      "Suele ser la referencia más relevante para el precio de exportación del petróleo mexicano (la mezcla mexicana cotiza con descuento frente al Brent), por lo que su nivel importa tanto o más que el WTI para las finanzas públicas de México.",
  },
  {
    slug: "dxy",
    nombre: "DXY",
    alias: ["dxy", "indice dolar", "us dollar index"],
    mercado: "Divisas (FX) — Estados Unidos",
    descripcion:
      "Índice que mide el valor del dólar estadounidense frente a una canasta de seis divisas principales (euro, yen, libra, dólar canadiense, corona sueca y franco suizo). Un DXY al alza generalmente presiona a la baja a monedas emergentes como el peso mexicano.",
    comoSeCalcula:
      "Se calcula como un promedio geométrico ponderado de los tipos de cambio del dólar contra esas seis divisas; el euro tiene, por mucho, el mayor peso (más de la mitad del índice), así que el DXY se mueve en gran medida en función del par EUR/USD.",
    queLoMueve: [
      "Diferenciales de tasas entre la Fed y el Banco Central Europeo, sobre todo.",
      "Flujos hacia activos refugio en momentos de estrés global (el dólar suele fortalecerse cuando sube la aversión al riesgo).",
      "Datos macro relativos de EU frente a la eurozona, Japón y Reino Unido.",
    ],
    porQueImporta:
      "Aunque no incluye directamente al peso mexicano, un DXY fuerte casi siempre coincide con presión sobre divisas emergentes en general, así que sirve como contexto para interpretar movimientos del USD/MXN que no tienen una causa local clara.",
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
