/* Información factual y estable (qué es, qué sector/índice sigue, cómo
   funciona) de los símbolos que puede operar el sistema de trading
   algorítmico — para la página /pulso-mercado/trading/simbolo/[symbol].
   Nunca cifras de mercado (precio, capitalización, etc.) aquí: eso
   cambia todos los días y vendría de un snapshot, no de un archivo
   estático. Solo identidad y contexto del instrumento — hechos
   públicos y estables, no opiniones de inversión ni proyecciones.
   Si un símbolo no aparece aquí, la página omite esta sección en vez
   de inventar una descripción. */

export const SIMBOLOS_INFO = {
  // --- ETFs — bucket Largo Plazo ---
  SPY: {
    nombre: "SPDR S&P 500 ETF Trust",
    tipo: "ETF",
    sector: "Índice accionario — EE. UU., gran capitalización",
    descripcion:
      "Replica el S&P 500, el índice de referencia de las 500 empresas más grandes que cotizan en bolsa en EE. UU., ponderado por capitalización de mercado. Es el ETF más antiguo y uno de los más líquidos del mundo, lanzado en 1993 por State Street Global Advisors. Sirve como benchmark de referencia para la mayoría de los gestores de fondos activos en EE. UU. — superarlo consistentemente es, históricamente, difícil incluso para profesionales.",
  },
  QQQ: {
    nombre: "Invesco QQQ Trust",
    tipo: "ETF",
    sector: "Índice accionario — EE. UU., tecnología",
    descripcion:
      "Replica el Nasdaq-100, las 100 empresas no financieras más grandes que cotizan en el Nasdaq. Tiene una concentración mucho mayor en tecnología que el S&P 500 (Apple, Microsoft, Nvidia, Amazon y Meta suelen representar una porción grande del índice), lo que lo hace más volátil pero también más expuesto al crecimiento de ese sector.",
  },
  VTI: {
    nombre: "Vanguard Total Stock Market ETF",
    tipo: "ETF",
    sector: "Índice accionario — EE. UU., mercado total",
    descripcion:
      "A diferencia del S&P 500 (solo grandes empresas), VTI intenta replicar el mercado accionario completo de EE. UU.: grandes, medianas y pequeñas empresas, miles de acciones en un solo fondo. Es uno de los ETFs de más bajo costo de Vanguard y una de las posiciones más comunes en portafolios pasivos de largo plazo.",
  },
  DIA: {
    nombre: "SPDR Dow Jones Industrial Average ETF",
    tipo: "ETF",
    sector: "Índice accionario — EE. UU., industriales de gran capitalización",
    descripcion:
      "Replica el Dow Jones Industrial Average, el índice bursátil más antiguo de EE. UU. (desde 1896), compuesto por solo 30 empresas grandes y establecidas. A diferencia del S&P 500 (ponderado por capitalización), el Dow pondera por precio de la acción, una metodología poco común que puede distorsionar el peso real de cada empresa en el índice.",
  },
  IWM: {
    nombre: "iShares Russell 2000 ETF",
    tipo: "ETF",
    sector: "Índice accionario — EE. UU., pequeña capitalización",
    descripcion:
      "Replica el Russell 2000, un índice de 2,000 empresas pequeñas (small-cap) de EE. UU. Suele moverse de forma más volátil que los índices de gran capitalización y es más sensible a las condiciones económicas internas de EE. UU. (menos ingresos internacionales que las grandes multinacionales del S&P 500).",
  },
  EFA: {
    nombre: "iShares MSCI EAFE ETF",
    tipo: "ETF",
    sector: "Índice accionario internacional — mercados desarrollados",
    descripcion:
      "Replica el índice MSCI EAFE (Europa, Australasia y Lejano Oriente): mercados accionarios desarrollados fuera de EE. UU. y Canadá — Reino Unido, Japón, Francia, Alemania, Suiza, Australia, entre otros. Es una de las formas más comunes de diversificar un portafolio fuera de EE. UU. sin asumir el riesgo adicional de mercados emergentes.",
  },
  VWO: {
    nombre: "Vanguard FTSE Emerging Markets ETF",
    tipo: "ETF",
    sector: "Índice accionario internacional — mercados emergentes",
    descripcion:
      "Replica un índice de mercados accionarios emergentes (China, India, Taiwán, Brasil, entre otros), siguiendo la metodología FTSE. Los mercados emergentes suelen tener mayor potencial de crecimiento económico que los desarrollados, pero también mayor volatilidad, riesgo cambiario y riesgo político/regulatorio.",
  },
  AGG: {
    nombre: "iShares Core U.S. Aggregate Bond ETF",
    tipo: "ETF",
    sector: "Renta fija — EE. UU., grado de inversión, plazos mixtos",
    descripcion:
      "Replica el índice Bloomberg US Aggregate Bond, una canasta amplia de bonos de grado de inversión de EE. UU. — del Tesoro, agencias gubernamentales, corporativos e hipotecarios — de distintos plazos. Es la referencia estándar para \"el mercado de bonos de EE. UU.\" en su conjunto.",
  },
  TLT: {
    nombre: "iShares 20+ Year Treasury Bond ETF",
    tipo: "ETF",
    sector: "Renta fija — EE. UU., Tesoro, largo plazo",
    descripcion:
      "Contiene bonos del Tesoro de EE. UU. con vencimiento a 20 años o más. Por su duración larga, es muy sensible a cambios en las tasas de interés: su precio sube cuando las tasas bajan y cae cuando las tasas suben, de forma más pronunciada que bonos de corto plazo.",
  },
  IJH: {
    nombre: "iShares Core S&P Mid-Cap ETF",
    tipo: "ETF",
    sector: "Índice accionario — EE. UU., mediana capitalización",
    descripcion:
      "Replica el S&P MidCap 400, empresas medianas de EE. UU. — más grandes y establecidas que las small-caps, pero con más espacio de crecimiento que las mega-caps del S&P 500. Suele quedar fuera del radar de la mayoría de los inversionistas individuales, que tienden a concentrarse en gran o pequeña capitalización.",
  },
  IJR: {
    nombre: "iShares Core S&P Small-Cap ETF",
    tipo: "ETF",
    sector: "Índice accionario — EE. UU., pequeña capitalización",
    descripcion:
      "Replica el S&P SmallCap 600, empresas pequeñas de EE. UU. que cumplen criterios de rentabilidad para entrar al índice (a diferencia del Russell 2000, que no filtra por utilidades) — una diferencia metodológica real entre los dos índices de small-cap más usados.",
  },
  VNQ: {
    nombre: "Vanguard Real Estate ETF",
    tipo: "ETF",
    sector: "Bienes raíces — EE. UU. (REITs)",
    descripcion:
      "Invierte en REITs (Real Estate Investment Trusts) de EE. UU.: empresas que poseen y operan propiedades generadoras de renta (oficinas, centros comerciales, almacenes, torres de telecomunicaciones, centros de datos) y están legalmente obligadas a distribuir la mayoría de sus utilidades como dividendos. Es una forma de exposición a bienes raíces sin comprar una propiedad física.",
  },
  GLD: {
    nombre: "SPDR Gold Shares",
    tipo: "ETF",
    sector: "Materia prima — metales preciosos",
    descripcion:
      "Cada participación representa una fracción de oro físico almacenado en bóvedas (principalmente en Londres), administrado por World Gold Council. Es la forma más líquida de tener exposición al precio del oro sin comprar el metal físico directamente.",
  },
  EEM: {
    nombre: "iShares MSCI Emerging Markets ETF",
    tipo: "ETF",
    sector: "Índice accionario internacional — mercados emergentes",
    descripcion:
      "Similar a VWO (mercados emergentes), pero sigue la metodología del índice MSCI en vez de FTSE — las dos metodologías clasifican algunos países de forma distinta (ej. Corea del Sur es \"emergente\" para MSCI pero \"desarrollado\" para FTSE), lo que produce composiciones ligeramente diferentes entre ambos fondos.",
  },
  EWJ: {
    nombre: "iShares MSCI Japan ETF",
    tipo: "ETF",
    sector: "Índice accionario internacional — Japón",
    descripcion:
      "Replica el mercado accionario de Japón, la tercera economía más grande del mundo por PIB nominal. Su desempeño está fuertemente influido por la política monetaria del Banco de Japón y el tipo de cambio yen-dólar, dado el peso exportador de muchas de sus empresas grandes.",
  },
  FXI: {
    nombre: "iShares China Large-Cap ETF",
    tipo: "ETF",
    sector: "Índice accionario internacional — China",
    descripcion:
      "Replica las 50 empresas chinas más grandes que cotizan en Hong Kong (vía el índice FTSE China 50), con fuerte peso en finanzas y tecnología. Está sujeto a riesgos propios del mercado chino: intervención regulatoria directa del gobierno, restricciones a inversión extranjera y menor transparencia contable que en mercados desarrollados.",
  },
  SHY: {
    nombre: "iShares 1-3 Year Treasury Bond ETF",
    tipo: "ETF",
    sector: "Renta fija — EE. UU., Tesoro, corto plazo",
    descripcion:
      "Contiene bonos del Tesoro de EE. UU. de 1 a 3 años. Es el extremo opuesto a TLT en duración: mucho menos sensible a cambios en tasas de interés, se usa típicamente como un lugar \"casi-cash\" de bajo riesgo dentro de un portafolio, no como apuesta direccional sobre tasas.",
  },
  LQD: {
    nombre: "iShares iBoxx Investment Grade Corporate Bond ETF",
    tipo: "ETF",
    sector: "Renta fija — EE. UU., corporativo, grado de inversión",
    descripcion:
      "Bonos emitidos por empresas con calificación crediticia de grado de inversión (BBB- o superior) — deuda corporativa considerada de bajo riesgo de impago relativo, a cambio de un rendimiento mayor que los bonos del Tesoro equivalentes.",
  },
  HYG: {
    nombre: "iShares iBoxx High Yield Corporate Bond ETF",
    tipo: "ETF",
    sector: "Renta fija — EE. UU., corporativo, alto rendimiento",
    descripcion:
      "Bonos corporativos con calificación por debajo de grado de inversión (\"high yield\" o \"junk bonds\") — mayor riesgo de impago a cambio de un cupón más alto. Suele comportarse de forma más parecida a las acciones que los bonos de grado de inversión, especialmente en episodios de estrés económico.",
  },
  DBC: {
    nombre: "Invesco DB Commodity Index Tracking Fund",
    tipo: "ETF",
    sector: "Materias primas — canasta diversificada",
    descripcion:
      "Sigue un índice de futuros de una canasta de commodities: energía (petróleo, gasolina), metales (oro, aluminio, zinc) y agricultura (maíz, trigo, soya, azúcar). A diferencia de GLD o SLV (un solo metal físico), DBC está diversificado entre varias materias primas vía contratos de futuros, no posesión física.",
  },
  VNQI: {
    nombre: "Vanguard Global ex-U.S. Real Estate ETF",
    tipo: "ETF",
    sector: "Bienes raíces internacionales (ex-EE. UU.)",
    descripcion:
      "Igual que VNQ pero fuera de EE. UU.: REITs y empresas inmobiliarias de mercados desarrollados y emergentes (Japón, Reino Unido, Australia, Hong Kong, entre otros) — diversificación del riesgo inmobiliario fuera del mercado estadounidense.",
  },
  SCZ: {
    nombre: "iShares MSCI EAFE Small-Cap ETF",
    tipo: "ETF",
    sector: "Índice accionario internacional — pequeña capitalización",
    descripcion:
      "Empresas pequeñas de mercados desarrollados fuera de EE. UU. y Canadá (la versión small-cap del universo que cubre EFA) — menos conocidas y más volátiles que las grandes multinacionales europeas o japonesas típicas de EFA.",
  },
  MUB: {
    nombre: "iShares National Muni Bond ETF",
    tipo: "ETF",
    sector: "Renta fija — EE. UU., municipal",
    descripcion:
      "Bonos emitidos por gobiernos estatales y locales de EE. UU. (municipal bonds), usados típicamente para financiar infraestructura pública. Su atractivo principal es fiscal: los intereses suelen estar exentos de impuesto federal sobre la renta en EE. UU. (y a veces también estatal), aunque ese beneficio fiscal es específico de contribuyentes estadounidenses.",
  },
  EMB: {
    nombre: "iShares J.P. Morgan USD Emerging Markets Bond ETF",
    tipo: "ETF",
    sector: "Renta fija internacional — deuda soberana emergente",
    descripcion:
      "Bonos de deuda pública emitidos por gobiernos de países emergentes, pero denominados en dólares (no en la moneda local del país emisor) — elimina el riesgo cambiario directo de la moneda local, aunque conserva el riesgo de crédito soberano de cada país.",
  },
  SLV: {
    nombre: "iShares Silver Trust",
    tipo: "ETF",
    sector: "Materia prima — metales preciosos",
    descripcion:
      "Cada participación representa una fracción de plata física almacenada en bóvedas. La plata tiene tanto demanda de inversión (como el oro) como demanda industrial (electrónica, paneles solares), lo que la hace más volátil que el oro — reacciona tanto a flujos de refugio de valor como al ciclo industrial.",
  },
  USO: {
    nombre: "United States Oil Fund",
    tipo: "ETF",
    sector: "Materia prima — energía",
    descripcion:
      "Sigue el precio del petróleo crudo WTI (West Texas Intermediate) mediante contratos de futuros, que se renuevan (\"roll\") periódicamente antes de su vencimiento — no almacena petróleo físico. Ese mecanismo de renovación de futuros puede hacer que el rendimiento de USO se desvíe del movimiento spot del petróleo en el tiempo (un efecto conocido como \"contango\"/\"backwardation\").",
  },

  // --- ETFs sectoriales (Mediano Plazo) ---
  XLK: {
    nombre: "Technology Select Sector SPDR Fund",
    tipo: "ETF",
    sector: "Sectorial — tecnología",
    descripcion:
      "Las empresas del S&P 500 clasificadas en el sector tecnológico (hardware, software, semiconductores, servicios de TI). Suele estar fuertemente concentrado en las mega-caps tecnológicas más grandes del índice.",
  },
  XLF: {
    nombre: "Financial Select Sector SPDR Fund",
    tipo: "ETF",
    sector: "Sectorial — financiero",
    descripcion:
      "Las empresas del S&P 500 del sector financiero: grandes bancos, aseguradoras, bolsas de valores y gestoras de activos. Es sensible a cambios en tasas de interés (afecta el margen de los bancos) y a la salud del ciclo crediticio.",
  },
  XLE: {
    nombre: "Energy Select Sector SPDR Fund",
    tipo: "ETF",
    sector: "Sectorial — energía",
    descripcion:
      "Las empresas del S&P 500 del sector energético: principalmente petroleras integradas y de exploración/producción. Su desempeño está muy correlacionado con el precio del petróleo y el gas natural, más que con las condiciones generales del mercado accionario.",
  },
  XLV: {
    nombre: "Health Care Select Sector SPDR Fund",
    tipo: "ETF",
    sector: "Sectorial — salud",
    descripcion:
      "Las empresas del S&P 500 del sector salud: farmacéuticas, biotecnología, equipo médico, aseguradoras de salud y proveedores de servicios médicos. Suele considerarse un sector defensivo — la demanda de salud es menos sensible al ciclo económico que otros sectores.",
  },
  XLI: {
    nombre: "Industrial Select Sector SPDR Fund",
    tipo: "ETF",
    sector: "Sectorial — industrial",
    descripcion:
      "Las empresas del S&P 500 del sector industrial: manufactura, maquinaria, transporte, aeroespacial y defensa. Suele ser sensible al ciclo económico (inversión de capital de las empresas, actividad manufacturera, comercio global).",
  },
  XLY: {
    nombre: "Consumer Discretionary Select Sector SPDR Fund",
    tipo: "ETF",
    sector: "Sectorial — consumo discrecional",
    descripcion:
      "Empresas de bienes y servicios no esenciales: retail, automóviles, restaurantes, hoteles, entretenimiento. Su demanda es más sensible al ciclo económico y al ingreso disponible de los consumidores que el consumo básico.",
  },
  XLP: {
    nombre: "Consumer Staples Select Sector SPDR Fund",
    tipo: "ETF",
    sector: "Sectorial — consumo básico",
    descripcion:
      "Empresas de productos esenciales: alimentos, bebidas, higiene personal y productos del hogar. Considerado un sector defensivo clásico — la gente sigue comprando estos productos incluso en recesión, lo que suele traducirse en menor volatilidad relativa.",
  },

  // --- Mega-caps tecnológicas ---
  AAPL: {
    nombre: "Apple Inc.",
    tipo: "Acción",
    sector: "Tecnología — hardware y servicios de consumo",
    descripcion:
      "Diseña y vende dispositivos electrónicos de consumo (iPhone, Mac, iPad, Apple Watch) y opera un ecosistema de servicios digitales (App Store, iCloud, Apple Music, Apple Pay) que genera ingresos recurrentes además de la venta de hardware. El iPhone sigue siendo, por un amplio margen, su mayor fuente de ingresos.",
  },
  MSFT: {
    nombre: "Microsoft Corp.",
    tipo: "Acción",
    sector: "Tecnología — software y nube",
    descripcion:
      "Negocio dividido principalmente en tres pilares: software de productividad y sistemas operativos (Windows, Office/Microsoft 365), cómputo en la nube (Azure, uno de los dos o tres proveedores de nube más grandes del mundo) e inversión fuerte en inteligencia artificial (incluida su relación con OpenAI).",
  },
  NVDA: {
    nombre: "NVIDIA Corp.",
    tipo: "Acción",
    sector: "Semiconductores — cómputo gráfico y acelerado",
    descripcion:
      "Diseña chips gráficos (GPU), originalmente para videojuegos, que se convirtieron en el estándar de facto para entrenar e inferir modelos de inteligencia artificial a gran escala. Su división de centros de datos (GPU para IA) superó por mucho a su negocio original de videojuegos como fuente de ingresos.",
  },
  AMZN: {
    nombre: "Amazon.com Inc.",
    tipo: "Acción",
    sector: "Comercio electrónico y cómputo en la nube",
    descripcion:
      "Empezó como librería en línea y se expandió a comercio electrónico general, logística propia, y — vía Amazon Web Services (AWS) — se convirtió en el proveedor de cómputo en la nube más grande del mundo. AWS, aunque es una fracción menor de sus ingresos totales, históricamente ha aportado la mayor parte de su utilidad operativa.",
  },
  GOOGL: {
    nombre: "Alphabet Inc. (Google)",
    tipo: "Acción",
    sector: "Tecnología — búsqueda, publicidad digital y nube",
    descripcion:
      "La matriz de Google: motor de búsqueda dominante, YouTube, el sistema operativo Android, y Google Cloud (cómputo en la nube). La gran mayoría de sus ingresos todavía viene de publicidad digital, principalmente ligada a resultados de búsqueda.",
  },
  META: {
    nombre: "Meta Platforms Inc.",
    tipo: "Acción",
    sector: "Tecnología — redes sociales y publicidad digital",
    descripcion:
      "Opera Facebook, Instagram y WhatsApp, y monetiza esas plataformas casi en su totalidad vía publicidad digital dirigida. También invierte fuertemente en realidad aumentada/virtual (Reality Labs) y en infraestructura propia de inteligencia artificial, aunque esas apuestas todavía no son una fuente significativa de ingresos.",
  },
  AVGO: {
    nombre: "Broadcom Inc.",
    tipo: "Acción",
    sector: "Semiconductores e infraestructura de software",
    descripcion:
      "Diseña semiconductores para redes, almacenamiento, banda ancha y componentes inalámbricos (usados, entre otros, en iPhones), y además posee un negocio grande de software empresarial (VMware, adquirida en 2023) — una combinación poco común de hardware de chips y software de infraestructura bajo la misma empresa.",
  },
  CRM: {
    nombre: "Salesforce Inc.",
    tipo: "Acción",
    sector: "Software empresarial — gestión de clientes (CRM)",
    descripcion:
      "Pionero del modelo de software como servicio (SaaS): su producto principal ayuda a empresas a gestionar ventas, atención al cliente y marketing desde la nube, sin instalar software localmente. Ha crecido también vía adquisiciones (Slack, Tableau, MuleSoft) para ampliar su plataforma más allá del CRM original.",
  },
  ADBE: {
    nombre: "Adobe Inc.",
    tipo: "Acción",
    sector: "Software — creatividad y documentos digitales",
    descripcion:
      "Dueño de las herramientas de diseño creativo más usadas de la industria (Photoshop, Illustrator, Premiere Pro), agrupadas en una suscripción (Creative Cloud) — migró de vender licencias de software a un modelo de ingresos recurrentes hace más de una década. También posee Acrobat/PDF y herramientas de marketing digital.",
  },
  ORCL: {
    nombre: "Oracle Corp.",
    tipo: "Acción",
    sector: "Software empresarial — bases de datos y nube",
    descripcion:
      "Históricamente conocida por su base de datos relacional empresarial (el estándar de facto en muchas corporaciones grandes durante décadas), ha estado invirtiendo fuertemente en expandir su negocio de infraestructura en la nube (Oracle Cloud Infrastructure) para competir con AWS, Azure y Google Cloud.",
  },
  CSCO: {
    nombre: "Cisco Systems Inc.",
    tipo: "Acción",
    sector: "Tecnología — redes y telecomunicaciones",
    descripcion:
      "Fabrica el equipo de red (routers, switches) que forma gran parte de la infraestructura de internet y de redes corporativas a nivel mundial. En años recientes ha diversificado hacia ciberseguridad y software, además de su negocio tradicional de hardware de redes.",
  },
  INTC: {
    nombre: "Intel Corp.",
    tipo: "Acción",
    sector: "Semiconductores — diseño y manufactura",
    descripcion:
      "Diseña y, a diferencia de la mayoría de sus competidores (que solo diseñan y subcontratan la manufactura), también fabrica sus propios procesadores en plantas propias — un modelo integrado verticalmente que la distingue de diseñadores \"fabless\" como AMD o Nvidia. Ha perdido participación de mercado frente a competidores en los últimos años.",
  },
  AMD: {
    nombre: "Advanced Micro Devices Inc.",
    tipo: "Acción",
    sector: "Semiconductores — procesadores y gráficos",
    descripcion:
      "Diseña procesadores centrales (CPU) y chips gráficos (GPU), compitiendo directamente con Intel en CPU y con Nvidia en GPU para IA/centros de datos. A diferencia de Intel, no fabrica sus propios chips — subcontrata la manufactura, principalmente con TSMC.",
  },
  QCOM: {
    nombre: "Qualcomm Inc.",
    tipo: "Acción",
    sector: "Semiconductores — telefonía móvil",
    descripcion:
      "Diseña los procesadores (Snapdragon) y módems que permiten la conectividad móvil (4G/5G) en la mayoría de los teléfonos Android del mundo. Además de vender chips, cobra licencias de patentes esenciales de telefonía móvil a fabricantes de dispositivos — una fuente de ingresos significativa y, a veces, fuente de disputas legales.",
  },
  TXN: {
    nombre: "Texas Instruments Inc.",
    tipo: "Acción",
    sector: "Semiconductores — analógicos y embebidos",
    descripcion:
      "A diferencia de los chips de cómputo de alto perfil (CPU/GPU), se especializa en semiconductores analógicos y embebidos — componentes menos visibles pero presentes en una enormidad de productos industriales, automotrices y de consumo (gestión de energía, sensores, conversión de señal).",
  },
  IBM: {
    nombre: "International Business Machines Corp.",
    tipo: "Acción",
    sector: "Tecnología — cómputo empresarial y consultoría",
    descripcion:
      "Una de las empresas de tecnología más antiguas de EE. UU. (fundada en 1911), hoy enfocada en cómputo híbrido en la nube (vía la adquisición de Red Hat), consultoría de TI e inteligencia artificial empresarial (Watson) — se reposicionó varias veces en su historia conforme la industria cambió.",
  },

  // --- Financiero ---
  JPM: {
    nombre: "JPMorgan Chase & Co.",
    tipo: "Acción",
    sector: "Banca",
    descripcion:
      "El banco más grande de EE. UU. por activos totales, con operaciones de banca comercial (depósitos, préstamos), banca de inversión (fusiones, adquisiciones, suscripción de valores) y gestión de activos. Su desempeño se vigila como termómetro general de la salud del sistema financiero de EE. UU.",
  },
  BAC: {
    nombre: "Bank of America Corp.",
    tipo: "Acción",
    sector: "Banca",
    descripcion:
      "Uno de los bancos más grandes de EE. UU. por activos, con fuerte presencia en banca minorista (cuentas de consumo, tarjetas) además de banca de inversión y gestión de patrimonio (vía Merrill Lynch).",
  },
  WFC: {
    nombre: "Wells Fargo & Co.",
    tipo: "Acción",
    sector: "Banca",
    descripcion:
      "Banco comercial grande de EE. UU., históricamente fuerte en hipotecas y banca minorista. Estuvo bajo un límite regulatorio de crecimiento de activos impuesto por la Reserva Federal desde 2018 por fallas de control interno, levantado en 2025.",
  },
  GS: {
    nombre: "Goldman Sachs Group Inc.",
    tipo: "Acción",
    sector: "Banca de inversión",
    descripcion:
      "Uno de los bancos de inversión más grandes del mundo: asesoría en fusiones y adquisiciones, suscripción de ofertas de acciones y bonos, trading por cuenta propia y gestión de activos para clientes institucionales y de alto patrimonio.",
  },
  MS: {
    nombre: "Morgan Stanley",
    tipo: "Acción",
    sector: "Banca de inversión y gestión de patrimonio",
    descripcion:
      "Banco de inversión global con un negocio grande de gestión de patrimonio para inversionistas individuales (reforzado por la adquisición de E*Trade en 2020), además de sus líneas tradicionales de banca de inversión y trading institucional.",
  },
  C: {
    nombre: "Citigroup Inc.",
    tipo: "Acción",
    sector: "Banca global",
    descripcion:
      "Banco con presencia operativa en más países que la mayoría de sus pares de EE. UU., con negocios de banca de consumo, banca institucional y servicios de tesorería/transacciones para empresas multinacionales.",
  },
  AXP: {
    nombre: "American Express Co.",
    tipo: "Acción",
    sector: "Pagos y servicios financieros",
    descripcion:
      "A diferencia de Visa o Mastercard (que solo procesan pagos para bancos emisores), American Express emite sus propias tarjetas directamente a los consumidores — es banco emisor y red de pagos al mismo tiempo, un modelo de negocio distinto conocido como \"closed-loop\".",
  },
  V: {
    nombre: "Visa Inc.",
    tipo: "Acción",
    sector: "Pagos — red de procesamiento",
    descripcion:
      "Opera la red que conecta bancos emisores de tarjetas, comercios y bancos adquirentes para procesar pagos electrónicos a nivel global — no presta dinero ni emite tarjetas directamente, cobra una comisión por cada transacción que pasa por su red.",
  },
  MA: {
    nombre: "Mastercard Inc.",
    tipo: "Acción",
    sector: "Pagos — red de procesamiento",
    descripcion:
      "Modelo de negocio prácticamente idéntico al de Visa: opera la red de procesamiento de pagos, sin emitir tarjetas ni prestar dinero directamente, cobrando comisiones por transacción. Las dos compañías dominan juntas la gran mayoría del procesamiento de pagos con tarjeta a nivel mundial.",
  },
  PYPL: {
    nombre: "PayPal Holdings Inc.",
    tipo: "Acción",
    sector: "Fintech — pagos digitales",
    descripcion:
      "Plataforma de pagos digitales que permite enviar y recibir dinero en línea, incluyendo Venmo (su producto de pagos entre personas más popular en EE. UU.) — compite tanto con redes de tarjetas tradicionales como con fintechs más nuevas de pagos.",
  },

  // --- Energía, industrial, materiales ---
  XOM: {
    nombre: "Exxon Mobil Corp.",
    tipo: "Acción",
    sector: "Petróleo y gas — integrado",
    descripcion:
      "Una de las petroleras \"integradas\" más grandes del mundo: participa en toda la cadena, desde exploración y producción (upstream) hasta refinación y venta de productos derivados (downstream), además de una división química grande.",
  },
  CVX: {
    nombre: "Chevron Corp.",
    tipo: "Acción",
    sector: "Petróleo y gas — integrado",
    descripcion:
      "Petrolera integrada de EE. UU. con operaciones de exploración, producción, refinación y distribución de petróleo y gas a nivel global, competidora directa de Exxon Mobil en escala y modelo de negocio.",
  },
  CAT: {
    nombre: "Caterpillar Inc.",
    tipo: "Acción",
    sector: "Maquinaria pesada",
    descripcion:
      "Fabricante líder de maquinaria para construcción, minería y manejo de materiales (excavadoras, tractores, motores diésel) — su demanda está ligada de cerca al ciclo de inversión en infraestructura y construcción a nivel global.",
  },
  BA: {
    nombre: "Boeing Co.",
    tipo: "Acción",
    sector: "Aeroespacial y defensa",
    descripcion:
      "Uno de los dos grandes fabricantes mundiales de aviones comerciales (junto con Airbus), con una división adicional de defensa y seguridad (aviones militares, sistemas espaciales) para el gobierno de EE. UU. y aliados.",
  },
  HON: {
    nombre: "Honeywell International Inc.",
    tipo: "Acción",
    sector: "Conglomerado industrial",
    descripcion:
      "Conglomerado diversificado con negocios en aeroespacial (componentes de aviación), automatización industrial de edificios y fábricas, y materiales/tecnologías especializadas — un modelo de negocio de múltiples divisiones poco relacionadas entre sí.",
  },
  MMM: {
    nombre: "3M Co.",
    tipo: "Acción",
    sector: "Conglomerado industrial diversificado",
    descripcion:
      "Fabricante de miles de productos industriales y de consumo (desde cinta adhesiva y notas Post-it hasta equipo de seguridad y materiales para electrónica) — conocido por su historial de innovación interna constante en productos cotidianos.",
  },
  LMT: {
    nombre: "Lockheed Martin Corp.",
    tipo: "Acción",
    sector: "Defensa y aeroespacial",
    descripcion:
      "El mayor contratista de defensa de EE. UU. por ingresos, fabricante del caza F-35 (el programa de armamento más caro de la historia de EE. UU.) y de sistemas de misiles, aeronaves militares y tecnología espacial — la mayoría de sus ingresos viene de contratos con el gobierno de EE. UU.",
  },
  RTX: {
    nombre: "RTX Corp. (Raytheon Technologies)",
    tipo: "Acción",
    sector: "Defensa y aeroespacial",
    descripcion:
      "Resultado de la fusión entre Raytheon y United Technologies (2020): combina sistemas de defensa y misiles (Raytheon) con motores de aviación comercial (Pratt & Whitney) y sistemas aeroespaciales (Collins Aerospace) — expuesto tanto a aviación comercial como a gasto militar.",
  },
  DE: {
    nombre: "Deere & Co.",
    tipo: "Acción",
    sector: "Maquinaria agrícola y de construcción",
    descripcion:
      "Fabricante líder de maquinaria agrícola (tractores, cosechadoras) bajo la marca John Deere, con una división adicional de equipo de construcción y forestal — su demanda está ligada al ciclo de precios agrícolas y al ingreso de los productores.",
  },
  EMR: {
    nombre: "Emerson Electric Co.",
    tipo: "Acción",
    sector: "Automatización industrial",
    descripcion:
      "Provee tecnología de automatización y control para plantas industriales (energía, químicos, manufactura) — sensores, software y sistemas de control que ayudan a operar procesos industriales complejos de forma más eficiente.",
  },
  ETN: {
    nombre: "Eaton Corp.",
    tipo: "Acción",
    sector: "Gestión de energía eléctrica",
    descripcion:
      "Fabrica componentes y sistemas para la gestión y distribución de energía eléctrica e hidráulica — desde infraestructura de red eléctrica hasta sistemas de respaldo de energía para centros de datos, un segmento que ha crecido con la demanda de infraestructura de IA.",
  },
  GE: {
    nombre: "General Electric Co.",
    tipo: "Acción",
    sector: "Aviación y energía",
    descripcion:
      "Tras años como conglomerado muy diversificado, se dividió en empresas independientes (GE Aerospace, GE Vernova para energía, GE HealthCare) — el ticker GE hoy corresponde a GE Aerospace, enfocado en motores de aviación comercial y militar.",
  },

  // --- Salud ---
  JNJ: {
    nombre: "Johnson & Johnson",
    tipo: "Acción",
    sector: "Farmacéutica y salud de consumo",
    descripcion:
      "Una de las farmacéuticas más grandes del mundo, con negocios en medicamentos de prescripción, dispositivos médicos (tras separar su división de productos de consumo —curitas, Tylenol— en una empresa aparte, Kenvue, en 2023).",
  },
  LLY: {
    nombre: "Eli Lilly and Co.",
    tipo: "Acción",
    sector: "Farmacéutica",
    descripcion:
      "Farmacéutica enfocada en diabetes, obesidad, oncología e inmunología — ganó relevancia reciente de forma notable por sus medicamentos para pérdida de peso basados en agonistas GLP-1, una categoría de alto crecimiento en la industria.",
  },
  UNH: {
    nombre: "UnitedHealth Group Inc.",
    tipo: "Acción",
    sector: "Seguros y servicios de salud",
    descripcion:
      "La aseguradora de salud más grande de EE. UU. por ingresos, con dos negocios principales: UnitedHealthcare (seguros médicos) y Optum (servicios de salud, farmacia y datos/tecnología para el sector salud).",
  },
  MRK: {
    nombre: "Merck & Co.",
    tipo: "Acción",
    sector: "Farmacéutica",
    descripcion:
      "Farmacéutica con fuerte presencia en oncología (su medicamento Keytruda es uno de los más vendidos del mundo), vacunas y salud animal — conocida fuera de EE. UU. y Canadá como MSD.",
  },
  ABBV: {
    nombre: "AbbVie Inc.",
    tipo: "Acción",
    sector: "Farmacéutica",
    descripcion:
      "Farmacéutica enfocada en inmunología (incluyendo el histórico medicamento Humira, antes de perder exclusividad de patente) y oncología — se separó de Abbott Laboratories en 2013 como empresa independiente.",
  },
  PFE: {
    nombre: "Pfizer Inc.",
    tipo: "Acción",
    sector: "Farmacéutica",
    descripcion:
      "Una de las farmacéuticas más grandes del mundo, con un portafolio amplio en vacunas, oncología y enfermedades raras — ganó visibilidad masiva por su vacuna contra covid-19 desarrollada junto con BioNTech, cuyos ingresos extraordinarios se normalizaron después de la fase aguda de la pandemia.",
  },
  TMO: {
    nombre: "Thermo Fisher Scientific Inc.",
    tipo: "Acción",
    sector: "Instrumentos y servicios científicos",
    descripcion:
      "No fabrica medicamentos: provee el equipo de laboratorio, reactivos e instrumentos científicos que usan farmacéuticas, universidades y laboratorios de diagnóstico para investigar y producir — un proveedor de \"picos y palas\" para toda la industria de ciencias de la vida.",
  },
  ABT: {
    nombre: "Abbott Laboratories",
    tipo: "Acción",
    sector: "Dispositivos médicos y diagnósticos",
    descripcion:
      "Diversificado entre dispositivos médicos (monitoreo de glucosa, cardiovascular), diagnósticos, nutrición (incluyendo fórmula infantil) y medicamentos genéricos de marca en mercados emergentes — separó su negocio farmacéutico de investigación en AbbVie en 2013.",
  },

  // --- Consumo ---
  PG: {
    nombre: "Procter & Gamble Co.",
    tipo: "Acción",
    sector: "Bienes de consumo — higiene y cuidado personal",
    descripcion:
      "Una de las empresas de bienes de consumo más grandes del mundo, dueña de decenas de marcas (Gillette, Pampers, Tide, Pantene, Crest) vendidas en más de 180 países — un portafolio de marcas, no un solo producto.",
  },
  KO: {
    nombre: "Coca-Cola Co.",
    tipo: "Acción",
    sector: "Bebidas",
    descripcion:
      "La empresa de bebidas no alcohólicas más grande del mundo por volumen, con cientos de marcas (Coca-Cola, Sprite, Fanta, Fuze Tea, Powerade, entre muchas otras) distribuidas globalmente a través de un sistema de embotelladoras independientes con licencia de la marca, no plantas propias en su mayoría.",
  },
  PEP: {
    nombre: "PepsiCo Inc.",
    tipo: "Acción",
    sector: "Bebidas y alimentos",
    descripcion:
      "A diferencia de Coca-Cola (enfocada casi exclusivamente en bebidas), PepsiCo combina un negocio grande de bebidas (Pepsi, Gatorade) con uno de botanas saladas igual de grande (Frito-Lay: Lay's, Doritos, Cheetos) — un modelo de negocio diversificado entre dos categorías distintas.",
  },
  WMT: {
    nombre: "Walmart Inc.",
    tipo: "Acción",
    sector: "Retail",
    descripcion:
      "La mayor cadena de tiendas de autoservicio del mundo por ingresos, con un modelo histórico de precios bajos por volumen y escala — en los últimos años ha invertido fuertemente en comercio electrónico y publicidad digital propia para competir con Amazon.",
  },
  COST: {
    nombre: "Costco Wholesale Corp.",
    tipo: "Acción",
    sector: "Retail de membresía",
    descripcion:
      "Cadena de tiendas al mayoreo que opera bajo un modelo de membresía anual: cobra a sus miembros una cuota fija de acceso y vende productos a volumen con márgenes muy bajos — una parte significativa de su utilidad viene de las cuotas de membresía, no de la venta de mercancía en sí.",
  },
  HD: {
    nombre: "Home Depot Inc.",
    tipo: "Acción",
    sector: "Retail — mejoras para el hogar",
    descripcion:
      "La cadena de tiendas de mejoras para el hogar más grande de EE. UU., con clientes tanto consumidores individuales (proyectos de bricolaje) como contratistas profesionales — este último segmento (Pro) ha sido un foco de crecimiento reciente.",
  },
  LOW: {
    nombre: "Lowe's Companies Inc.",
    tipo: "Acción",
    sector: "Retail — mejoras para el hogar",
    descripcion:
      "Segunda cadena más grande de mejoras para el hogar en EE. UU., compitiendo directamente con Home Depot con un modelo de negocio prácticamente idéntico — tiendas grandes de formato \"big box\" orientadas a materiales de construcción y reparación.",
  },
  TJX: {
    nombre: "TJX Companies Inc.",
    tipo: "Acción",
    sector: "Retail de descuento (off-price)",
    descripcion:
      "Opera cadenas de retail \"off-price\" (TJ Maxx, Marshalls, HomeGoods): compra inventario de marca a precios reducidos (excedentes, cancelaciones de pedido, fin de temporada) y lo revende con descuento — un modelo de negocio distinto al retail tradicional de precio fijo.",
  },
  UPS: {
    nombre: "United Parcel Service Inc.",
    tipo: "Acción",
    sector: "Paquetería y logística",
    descripcion:
      "Una de las dos grandes empresas de paquetería de EE. UU. (junto con FedEx), con una red logística global de entrega de paquetes — su volumen está fuertemente ligado al comercio electrónico y al comercio internacional.",
  },
  MCD: {
    nombre: "McDonald's Corp.",
    tipo: "Acción",
    sector: "Restaurantes — comida rápida",
    descripcion:
      "La cadena de comida rápida más grande del mundo por número de ubicaciones, operada mayoritariamente bajo un modelo de franquicias (no es dueña de la mayoría de sus restaurantes) — una parte significativa de sus ingresos viene de rentas y regalías de franquiciatarios, no solo de venta de comida.",
  },
  SBUX: {
    nombre: "Starbucks Corp.",
    tipo: "Acción",
    sector: "Restaurantes — cafeterías",
    descripcion:
      "La cadena de cafeterías más grande del mundo, con un modelo que combina tiendas propias y franquiciadas/con licencia según el mercado — su programa de lealtad y app de pedidos son un componente clave de cómo captura ventas recurrentes.",
  },
  NKE: {
    nombre: "Nike Inc.",
    tipo: "Acción",
    sector: "Calzado y ropa deportiva",
    descripcion:
      "La marca de calzado y ropa deportiva más grande del mundo por ingresos — diseña y comercializa sus productos pero subcontrata casi toda su manufactura a fábricas independientes, principalmente en Asia, un modelo de negocio \"asset-light\" común en la industria de moda/calzado.",
  },
  DIS: {
    nombre: "Walt Disney Co.",
    tipo: "Acción",
    sector: "Medios y entretenimiento",
    descripcion:
      "Conglomerado de entretenimiento con estudios de cine (Disney, Pixar, Marvel, Lucasfilm), parques temáticos y cruceros, y streaming (Disney+) — ha estado en transición de un modelo de TV por cable tradicional hacia streaming directo al consumidor.",
  },
  NFLX: {
    nombre: "Netflix Inc.",
    tipo: "Acción",
    sector: "Streaming de video",
    descripcion:
      "Pionero del streaming por suscripción, hoy compite con Disney+, Amazon Prime Video, Max y otros — a diferencia de Disney, no tiene parques ni negocio de TV tradicional: su negocio es casi exclusivamente contenido de streaming, producido internamente o licenciado.",
  },

  // --- Telecom, utilities ---
  T: {
    nombre: "AT&T Inc.",
    tipo: "Acción",
    sector: "Telecomunicaciones",
    descripcion:
      "Una de las dos grandes operadoras de telecomunicaciones de EE. UU. (junto con Verizon): servicio móvil, internet de banda ancha y fibra óptica — se desprendió de su negocio de medios (WarnerMedia, hoy parte de Warner Bros. Discovery) en 2022 para enfocarse de nuevo en telecomunicaciones.",
  },
  VZ: {
    nombre: "Verizon Communications Inc.",
    tipo: "Acción",
    sector: "Telecomunicaciones",
    descripcion:
      "La otra gran operadora de telecomunicaciones de EE. UU., con la red móvil de mayor cobertura del país según mediciones históricas de terceros — compite con AT&T y T-Mobile en servicio móvil e internet fijo.",
  },
  SO: {
    nombre: "Southern Co.",
    tipo: "Acción",
    sector: "Eléctrica regulada (utility)",
    descripcion:
      "Empresa de servicios eléctricos que opera bajo un marco regulado en el sureste de EE. UU. (principalmente Georgia y Alabama) — como utility regulada, sus tarifas y retornos están sujetos a aprobación de reguladores estatales, lo que le da ingresos más predecibles que una empresa de mercado abierto.",
  },
  DUK: {
    nombre: "Duke Energy Corp.",
    tipo: "Acción",
    sector: "Eléctrica regulada (utility)",
    descripcion:
      "Una de las utilities eléctricas reguladas más grandes de EE. UU. por clientes, con operaciones principalmente en las Carolinas, Florida, Indiana, Ohio y Kentucky — mismo modelo de negocio regulado que Southern Co.",
  },
  NEE: {
    nombre: "NextEra Energy Inc.",
    tipo: "Acción",
    sector: "Eléctrica — regulada y renovable",
    descripcion:
      "Combina una utility regulada tradicional en Florida (Florida Power & Light) con el mayor generador de energía eólica y solar del mundo (NextEra Energy Resources) — una exposición más directa a la transición energética que las utilities puramente reguladas.",
  },

  // --- Riesgo Alto: fintech, consumo digital, software ---
  PLTR: {
    nombre: "Palantir Technologies Inc.",
    tipo: "Acción",
    sector: "Software — análisis de datos",
    descripcion:
      "Desarrolla software de análisis e integración de datos usado originalmente por agencias de inteligencia y defensa de EE. UU. (su primer gran cliente fue la CIA), expandido después a clientes comerciales grandes — se distingue de otras empresas de software por su origen y relación profunda con el gobierno de EE. UU.",
  },
  RIVN: {
    nombre: "Rivian Automotive Inc.",
    tipo: "Acción",
    sector: "Vehículos eléctricos",
    descripcion:
      "Fabricante de vehículos eléctricos enfocado en camionetas pickup y vans — tiene un contrato grande para fabricar vans eléctricas de reparto para Amazon, uno de sus primeros inversionistas e impulsores.",
  },
  SOFI: {
    nombre: "SoFi Technologies Inc.",
    tipo: "Acción",
    sector: "Fintech — banca digital",
    descripcion:
      "Empezó refinanciando préstamos estudiantiles y se expandió a banca digital completa: cuentas, tarjetas, préstamos personales e hipotecas, inversión — obtuvo una licencia bancaria nacional en EE. UU. en 2022, un paso que pocas fintechs han logrado.",
  },
  UPST: {
    nombre: "Upstart Holdings Inc.",
    tipo: "Acción",
    sector: "Fintech — originación de crédito con IA",
    descripcion:
      "Usa modelos de machine learning para evaluar el riesgo crediticio de solicitantes de préstamos, en vez de (o además de) los métodos tradicionales de buró de crédito — opera como intermediario entre solicitantes y bancos/inversionistas que fondean los préstamos, no presta capital propio en la mayoría de los casos.",
  },
  AFRM: {
    nombre: "Affirm Holdings Inc.",
    tipo: "Acción",
    sector: "Fintech — compra ahora, paga después",
    descripcion:
      "Ofrece financiamiento de \"compra ahora, paga después\" (BNPL) en el punto de venta, integrado con comercios en línea — una alternativa a tarjetas de crédito tradicionales para pagar compras en plazos, con términos transparentes de interés (o sin interés en algunos planes).",
  },
  DKNG: {
    nombre: "DraftKings Inc.",
    tipo: "Acción",
    sector: "Apuestas deportivas en línea",
    descripcion:
      "Plataforma de apuestas deportivas en línea y juegos de fantasía de pago, que creció rápidamente tras la legalización gradual de apuestas deportivas estado por estado en EE. UU. a partir de 2018 (cuando la Corte Suprema anuló la prohibición federal).",
  },
  CVNA: {
    nombre: "Carvana Co.",
    tipo: "Acción",
    sector: "Comercio electrónico de autos usados",
    descripcion:
      "Vende autos usados completamente en línea, con entrega a domicilio y sus característicos \"car vending machines\" (torres de cristal donde el cliente recoge su auto) — un modelo que busca reemplazar la experiencia tradicional del lote de autos usados.",
  },
  SMCI: {
    nombre: "Super Micro Computer Inc.",
    tipo: "Acción",
    sector: "Hardware — servidores",
    descripcion:
      "Fabrica servidores y sistemas de almacenamiento de alto rendimiento, con fuerte demanda reciente ligada a la construcción de centros de datos para inteligencia artificial — compite con fabricantes más grandes como Dell y HPE en ese nicho específico.",
  },
  IONQ: {
    nombre: "IonQ Inc.",
    tipo: "Acción",
    sector: "Cómputo cuántico",
    descripcion:
      "Desarrolla computadoras cuánticas basadas en tecnología de iones atrapados — una de varias empresas públicas que compiten en una industria todavía en etapa temprana de desarrollo comercial, sin aplicaciones comerciales masivas confirmadas todavía.",
  },
  CELH: {
    nombre: "Celsius Holdings Inc.",
    tipo: "Acción",
    sector: "Bebidas — energéticas",
    descripcion:
      "Fabrica bebidas energéticas posicionadas con un enfoque de \"fitness\"/bienestar (sin azúcar, con ingredientes marketeados como funcionales) — PepsiCo adquirió una participación minoritaria significativa y es su socio de distribución principal en EE. UU.",
  },
  ROKU: {
    nombre: "Roku Inc.",
    tipo: "Acción",
    sector: "Streaming — dispositivos y plataforma",
    descripcion:
      "Fabrica dispositivos de streaming (y licencia su sistema operativo a fabricantes de TVs) y opera una plataforma de descubrimiento de contenido — gran parte de su negocio no es vender los dispositivos en sí, sino la publicidad y los ingresos de plataforma que genera después.",
  },
  PINS: {
    nombre: "Pinterest Inc.",
    tipo: "Acción",
    sector: "Red social — descubrimiento visual",
    descripcion:
      "Red social orientada al descubrimiento de ideas e inspiración visual (decoración, moda, recetas) más que a la interacción social tradicional — monetiza principalmente vía publicidad digital, con fuerte intención de compra entre sus usuarios según la propia empresa.",
  },
  COIN: {
    nombre: "Coinbase Global Inc.",
    tipo: "Acción",
    sector: "Fintech — exchange de criptomonedas",
    descripcion:
      "Una de las plataformas más grandes de compra, venta y custodia de criptomonedas en EE. UU. — sus ingresos están fuertemente ligados al volumen de operación en cripto, que a su vez depende de la volatilidad y el apetito especulativo del mercado cripto.",
  },
  MARA: {
    nombre: "MARA Holdings Inc.",
    tipo: "Acción",
    sector: "Minería de Bitcoin",
    descripcion:
      "Opera centros de datos dedicados a \"minar\" Bitcoin (validar transacciones de la red a cambio de recompensas en Bitcoin) — su negocio depende tanto del precio de Bitcoin como del costo de la energía eléctrica que consume su operación de minería.",
  },
  RBLX: {
    nombre: "Roblox Corp.",
    tipo: "Acción",
    sector: "Videojuegos — plataforma generada por usuarios",
    descripcion:
      "Plataforma donde los usuarios crean y publican sus propios juegos y experiencias, muy popular entre audiencias jóvenes — monetiza vía una moneda virtual (Robux) que los usuarios compran y gastan dentro de experiencias creadas por otros usuarios.",
  },
  SNAP: {
    nombre: "Snap Inc.",
    tipo: "Acción",
    sector: "Red social — mensajería efímera",
    descripcion:
      "Dueño de Snapchat, conocida por popularizar los mensajes/historias que desaparecen después de verse — compite por atención y dólares publicitarios con Meta (Instagram) y TikTok, plataformas con bases de usuarios mucho más grandes.",
  },
  LYFT: {
    nombre: "Lyft Inc.",
    tipo: "Acción",
    sector: "Viajes compartidos (ride-hailing)",
    descripcion:
      "Plataforma de viajes compartidos que opera casi exclusivamente en EE. UU. y Canadá, a diferencia de Uber (su competidor principal), que tiene presencia global y negocios adicionales como entrega de comida.",
  },
  CHWY: {
    nombre: "Chewy Inc.",
    tipo: "Acción",
    sector: "Comercio electrónico — mascotas",
    descripcion:
      "Comercio electrónico especializado en productos para mascotas (alimento, medicamentos, accesorios), con un modelo de suscripción (Autoship) que genera ingresos recurrentes de compras repetidas, común en la categoría de consumibles para mascotas.",
  },
  FUBO: {
    nombre: "fuboTV Inc.",
    tipo: "Acción",
    sector: "Streaming de TV en vivo",
    descripcion:
      "Servicio de streaming de TV en vivo (\"virtual MVPD\"), con un posicionamiento histórico enfocado en contenido deportivo, compitiendo con otras alternativas de streaming en vivo a la TV de cable tradicional.",
  },
  OPEN: {
    nombre: "Opendoor Technologies Inc.",
    tipo: "Acción",
    sector: "Bienes raíces — compra-venta en línea (iBuying)",
    descripcion:
      "Compra casas directamente de propietarios usando precios algorítmicos, las renueva y las revende — un modelo de negocio (\"iBuying\") que requiere mucho capital y asume el riesgo directo de inventario inmobiliario, a diferencia de un portal inmobiliario tradicional que solo conecta compradores y vendedores.",
  },
  HOOD: {
    nombre: "Robinhood Markets Inc.",
    tipo: "Acción",
    sector: "Fintech — trading para consumidores",
    descripcion:
      "Plataforma de trading de acciones, opciones y criptomonedas conocida por popularizar las comisiones de cero dólares por operación para inversionistas individuales — gran parte de sus ingresos viene de pagos por flujo de órdenes y de intereses sobre saldos de efectivo y márgenes de clientes.",
  },
  U: {
    nombre: "Unity Software Inc.",
    tipo: "Acción",
    sector: "Software — desarrollo de videojuegos",
    descripcion:
      "Uno de los motores de desarrollo de videojuegos y contenido 3D/interactivo más usados por desarrolladores independientes y estudios medianos (compitiendo con Unreal Engine de Epic Games) — también monetiza publicidad dentro de juegos hechos con su motor.",
  },
  PATH: {
    nombre: "UiPath Inc.",
    tipo: "Acción",
    sector: "Software — automatización robótica de procesos",
    descripcion:
      "Software de automatización robótica de procesos (RPA): \"robots\" de software que replican tareas repetitivas que antes hacía una persona en una computadora (copiar datos entre sistemas, procesar formularios) — una categoría de software empresarial que compite cada vez más con enfoques de IA generativa.",
  },
  AI: {
    nombre: "C3.ai Inc.",
    tipo: "Acción",
    sector: "Software empresarial de inteligencia artificial",
    descripcion:
      "Vende software de inteligencia artificial empresarial para casos de uso industrial (mantenimiento predictivo, detección de fraude, optimización de cadena de suministro) a clientes grandes, incluyendo contratos con el gobierno de EE. UU. y energéticas.",
  },
  NET: {
    nombre: "Cloudflare Inc.",
    tipo: "Acción",
    sector: "Infraestructura de internet",
    descripcion:
      "Opera una red global que acelera la entrega de contenido web y protege sitios contra ataques (DDoS, bots) — una porción significativa del tráfico de internet pasa por su red, posicionándola como infraestructura crítica para muchos sitios y aplicaciones.",
  },
  DDOG: {
    nombre: "Datadog Inc.",
    tipo: "Acción",
    sector: "Software — monitoreo de infraestructura en la nube",
    descripcion:
      "Plataforma que permite a equipos de ingeniería monitorear el desempeño de sus aplicaciones y servidores en la nube en tiempo real — cuanto más migran las empresas a infraestructura en la nube, mayor es la necesidad de este tipo de herramienta de observabilidad.",
  },
  ZS: {
    nombre: "Zscaler Inc.",
    tipo: "Acción",
    sector: "Ciberseguridad — nube",
    descripcion:
      "Provee seguridad de red basada en la nube bajo el modelo \"zero trust\" (nunca confiar automáticamente en un dispositivo o usuario, verificar siempre) — en vez de proteger una red corporativa física tradicional, protege el tráfico de empleados que trabajan desde cualquier lugar.",
  },
  CRWD: {
    nombre: "CrowdStrike Holdings Inc.",
    tipo: "Acción",
    sector: "Ciberseguridad — protección de endpoints",
    descripcion:
      "Software de ciberseguridad que protege dispositivos individuales (laptops, servidores) contra malware y ataques, usando detección basada en la nube — una falla en una actualización de su software en julio de 2024 causó una interrupción masiva de sistemas a nivel mundial, uno de los incidentes de TI más grandes documentados en años recientes.",
  },
  S: {
    nombre: "SentinelOne Inc.",
    tipo: "Acción",
    sector: "Ciberseguridad — protección de endpoints con IA",
    descripcion:
      "Competidor directo de CrowdStrike en protección de dispositivos (endpoints), con un enfoque de marketing centrado en automatización/IA para la detección y respuesta a amenazas sin intervención manual constante.",
  },
  PTON: {
    nombre: "Peloton Interactive Inc.",
    tipo: "Acción",
    sector: "Equipo de fitness conectado",
    descripcion:
      "Vende bicicletas y caminadoras con pantalla integrada, combinadas con una suscripción a clases de ejercicio transmitidas en vivo o grabadas — tuvo un auge fuerte durante la pandemia (gimnasios cerrados) seguido de una caída de demanda importante al reabrir la actividad presencial.",
  },
  XYZ: {
    nombre: "Block Inc. (antes Square)",
    tipo: "Acción",
    sector: "Fintech — pagos para comercios y consumidores",
    descripcion:
      "Combina dos negocios: Square (terminales y software de pago para pequeños y medianos comercios) y Cash App (billetera digital y pagos entre personas para consumidores) — cambió su nombre corporativo de Square a Block en 2021 para reflejar que ya no era solo una empresa de pagos para comercios.",
  },
  SHOP: {
    nombre: "Shopify Inc.",
    tipo: "Acción",
    sector: "Software — comercio electrónico",
    descripcion:
      "Provee la plataforma de software que permite a negocios de cualquier tamaño montar su propia tienda en línea, sin depender de un marketplace como Amazon — cobra suscripción mensual más una comisión sobre las transacciones que procesa.",
  },
  DOCU: {
    nombre: "DocuSign Inc.",
    tipo: "Acción",
    sector: "Software — firma electrónica",
    descripcion:
      "Plataforma de firma electrónica y gestión de acuerdos, que se volvió prácticamente sinónimo de la categoría — tuvo un crecimiento muy acelerado durante la pandemia (menos trámites presenciales) que después se normalizó a un ritmo de crecimiento más moderado.",
  },
  ZM: {
    nombre: "Zoom Communications Inc.",
    tipo: "Acción",
    sector: "Software — videoconferencia",
    descripcion:
      "Plataforma de videollamadas que se volvió una herramienta cotidiana durante la pandemia de covid-19 — desde entonces ha intentado expandirse más allá de videollamadas hacia un paquete más amplio de comunicación empresarial (chat, telefonía, IA de productividad).",
  },
  OKTA: {
    nombre: "Okta Inc.",
    tipo: "Acción",
    sector: "Ciberseguridad — gestión de identidad",
    descripcion:
      "Software que gestiona cómo los empleados de una empresa inician sesión de forma segura en sus distintas aplicaciones (inicio de sesión único, autenticación multifactor) — la \"identidad\" del usuario, no el dispositivo, es el centro de su enfoque de seguridad.",
  },
  BILL: {
    nombre: "BILL Holdings Inc.",
    tipo: "Acción",
    sector: "Software — pagos y finanzas para pymes",
    descripcion:
      "Software que automatiza cuentas por pagar y por cobrar para pequeñas y medianas empresas (facturación, pagos a proveedores) — reduce procesos manuales de contabilidad que tradicionalmente se hacían con papel o Excel.",
  },
  FVRR: {
    nombre: "Fiverr International Ltd.",
    tipo: "Acción",
    sector: "Mercado en línea — servicios freelance",
    descripcion:
      "Mercado en línea donde freelancers ofrecen servicios (diseño, escritura, programación, marketing) empaquetados como \"gigs\" a precio fijo, a diferencia de modelos de freelance basados en licitación/cotización por proyecto.",
  },
  UPWK: {
    nombre: "Upwork Inc.",
    tipo: "Acción",
    sector: "Mercado en línea — trabajo freelance",
    descripcion:
      "Mercado en línea de trabajo freelance, con un modelo más orientado a proyectos cotizados y relaciones de trabajo más largas entre cliente y freelancer que el formato de \"gigs\" de precio fijo de Fiverr.",
  },
  W: {
    nombre: "Wayfair Inc.",
    tipo: "Acción",
    sector: "Comercio electrónico — muebles y hogar",
    descripcion:
      "Comercio electrónico especializado en muebles y artículos para el hogar, operando principalmente como intermediario entre fabricantes/proveedores y consumidores, sin mantener inventario propio para la mayoría de sus productos.",
  },
  ETSY: {
    nombre: "Etsy Inc.",
    tipo: "Acción",
    sector: "Mercado en línea — productos artesanales",
    descripcion:
      "Mercado en línea especializado en productos artesanales, vintage y de nicho hechos por vendedores individuales o pequeños negocios — se diferencia de Amazon por enfocarse en productos únicos/personalizados en vez de mercancía masiva.",
  },
  PENN: {
    nombre: "PENN Entertainment Inc.",
    tipo: "Acción",
    sector: "Casinos y apuestas deportivas",
    descripcion:
      "Opera casinos físicos regionales en EE. UU. y ha invertido fuertemente en expandirse a apuestas deportivas en línea (incluyendo una relación comercial grande, después disuelta, con ESPN para su plataforma de apuestas) — combina el negocio tradicional de casinos con el crecimiento digital de apuestas.",
  },
  TTD: {
    nombre: "The Trade Desk Inc.",
    tipo: "Acción",
    sector: "Publicidad digital — compra programática",
    descripcion:
      "Plataforma que permite a agencias de publicidad comprar espacio publicitario digital de forma programática (automatizada, basada en datos) a través de múltiples sitios y aplicaciones — a diferencia de Google o Meta, no es dueña de un \"jardín amurallado\" de audiencia propia, compite como plataforma independiente.",
  },
  ASAN: {
    nombre: "Asana Inc.",
    tipo: "Acción",
    sector: "Software — gestión de proyectos",
    descripcion:
      "Software de gestión de proyectos y trabajo en equipo (tareas, flujos de trabajo, seguimiento de avance) — compite en una categoría concurrida junto con herramientas como Monday.com, Trello y Microsoft Planner.",
  },
  CARG: {
    nombre: "CarGurus Inc.",
    tipo: "Acción",
    sector: "Mercado en línea — compra-venta de autos",
    descripcion:
      "Plataforma en línea que agrega listados de autos nuevos y usados de distribuidoras y vendedores particulares, con herramientas de comparación de precios — a diferencia de Carvana, no compra ni vende autos directamente, conecta compradores y vendedores.",
  },
  WOLF: {
    nombre: "Wolfspeed Inc.",
    tipo: "Acción",
    sector: "Semiconductores — carburo de silicio",
    descripcion:
      "Fabrica semiconductores de carburo de silicio (SiC), un material más eficiente que el silicio tradicional para aplicaciones de electrónica de potencia — usados en vehículos eléctricos, cargadores rápidos e infraestructura de energía, un nicho de crecimiento ligado a la electrificación.",
  },
};

export function getSimboloInfo(symbol) {
  return SIMBOLOS_INFO[symbol] || null;
}
