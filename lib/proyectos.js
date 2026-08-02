/* ============================================================
   Fuente única de datos de proyectos.
   La usan tanto ProjectShowcase (tarjetas) como ProjectsMap (mapa).
   ============================================================ */

export const PROYECTOS = [
  {
    id: "lealtad",
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
  },
  {
    id: "modernizacion",
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
  },
  {
    id: "recomendacion",
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
  },
  {
    id: "pos",
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
  },
  {
    id: "agente",
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
  },
  {
    id: "clima",
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
  },
  {
    id: "pricing",
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
  },
  {
    id: "genai",
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
  },
];
