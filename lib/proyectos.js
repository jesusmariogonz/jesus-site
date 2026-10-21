/* ============================================================
   Fuente única de datos de proyectos.
   La usan tanto ProjectShowcase (tarjetas) como ProjectsMap (mapa).

   Los proyectos están anonimizados por acuerdos de confidencialidad
   con las empresas involucradas (sin nombres de cliente ni cifras
   propietarias) — cada uno conserva el problema, la arquitectura y
   el rol reales, descritos en términos genéricos de industria.
   ============================================================ */

// Vincula la categoría de una nota del blog con el proyecto de caso
// de estudio más afín, para el enlace "Proyecto relacionado" al pie
// de cada nota. No todas las categorías tienen un proyecto afín.
export const CATEGORIA_PROYECTO = {
  snowflake: "modernizacion",
  arquitectura: "modernizacion",
  cloud: "modernizacion",
  "ingenieria-de-datos": "pos",
  "data-model": "recomendacion",
  ia: "genai",
  "business-analytics": "pricing",
  business: "lealtad",
  fintech: "pricing",
};

export const PROYECTOS = [
  {
    id: "lealtad",
    tipo: "experiencia",
    imagen: "/images/proyectos/lealtad.jpg",
    num: "01",
    corto: "Lealtad y analítica de clientes",
    nombre: "Transformación de plataformas de lealtad y analítica de clientes",
    paises: ["mexico"],
    region: "México",
    lado: "izq",
    labelY: 62,
    arte: "lealtad",
    descripcion:
      "Liderazgo en la evolución tecnológica de plataformas de lealtad y analítica de clientes, impulsando la modernización de arquitecturas de datos, migraciones tecnológicas e integración de información para fortalecer capacidades analíticas.",
    chips: [
      "Arquitectura de datos",
      "Migración a la nube",
      "Gobierno de datos",
      "Personalización",
    ],
    problema:
      "El programa de lealtad operaba sobre una plataforma legada con información de clientes fragmentada entre varios sistemas transaccionales, lo que dificultaba construir una vista única del cliente y limitaba la personalización de beneficios y comunicaciones.",
    contexto:
      "Cadena de retail y conveniencia con millones de clientes inscritos en el programa de lealtad, operando en múltiples formatos de tienda en México.",
    solucion:
      "Se diseñó una plataforma de datos centralizada que consolida el historial transaccional y de comportamiento del cliente, habilitando segmentación dinámica y reglas de personalización reutilizables por distintos canales.",
    arquitectura:
      "Ingesta de datos transaccionales hacia un data warehouse en la nube, con capas de transformación separando datos crudos, modelos de negocio y vistas de consumo, gobernadas bajo un catálogo de datos con reglas de calidad y acceso.",
    rol:
      "Arquitecto de soluciones y responsable de producto de datos: definí la arquitectura objetivo, prioricé el roadmap de migración y fui el puente entre los equipos de negocio (mercadotecnia y lealtad) y los equipos de ingeniería.",
    impacto:
      "Reducción del tiempo para construir un segmento de clientes de días a horas, y una única fuente de verdad de cliente adoptada por los equipos de mercadotecnia y operación de tiendas.",
  },
  {
    id: "modernizacion",
    tipo: "experiencia",
    imagen: "/images/proyectos/modernizacion.jpg",
    num: "02",
    corto: "Modernización analítica",
    nombre: "Evaluación de estrategia analítica y modernización tecnológica",
    paises: ["mexico"],
    region: "México",
    lado: "izq",
    labelY: 132,
    arte: "modernizacion",
    descripcion:
      "Lideré la evaluación de la estrategia de datos y la evolución tecnológica de plataformas analíticas, definiendo hojas de ruta para migraciones hacia arquitecturas modernas en la nube, optimización de procesos de datos y adopción de nuevas capacidades de inteligencia artificial y analítica avanzada.",
    chips: ["Snowflake", "Azure Data Factory", "Databricks", "Gobierno de Datos"],
    problema:
      "La plataforma analítica corporativa había crecido de forma orgánica durante años, acumulando procesos redundantes, costos de cómputo crecientes y dependencias técnicas que hacían lenta cualquier iniciativa nueva de datos.",
    contexto:
      "Grupo empresarial con múltiples unidades de negocio en México, cada una con sus propios procesos y reportes analíticos construidos de forma independiente.",
    solucion:
      "Se realizó una evaluación integral de la arquitectura existente y se definió una hoja de ruta de modernización, priorizando qué cargas de trabajo migrar primero según impacto de negocio y complejidad técnica.",
    arquitectura:
      "Arquitectura objetivo basada en un lakehouse con Snowflake y Databricks, orquestada con Azure Data Factory, sustituyendo procesos batch monolíticos por pipelines modulares con control de versiones y pruebas.",
    rol:
      "Lideré la evaluación técnica y de negocio, definí los criterios de priorización de la hoja de ruta y presenté las recomendaciones a los patrocinadores ejecutivos del programa.",
    impacto:
      "Hoja de ruta de modernización adoptada como base del plan multianual de la organización, con los primeros procesos migrados mostrando reducciones relevantes en tiempos de ejecución.",
  },
  {
    id: "recomendacion",
    tipo: "experiencia",
    imagen: "/images/proyectos/recomendacion.jpg",
    num: "03",
    corto: "Motor de recomendación",
    nombre: "Motor de recomendación de productos",
    paises: ["chile", "colombia", "peru"],
    region: "Chile · Colombia · Perú",
    lado: "izq",
    labelY: 202,
    arte: "recomendacion",
    descripcion:
      "Diseñé la estrategia analítica para implementar motores de recomendación personalizados utilizando modelos de comportamiento de compra, afinidad entre productos (Market Basket Analysis), segmentación de clientes y patrones de consumo. El objetivo: incrementar la venta cruzada, mejorar la experiencia del cliente y aumentar el ticket promedio mediante recomendaciones inteligentes en distintos canales comerciales.",
    chips: ["Snowflake", "Databricks", "Python", "Spark", "Machine Learning"],
    problema:
      "Las recomendaciones de producto en canales digitales y en tienda se basaban en reglas manuales y en el criterio de los equipos comerciales, sin aprovechar el historial de compra disponible para personalizar por cliente.",
    contexto:
      "Operación retail multipaís en Sudamérica, con catálogos de miles de productos y canales de venta física y digital.",
    solucion:
      "Se construyó un motor de recomendación basado en afinidad entre productos y comportamiento histórico de compra, integrado a los canales comerciales para sugerir productos complementarios en tiempo de decisión de compra.",
    arquitectura:
      "Pipelines de procesamiento en Spark sobre Databricks para calcular afinidades y segmentos, con los modelos entrenados en Python y los resultados servidos desde Snowflake hacia las aplicaciones de cara al cliente.",
    rol:
      "Diseñé la estrategia analítica y la arquitectura de datos del motor, y coordiné con los equipos de ciencia de datos y de canales comerciales la integración de las recomendaciones en producción.",
    impacto:
      "Incremento medible en la tasa de venta cruzada en los canales donde se activaron las recomendaciones, validado mediante pruebas controladas frente a los procesos de reglas manuales previos.",
  },
  {
    id: "pos",
    tipo: "experiencia",
    imagen: "/images/proyectos/pos.jpg",
    num: "04",
    corto: "Plataforma Punto de Venta",
    nombre: "Evolución de la plataforma de Punto de Venta",
    paises: ["colombia"],
    region: "Colombia",
    lado: "izq",
    labelY: 272,
    arte: "pos",
    descripcion:
      "Participé en la evolución tecnológica y analítica del ecosistema de Punto de Venta, diseñando soluciones para mejorar la captura, procesamiento y explotación de información transaccional. El proyecto fortaleció la disponibilidad de datos para inteligencia comercial, pricing, promociones y operación de tiendas.",
    chips: ["Datos transaccionales", "Inteligencia comercial", "Retail"],
    problema:
      "La información transaccional generada en el punto de venta llegaba a los sistemas analíticos con retrasos y con inconsistencias entre tiendas, limitando la capacidad de reaccionar rápido en pricing y promociones.",
    contexto:
      "Cadena de tiendas de conveniencia en Colombia, con captura de datos distribuida en cientos de puntos de venta.",
    solucion:
      "Se rediseñó el flujo de captura y procesamiento de datos transaccionales, estandarizando la estructura de la información en origen y acelerando su disponibilidad para los equipos de inteligencia comercial.",
    arquitectura:
      "Ingesta near real-time de eventos de punto de venta hacia una capa de datos transaccional, con validaciones automáticas de calidad antes de exponer la información a los modelos de pricing y promociones.",
    rol:
      "Participé en el diseño de la solución de datos y en la definición de los estándares de calidad, colaborando con los equipos de operación de tienda y de inteligencia comercial.",
    impacto:
      "Reducción del tiempo entre la venta en tienda y su disponibilidad para análisis, y mayor confiabilidad de los datos usados en decisiones de pricing y promociones.",
  },
  {
    id: "agente",
    tipo: "experiencia",
    imagen: "/images/proyectos/agente.jpg",
    num: "05",
    corto: "Agente IA de procesos",
    nombre: "Agente Inteligente para Automatización de Procesos",
    paises: ["peru"],
    region: "Perú",
    lado: "izq",
    labelY: 342,
    arte: "agente",
    descripcion:
      "Diseñé la estrategia funcional y técnica para un agente basado en Inteligencia Artificial Generativa enfocado en automatizar procesos de negocio, asistir a usuarios en consultas operativas y reducir tiempos de ejecución mediante automatización inteligente e integración con fuentes corporativas de información.",
    chips: ["IA Generativa", "Copilot", "RAG", "Automatización"],
    problema:
      "Los equipos operativos dependían de procesos manuales de consulta a distintos sistemas internos para resolver preguntas recurrentes, consumiendo tiempo que podía dedicarse a tareas de mayor valor.",
    contexto:
      "Operación retail en Perú, con equipos operativos distribuidos que necesitaban acceso rápido a información dispersa en varios sistemas corporativos.",
    solucion:
      "Se diseñó un agente conversacional basado en IA generativa capaz de responder consultas operativas y ejecutar tareas puntuales, integrado con las fuentes de información corporativa relevantes mediante recuperación aumentada (RAG).",
    arquitectura:
      "Arquitectura RAG con una capa de recuperación sobre las fuentes corporativas autorizadas y un modelo de lenguaje orquestando la conversación, con controles de acceso para asegurar que cada usuario solo consulte información permitida.",
    rol:
      "Diseñé la estrategia funcional y técnica del agente, definí los casos de uso prioritarios y lideré la integración con las fuentes de datos corporativas.",
    impacto:
      "Reducción del tiempo de resolución de consultas operativas recurrentes y adopción del agente como primer punto de contacto para ese tipo de preguntas en los equipos piloto.",
  },
  {
    id: "clima",
    tipo: "experiencia",
    imagen: "/images/proyectos/clima.jpg",
    num: "06",
    corto: "Forecast climático",
    nombre: "Pronóstico de ventas basado en variables climáticas",
    paises: ["suiza"],
    region: "Suiza",
    lado: "der",
    labelY: 92,
    arte: "clima",
    descripcion:
      "Participé en el diseño de un modelo predictivo que incorporó información meteorológica como variable explicativa para anticipar la demanda de productos sensibles al clima. El proyecto permitió mejorar la precisión de los pronósticos y optimizar decisiones de abastecimiento e inventario.",
    chips: ["Forecasting", "Machine Learning", "Datos climáticos"],
    problema:
      "Los pronósticos de demanda para productos sensibles al clima (bebidas, temporada) no incorporaban variables meteorológicas, generando desabasto o exceso de inventario en cambios bruscos de clima.",
    contexto:
      "Operación europea con portafolio de productos cuya demanda varía significativamente según temperatura y condiciones climáticas.",
    solucion:
      "Se incorporaron variables meteorológicas históricas y pronosticadas como insumos adicionales al modelo de forecast de demanda, junto con las variables comerciales ya existentes.",
    arquitectura:
      "Pipeline de datos que combina series históricas de ventas con datos climáticos de fuentes externas, alimentando un modelo de machine learning re-entrenado periódicamente conforme llega nueva información.",
    rol:
      "Participé en el diseño del modelo y en la integración de las fuentes de datos climáticos al proceso de forecast existente.",
    impacto:
      "Mejora en la precisión del pronóstico de demanda para las categorías más sensibles al clima frente al modelo base sin esa variable.",
  },
  {
    id: "pricing",
    tipo: "experiencia",
    imagen: "/images/proyectos/pricing.jpg",
    num: "07",
    corto: "Pricing inteligente",
    nombre: "Estrategia de Pricing Inteligente",
    paises: ["luxemburgo", "alemania"],
    region: "Luxemburgo · Alemania",
    lado: "der",
    labelY: 162,
    arte: "pricing",
    descripcion:
      "Definí la arquitectura analítica para iniciativas de pricing dinámico y optimización de precios, utilizando elasticidad de demanda, comportamiento histórico de ventas y simulaciones de escenarios para maximizar rentabilidad sin afectar el volumen de ventas.",
    chips: ["Revenue Management", "Data Science", "Optimización comercial"],
    problema:
      "Las decisiones de precio se tomaban principalmente por categoría y de forma manual, sin un marco cuantitativo que estimara el impacto de un cambio de precio en volumen y rentabilidad antes de aplicarlo.",
    contexto:
      "Operación europea con un portafolio amplio de referencias y sensibilidad de precio distinta entre categorías.",
    solucion:
      "Se definió una arquitectura analítica de pricing que estima elasticidad de demanda por categoría y simula escenarios de precio, dando a los equipos comerciales un marco cuantitativo para decidir antes de ejecutar un cambio.",
    arquitectura:
      "Modelos de elasticidad entrenados sobre el histórico de ventas y precios, expuestos mediante simulaciones de escenarios que los equipos comerciales pueden explorar antes de aprobar un cambio de precio.",
    rol:
      "Definí la arquitectura analítica de la solución y el flujo de trabajo entre el modelo de elasticidad y el proceso de decisión comercial.",
    impacto:
      "Marco cuantitativo adoptado por los equipos comerciales para evaluar cambios de precio antes de ejecutarlos, reemplazando decisiones basadas únicamente en criterio.",
  },
  {
    id: "genai",
    tipo: "experiencia",
    imagen: "/images/proyectos/genai.jpg",
    num: "08",
    corto: "Plataforma GenAI",
    nombre:
      "Plataforma de Inteligencia Artificial Generativa para analítica empresarial",
    paises: ["suiza"],
    region: "Suiza",
    lado: "der",
    labelY: 232,
    arte: "genai",
    descripcion:
      "Liderazgo en el diseño de una solución de IA Generativa enfocada en democratizar el acceso a la información empresarial mediante asistentes conversacionales capaces de responder preguntas de negocio utilizando datos corporativos confiables.",
    chips: ["GenAI", "NLP", "RAG", "Analítica self-service"],
    problema:
      "Responder preguntas de negocio requería conocimiento técnico de SQL o depender de los equipos de analítica, creando cuellos de botella para usuarios de negocio que necesitaban respuestas rápidas.",
    contexto:
      "Organización con un equipo central de analítica atendiendo solicitudes de múltiples áreas de negocio en Europa.",
    solucion:
      "Se diseñó una plataforma conversacional de IA generativa que traduce preguntas de negocio en lenguaje natural a consultas sobre los datos corporativos, devolviendo respuestas confiables sin requerir conocimiento técnico.",
    arquitectura:
      "Arquitectura de recuperación aumentada (RAG) sobre los modelos de datos corporativos ya gobernados, con una capa de orquestación que valida que las respuestas generadas se basen únicamente en fuentes autorizadas.",
    rol:
      "Lideré el diseño funcional y técnico de la plataforma, definiendo los controles de confiabilidad necesarios para que las respuestas generadas fueran consistentes con los datos gobernados de la organización.",
    impacto:
      "Reducción de la dependencia del equipo central de analítica para preguntas de negocio recurrentes, con usuarios de negocio autoservicio consultando la plataforma directamente.",
  },
  {
    id: "pricing-cientifico",
    tipo: "independiente",
    detalleUrl: "/proyectos/pricing-cientifico",
    imagen: "/images/proyectos/pricing-cientifico.jpg",
    num: "09",
    corto: "Pricing científico",
    nombre: "Estimación de elasticidad y optimización de precio con metodología científica",
    paises: [],
    region: "Proyecto independiente · reproducible",
    lado: "der",
    labelY: 302,
    arte: "pricing",
    descripcion:
      "Proyecto propio, construido de cero con datos sintéticos declarados, código abierto y metodología documentada: estima la elasticidad precio-demanda con una regresión log-log y efectos fijos por tienda, y calcula el precio que maximiza la utilidad esperada con el Índice de Lerner, validado contra un barrido numérico independiente.",
    chips: ["Python", "Econometría", "statsmodels", "Optimización de precio", "MLOps"],
    problema:
      "A diferencia de los ocho casos anteriores, este no parte de un cliente real: busca mostrar, de principio a fin y sin restricciones de confidencialidad, cómo luce el expediente completo de un proyecto de pricing científico — desde la pregunta de negocio hasta el gobierno y monitoreo del modelo en producción.",
    contexto:
      "Panel sintético de 40 tiendas × 52 semanas, con variación de precio exógena (impulsada por promociones), estacionalidad y ruido de demanda — generado y declarado explícitamente como simulación, nunca como datos de un empleador.",
    solucion:
      "Expediente de proyecto completo con diccionario de datos, diseño científico (hipótesis, sesgos, identificación causal), implementación reproducible en Python, resultados con intervalos de confianza y comparación contra línea base, arquitectura de producción y plan de gobierno/monitoreo.",
    arquitectura:
      "Pipeline de referencia: ingesta desde punto de venta → warehouse → feature engineering → modelo de elasticidad → simulador de precio → tablero comercial → decisión, con reentrenamiento periódico realimentado desde las transacciones nuevas.",
    rol:
      "Autoría completa: diseño del experimento sintético, metodología estadística, código, visualizaciones y documentación.",
    impacto:
      "Bajo los supuestos de la simulación, el modelo estima una mejora de utilidad esperada de +11% frente al precio actual — una proyección a validar con experimentación controlada, no un resultado observado en tiendas reales.",
  },
  {
    id: "analizador-pareto",
    tipo: "independiente",
    detalleUrl: "/proyectos/analizador-pareto",
    imagen: "/images/proyectos/analizador-pareto.jpg",
    num: "10",
    corto: "Analizador de Pareto",
    nombre: "Herramienta genérica de análisis de Pareto (80/20) para cualquier dataset de causas",
    paises: [],
    region: "Proyecto independiente · reproducible",
    lado: "izq",
    labelY: 372,
    arte: "pareto",
    descripcion:
      "Proyecto propio: una herramienta de línea de comandos, genérica y reutilizable, que recibe cualquier CSV de causas/categorías y produce automáticamente la clasificación ordenada, el porcentaje acumulado y el corte de 'pocos vitales' — con tres datasets de ejemplo declarados como ilustrativos (devoluciones, defectos de manufactura, ventas por SKU) y el código fuente completo.",
    chips: ["Python", "pandas", "matplotlib", "Control de calidad", "Priorización"],
    problema:
      "La nota del blog sobre el principio de Pareto mostraba un solo ejemplo de devoluciones en retail con el script hecho a la medida de ese caso. Este proyecto generaliza ese script en una herramienta que funciona con cualquier dataset de causas, sin tocar código — solo cambiar el CSV de entrada.",
    contexto:
      "Tres datasets de ejemplo, declarados como ilustrativos y no de ninguna empresa real: causas de devolución en tienda retail, causas de defecto en una línea de manufactura, y ventas por SKU en un catálogo de 20 productos.",
    solucion:
      "Un script de Python (analizador_pareto.py) con una función de análisis separada de la de graficación, un CLI con umbral configurable (no fijo en 80%), y salida en JSON + CSV + PNG lista para consumir desde cualquier sistema, incluida esta misma página.",
    arquitectura:
      "Pipeline de referencia: fuente de datos → exportación periódica a CSV → analizador de Pareto → gráfica y JSON de salida → decisión de prioridad del dueño del proceso, con el análisis corriendo de nuevo cada vez que hay datos nuevos.",
    rol:
      "Autoría completa: generalización del script original de la nota, diseño del CLI, los tres datasets de ejemplo, las visualizaciones y la documentación.",
    impacto:
      "Convierte un script de un solo uso en una herramienta reutilizable: los mismos tres ejemplos muestran que el corte de 'pocos vitales' varía entre 30% y 33% de las categorías según el dataset — nunca exactamente 20%, el matiz central de la nota que ancla este proyecto.",
  },
];
