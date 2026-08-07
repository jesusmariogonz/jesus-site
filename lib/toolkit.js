/* ============================================================
   Catálogo de "The Toolkit"
   ------------------------------------------------------------
   Cuando tengas cada producto cargado en Lemon Squeezy, copia su
   "Checkout Link" (o su "Product/Variant ID" si usas el overlay
   de Lemon.js) y pégalo en `checkoutUrl`. Mientras esté vacío
   ("") el producto se muestra como "Próximamente" en vez del
   botón de compra.

   BUNDLES
   -------
   Cada bundle define `ids`: el conjunto exacto de productos que
   cubre. El selector de /the-toolkit compara la selección del
   usuario contra estos conjuntos (sin importar el orden) y, si
   hay match exacto, manda al checkout de ese bundle. Si no hay
   match, no se puede continuar desde el selector: hay que crear
   el bundle correspondiente en Lemon Squeezy y agregarlo aquí.
   Así vas agregando un bundle nuevo cada vez que subas un
   producto nuevo y quieras que se pueda combinar.
   ============================================================ */

export const TOOLKIT_PRODUCTOS = [
  {
    id: "power-bi",
    nombre: "Power BI de Cero a Hero",
    resumen:
      "Curso completo en PDF para construir un modelo de Power BI desde cero, con buenas prácticas de modelado y DAX.",
    formato: "PDF",
    precio: 12,
    precioLista: 19,
    checkoutUrl: "https://jgonzalez.lemonsqueezy.com/checkout/buy/2f5dd473-1fa6-465b-a4e9-903db0fba8c4",
    detalle: {
      eyebrow: "Toolkit 01 · Business Intelligence",
      hook: "De abrir Power BI por primera vez a publicar un modelo que la organización realmente usa.",
      paraQuien: [
        "Nunca has abierto Power BI o lo usas a medias y quieres entender el modelo de datos, no solo dar clics.",
        "Prefieres un material que puedas releer y consultar, en vez de buscar el minuto exacto de un video.",
        "Quieres pasar de \"abrir el programa\" a publicar un modelo que tu equipo realmente usa.",
      ],
      incluye: [
        "PDF completo de 55 páginas, de cero a hero.",
        "13 módulos progresivos (Power Query → modelo → DAX → visuales).",
        "16 diagramas originales explicando el modelo de datos.",
        "Ejercicios encadenados: cada uno construye sobre el anterior.",
        "Glosario y atajos de teclado.",
      ],
      resultado:
        "Al terminar entiendes por qué se arma así un modelo de Power BI, no solo cómo dar los clics, y tienes el criterio para construir el siguiente sin depender de tutoriales.",
      formatoDetalle: "1 PDF descargable (no incluye video ni archivo .pbix de práctica)",
      duracion: "Autoestudio · ≈ 6-8 horas de lectura y práctica",
      nivel: "Principiante → intermedio",
      badges: ["Descarga instantánea", "Acceso de por vida", "13 módulos"],
    },
  },
  {
    id: "sql-retail",
    nombre: "Kit completo SQL for Retail",
    resumen:
      "Dataset real de punto de venta, 22 consultas de negocio resueltas y el libro de teoría que explica por qué funcionan.",
    formato: "Kit completo",
    precio: 12.7,
    precioLista: 29,
    checkoutUrl: "https://jgonzalez.lemonsqueezy.com/checkout/buy/11a755ad-9ca2-45f5-a87c-929437eaf7b3",
    detalle: {
      eyebrow: "Toolkit 02 · SQL & Retail Analytics",
      hook: "No es un curso de SQL. Empieza donde terminan los tutoriales: en las preguntas que de verdad se hacen en una cadena de tiendas.",
      paraQuien: [
        "Sabes SQL básico (JOIN, GROUP BY) y quieres aplicarlo a preguntas reales de retail, no a ejercicios de tutorial.",
        "Trabajas o quieres trabajar con datos de punto de venta y te has topado con el problema del \"grano\" de la tabla.",
        "Quieres practicar sobre un dataset real, no sobre tablas de ejemplo genéricas.",
        "Usas o te interesa Snowflake, Databricks, SQL Server o DuckDB.",
      ],
      incluye: [
        "Dataset completo de punto de venta: 42,000 líneas de ticket, inventario, dimensiones y metas.",
        "Recetario.sql — 979 líneas, 22 consultas de negocio resueltas, con notas de por qué están escritas así.",
        "Guía en PDF (49 páginas): cómo usar el recetario y el contexto de negocio de cada consulta.",
        "Libro Fundamentos en PDF (59 páginas): 17 capítulos de teoría detrás de cada técnica.",
        "Notas de dialecto para Snowflake, Databricks, SQL Server y DuckDB.",
      ],
      resultado:
        "Al terminar tienes 22 consultas resueltas y explicadas que puedes adaptar directo a tu propio punto de venta, y la teoría para defenderlas frente a tu equipo.",
      formatoDetalle: "4 archivos: dataset (.zip + CSV), recetario (.sql), guía y libro de fundamentos (2 PDF)",
      duracion: "Material de consulta permanente, no un curso con ritmo fijo",
      nivel: "Intermedio (asume JOIN y GROUP BY)",
      badges: ["Descarga instantánea", "Acceso de por vida", "Compatible con 4 motores SQL"],
    },
  },
  {
    id: "retail-analytics-claude",
    nombre: "Retail Analytics con Claude",
    resumen:
      "Skills y prompts listos para usar Claude como copiloto de analítica retail en el día a día.",
    formato: "Kit de skills",
    precio: 15,
    checkoutUrl: "",
  },
  {
    id: "modelo-punto-venta",
    nombre: "Modelo analítico de punto de venta",
    resumen:
      "Framework para estructurar un modelo analítico de punto de venta de principio a fin.",
    formato: "Kit completo",
    precio: 15,
    checkoutUrl: "",
  },
  {
    id: "excel-finanzas",
    nombre: "Excel & Finanzas Caseras",
    resumen:
      "Plantillas de Excel listas para usar y el manual de finanzas personales, para ordenar números rápido.",
    formato: "Plantillas + Manual",
    precio: 9,
    checkoutUrl: "",
  },
  {
    id: "prompting-profesional",
    nombre: "Prompting Profesional",
    resumen:
      "Manual para escribir prompts que de verdad rinden en trabajo real de datos y negocio.",
    formato: "Manual",
    precio: 9,
    checkoutUrl: "",
  },
];

/* Bundles disponibles. Agrega uno nuevo cada vez que quieras que una
   combinación específica de productos se pueda comprar junta. `ids`
   debe ser el conjunto exacto (no subconjunto, no superconjunto) que
   cubre ese bundle. */
export const TOOLKIT_BUNDLES = [
  {
    id: "bundle-sql-powerbi",
    nombre: "SQL for Retail + Power BI",
    ids: ["power-bi", "sql-retail"],
    resumen: "Los dos recursos de analítica y BI juntos, con descuento adicional.",
    precio: 18,
    precioLista: 31, // suma de precios individuales (12 + 12.70 ≈ redondeado)
    checkoutUrl: "https://jgonzalez.lemonsqueezy.com/checkout/buy/11a755ad-9ca2-45f5-a87c-929437eaf7b3",
  },
  // Cuando subas más productos, agrega aquí más bundles, por ejemplo:
  // {
  //   id: "bundle-completo",
  //   nombre: "Bundle completo — todo The Toolkit",
  //   ids: TOOLKIT_PRODUCTOS.map((p) => p.id),
  //   resumen: "Todo The Toolkit en un solo paquete.",
  //   precio: 49,
  //   precioLista: 82,
  //   checkoutUrl: "",
  // },
];
