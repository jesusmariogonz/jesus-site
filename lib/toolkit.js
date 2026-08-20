/* ============================================================
   Catálogo de "The Toolkit" — cobros vía Stripe
   ------------------------------------------------------------
   Cada producto/bundle necesita `stripePriceId` (el ID del Price
   creado en Stripe, empieza con "price_..."). Mientras esté vacío
   ("") el producto se muestra como "Próximamente" en vez del botón
   de compra. Usa scripts/crear-precios-stripe.mjs para generarlos.

   `checkoutUrl` ahora ya NO es un link externo: apunta a la ruta
   interna /api/checkout, que crea la sesión de Stripe en el
   servidor y redirige. No lo edites a mano — se genera con
   `rutaCheckout()` más abajo a partir del `id`.

   `archivos`: lista de los PDFs/zips que se entregan al comprar
   este producto, subidos a un store PRIVADO de Vercel Blob (NO al
   repo — el repo es público). Cada entrada es { nombre, blobPath }
   — el pathname dentro del store (ej. "toolkit/archivo.pdf"), NO
   una URL pública. Súbelos con scripts/subir-carpeta-toolkit.mjs
   (sube toda la carpeta Recursos/staging de un jalón y llena los
   blobPath solo) o con scripts/subir-archivo-toolkit.mjs uno por
   uno.

   BUNDLES
   -------
   Cada bundle define `ids`: el conjunto exacto de productos que
   cubre. El selector de /the-toolkit compara la selección del
   usuario contra estos conjuntos (sin importar el orden) y, si
   hay match exacto, manda al checkout de ese bundle. Si no hay
   match, no se puede continuar desde el selector: hay que crear
   el bundle correspondiente en Stripe y agregarlo aquí. Al
   comprar un bundle, el correo de entrega incluye los archivos de
   TODOS los productos en `ids` (no hace falta repetirlos).
   ============================================================ */

function rutaCheckout(tipo, id) {
  return `/api/checkout?type=${tipo}&id=${id}`;
}

export const TOOLKIT_PRODUCTOS = [
  {
    id: "framing",
    nombre: "El Problema del Framing",
    resumen:
      "Cómo decidir qué importa cuando todo cambia — un toolkit de framing para datos, IA y negocio. 30 capítulos, ejemplos reales y el Framework Canvas.",
    formato: "PDF",
    precio: 0,
    precioLista: 9.99,
    badge: "Gratis por tiempo limitado",
    // Gratis: no pasa por Stripe. Es el mismo PDF que ya está público
    // en la Biblioteca (lib/recursos.js), así que el botón lo descarga
    // directo sin checkout.
    checkoutUrl: "/recursos/el-problema-del-framing.pdf",
    detalle: {
      eyebrow: "Toolkit 00 · Framework de decisión",
      hook: "Por qué un modelo que funcionaba perfecto en el papel falla en producción, y por qué dos áreas de la misma empresa interpretan el mismo dato distinto.",
      paraQuien: [
        "Diseñas sistemas, modelos o procesos que deben seguir siendo válidos cuando el negocio cambia.",
        "Presentaste un plan perfecto que el mundo real desarmó en una semana, y quieres entender por qué en vez de solo intentarlo con más fuerza la próxima vez.",
        "Lideras un equipo de datos, producto o IA y necesitas un lenguaje común para discutir supuestos.",
        "No requiere formación técnica en lógica ni IA académica: todo se explica en términos de negocio.",
      ],
      incluye: [
        "PDF completo de 210 páginas, 30 capítulos.",
        "Cada capítulo cierra con un ejemplo real (anonimizado) y un ejercicio aplicable de inmediato.",
        "Framework Canvas de 6 secciones, pensado para completarse en equipo sin jerga técnica.",
        "Apéndice con las fichas de trabajo del Toolkit listas para imprimir o adaptar.",
        "Mapa rápido de qué capítulo leer según tu situación.",
      ],
      resultado:
        "Terminas con vocabulario y un canvas concretos para hacer explícitos los supuestos detrás de cualquier modelo, dashboard o proceso, antes de que el negocio los rompa por ti.",
      formatoDetalle: "1 PDF descargable",
      duracion: "Autoestudio · diseñado para leerse en orden una vez y usarse como referencia después",
      nivel: "Todos los niveles",
      badges: ["Descarga instantánea", "Acceso de por vida", "30 capítulos"],
    },
  },
  {
    id: "control-cognitivo-empresarial",
    nombre: "Control Cognitivo Empresarial",
    resumen:
      "Los patrones ocultos detrás de quién influye, quién controla y quién decide en una organización — con un capítulo dedicado a cómo la IA está cambiando esas reglas.",
    formato: "PDF",
    precio: 19,
    precioLista: 34,
    stripePriceId: "",
    checkoutUrl: rutaCheckout("product", "control-cognitivo-empresarial"),
    archivos: [{ nombre: "control-cognitivo-empresarial.pdf", blobPath: "" }],
    detalle: {
      eyebrow: "Toolkit 03 · Poder, psicología y decisiones",
      hook: "Por qué alguien sin el puesto más alto termina dominando la sala de juntas — y qué hay detrás de eso que no es \"saber manipular\".",
      paraQuien: [
        "Lideras equipos o proyectos y sientes que las decisiones reales se toman fuera de los canales formales.",
        "Quieres entender la psicología detrás de la influencia sin caer en técnicas de manipulación baratas.",
        "Te interesa cómo la IA y los datos están cambiando quién tiene la última palabra en una decisión.",
        "Buscas un marco basado en evidencia, no en anécdotas de gurús de liderazgo.",
      ],
      incluye: [
        "PDF completo de 124 páginas, 22 capítulos + 1 paréntesis, en 5 partes.",
        "Parte I: el error de origen — qué es el poder realmente.",
        "Parte II: las salas donde se juega el poder (reuniones, negociación, política organizacional).",
        "Parte III: liderazgo como sistema, no como personalidad.",
        "Parte IV: la nueva variable — IA, sesgos algorítmicos y decisiones bajo incertidumbre.",
        "Parte V: extensión práctica — manejo de conflicto entre pares.",
      ],
      resultado:
        "Terminas con un framework personal de control cognitivo: cómo leer el poder real en tu organización, construir influencia sin manipular, y dar retroalimentación difícil sin activar defensividad.",
      formatoDetalle: "1 PDF descargable",
      duracion: "Autoestudio · diseñado para leerse en orden una vez y usarse como referencia después",
      nivel: "Todos los niveles",
      badges: ["Descarga instantánea", "Acceso de por vida", "22 capítulos"],
    },
  },
  {
    id: "power-bi",
    nombre: "Power BI de Cero a Hero",
    resumen:
      "Curso completo en PDF para construir un modelo de Power BI desde cero, con buenas prácticas de modelado y DAX.",
    formato: "PDF",
    precio: 12,
    precioLista: 19,
    stripePriceId: "price_1U6dv0Go6ysKHu77B5KT5UcW",
    checkoutUrl: rutaCheckout("product", "power-bi"),
    archivos: [{ nombre: "power-bi-de-cero-a-hero.pdf", blobPath: "" }],
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
    stripePriceId: "price_1U6dv0Go6ysKHu77Bp5lSzlR",
    checkoutUrl: rutaCheckout("product", "sql-retail"),
    archivos: [
      { nombre: "sql-retail-dataset.zip", blobPath: "" },
      { nombre: "sql-retail-recetario.sql", blobPath: "" },
      { nombre: "sql-retail-guia.pdf", blobPath: "" },
      { nombre: "sql-retail-fundamentos.pdf", blobPath: "" },
    ],
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
    id: "la-analitica-avanzada",
    nombre: "La Analítica Avanzada",
    resumen:
      "Guía completa para entender y aplicar analítica avanzada en un negocio real: desde los fundamentos hasta casos de implementación por industria.",
    formato: "PDF",
    precio: 12,
    precioLista: 19,
    stripePriceId: "",
    checkoutUrl: rutaCheckout("product", "la-analitica-avanzada"),
    archivos: [{ nombre: "la-analitica-avanzada.pdf", blobPath: "" }],
    detalle: {
      eyebrow: "Toolkit 04 · Analítica avanzada",
      hook: "De entender qué es la analítica avanzada a saber por dónde empezar a implementarla en tu industria.",
      paraQuien: [
        "Quieres pasar de reportes descriptivos a modelos que de verdad ayuden a decidir.",
        "Necesitas explicarle a tu equipo o a tu jefe qué es analítica avanzada, sin caer en buzzwords.",
        "Buscas ejemplos de implementación reales, no solo teoría.",
      ],
      incluye: [
        "PDF completo de 176 páginas.",
        "Fundamentos explicados en términos de negocio, no solo matemáticos.",
        "Casos de aplicación por industria.",
      ],
      resultado:
        "Terminas con un mapa claro de qué es la analítica avanzada, cuándo usarla y cómo empezar a aplicarla en tu contexto.",
      formatoDetalle: "1 PDF descargable",
      duracion: "Autoestudio · diseñado para leerse en orden una vez y usarse como referencia después",
      nivel: "Todos los niveles",
      badges: ["Descarga instantánea", "Acceso de por vida"],
    },
  },
  {
    id: "gestion-del-tiempo-con-datos",
    nombre: "Gestión del Tiempo con Datos",
    resumen:
      "Estrategia para optimizar tu productividad combinando evidencia científica con un enfoque humano, no solo trucos de productividad genéricos.",
    formato: "PDF",
    precio: 9,
    precioLista: 15,
    stripePriceId: "",
    checkoutUrl: rutaCheckout("product", "gestion-del-tiempo-con-datos"),
    archivos: [{ nombre: "gestion-del-tiempo-con-datos.pdf", blobPath: "" }],
    detalle: {
      eyebrow: "Toolkit 05 · Productividad basada en evidencia",
      hook: "Menos trucos de productividad genéricos, más estrategia basada en cómo realmente funcionan tu tiempo y tu atención.",
      paraQuien: [
        "Sientes que el día no te alcanza aunque ya probaste varias apps y métodos.",
        "Prefieres entender el porqué detrás de una técnica antes de adoptarla.",
        "Buscas un enfoque humano, no solo optimizar minutos.",
      ],
      incluye: [
        "PDF completo de 137 páginas.",
        "Fundamentos basados en evidencia científica, explicados en lenguaje simple.",
        "Estrategias aplicables desde el primer capítulo.",
      ],
      resultado:
        "Terminas con un sistema propio para gestionar tu tiempo, basado en evidencia y no en trucos de moda.",
      formatoDetalle: "1 PDF descargable",
      duracion: "Autoestudio · diseñado para leerse en orden una vez y usarse como referencia después",
      nivel: "Todos los niveles",
      badges: ["Descarga instantánea", "Acceso de por vida"],
    },
  },
  {
    id: "retail-analytics-claude",
    nombre: "Retail Analytics con Claude",
    resumen:
      "Skills y prompts listos para usar Claude como copiloto de analítica retail en el día a día.",
    formato: "Kit de skills",
    precio: 15,
    precioLista: 25,
    stripePriceId: "",
    checkoutUrl: rutaCheckout("product", "retail-analytics-claude"),
    archivos: [
      { nombre: "retail-analytics-claude-kit.zip", blobPath: "" },
      { nombre: "retail-analytics-claude-guia.pdf", blobPath: "" },
    ],
    detalle: {
      eyebrow: "Toolkit 06 · IA aplicada a retail",
      hook: "Skills listas para instalar en Claude y convertirlo en tu copiloto de analítica retail — no prompts sueltos, un kit completo.",
      paraQuien: [
        "Usas Claude (o quieres empezar a usarlo) para trabajo real de analítica retail.",
        "Quieres skills ya probadas en vez de reinventar prompts desde cero cada vez.",
        "Buscas instrucciones de instalación claras, no solo un archivo de texto.",
      ],
      incluye: [
        "Kit de skills en .zip, listo para instalar.",
        "Guía de instalación en PDF, paso a paso.",
      ],
      resultado:
        "Terminas con Claude configurado como copiloto de analítica retail, listo para usarse en tu trabajo del día a día.",
      formatoDetalle: "1 archivo .zip + 1 PDF de instalación",
      duracion: "Instalación en minutos",
      nivel: "Todos los niveles",
      badges: ["Descarga instantánea", "Acceso de por vida"],
    },
  },
  {
    id: "modelo-punto-venta",
    nombre: "Modelo analítico de punto de venta",
    resumen:
      "Framework para estructurar un modelo analítico de punto de venta de principio a fin, con datos de ejemplo, tema visual y medidas DAX ya escritas.",
    formato: "Kit completo",
    precio: 15,
    precioLista: 25,
    stripePriceId: "",
    checkoutUrl: rutaCheckout("product", "modelo-punto-venta"),
    archivos: [
      { nombre: "modelo-punto-venta-datos.xlsx", blobPath: "" },
      { nombre: "modelo-punto-venta-tema.json", blobPath: "" },
      { nombre: "modelo-punto-venta-medidas.dax", blobPath: "" },
      { nombre: "modelo-punto-venta-guia.pdf", blobPath: "" },
    ],
    detalle: {
      eyebrow: "Toolkit 07 · Modelo de datos de retail",
      hook: "El framework completo para armar un modelo analítico de punto de venta en Power BI, de principio a fin — no solo teoría, los archivos listos para usar.",
      paraQuien: [
        "Necesitas estructurar un modelo de punto de venta y no quieres empezar de cero.",
        "Quieres un tema visual y medidas DAX ya escritas como punto de partida.",
        "Prefieres aprender armando el modelo real, con datos de ejemplo incluidos.",
      ],
      incluye: [
        "Datos de ejemplo de punto de venta en Excel.",
        "Tema visual de Power BI listo para aplicar (.json).",
        "Medidas DAX ya escritas (.dax).",
        "Guía en PDF de cómo armar el modelo paso a paso.",
      ],
      resultado:
        "Terminas con un modelo analítico de punto de venta armado y funcionando, con el criterio para adaptarlo a tus propios datos.",
      formatoDetalle: "4 archivos: Excel, tema .json, medidas .dax y guía en PDF",
      duracion: "Autoestudio · armado guiado paso a paso",
      nivel: "Intermedio",
      badges: ["Descarga instantánea", "Acceso de por vida", "4 archivos"],
    },
  },
  {
    id: "excel-finanzas",
    nombre: "Excel & Finanzas Caseras",
    resumen:
      "Plantillas de Excel listas para usar y el manual de finanzas personales, para ordenar números rápido.",
    formato: "Plantillas + Manual",
    precio: 9,
    precioLista: 15,
    stripePriceId: "",
    checkoutUrl: rutaCheckout("product", "excel-finanzas"),
    archivos: [
      { nombre: "finanzas-caseras-manual.pdf", blobPath: "" },
      { nombre: "plantilla-habitos.xlsx", blobPath: "" },
      { nombre: "plantilla-gestion-proyectos.xlsx", blobPath: "" },
      { nombre: "plantilla-task-tracker.xlsx", blobPath: "" },
    ],
    detalle: {
      eyebrow: "Toolkit 08 · Finanzas y productividad personal",
      hook: "Plantillas de Excel ya armadas, sin tener que construirlas desde cero, más el manual que explica cómo usarlas para ordenar tus finanzas.",
      paraQuien: [
        "Quieres ordenar tus finanzas personales sin construir una hoja de cálculo desde cero.",
        "Prefieres plantillas ya probadas en vez de tutoriales genéricos de Excel.",
        "Buscas también organizar hábitos y proyectos personales, no solo dinero.",
      ],
      incluye: [
        "Manual de finanzas caseras en PDF.",
        "Plantilla de hábitos en Excel.",
        "Plantilla de gestión de proyectos en Excel.",
        "Plantilla de task tracker en Excel.",
      ],
      resultado:
        "Terminas con tus finanzas, hábitos y proyectos personales organizados en plantillas que puedes usar desde el primer día.",
      formatoDetalle: "1 PDF + 3 plantillas de Excel",
      duracion: "Uso inmediato",
      nivel: "Todos los niveles",
      badges: ["Descarga instantánea", "Acceso de por vida", "3 plantillas"],
    },
  },
  {
    id: "prompting-profesional",
    nombre: "Prompting Profesional",
    resumen:
      "Manual para escribir prompts que de verdad rinden en trabajo real de datos y negocio.",
    formato: "Manual",
    precio: 9,
    precioLista: 15,
    stripePriceId: "",
    checkoutUrl: rutaCheckout("product", "prompting-profesional"),
    archivos: [{ nombre: "prompting-profesional-manual.pdf", blobPath: "" }],
    detalle: {
      eyebrow: "Toolkit 09 · IA aplicada al trabajo",
      hook: "Prompts que rinden en trabajo real de datos y negocio, no ejemplos de juguete.",
      paraQuien: [
        "Usas IA generativa en tu trabajo pero sientes que no le sacas todo el rendimiento.",
        "Quieres estructura y criterio para escribir prompts, no una lista de ejemplos sueltos.",
        "Trabajas en datos, analítica o negocio y necesitas prompts que resuelvan problemas reales.",
      ],
      incluye: ["Manual completo en PDF."],
      resultado:
        "Terminas con un método propio para escribir prompts profesionales, aplicable a cualquier herramienta de IA generativa.",
      formatoDetalle: "1 PDF descargable",
      duracion: "Autoestudio",
      nivel: "Todos los niveles",
      badges: ["Descarga instantánea", "Acceso de por vida"],
    },
  },
  {
    id: "plantillas-powerpoint",
    nombre: "5 Plantillas Ejecutivas PowerPoint",
    resumen:
      "Plantillas listas para reportes ejecutivos: informe mensual, revisión trimestral (QBR), hallazgos de análisis de datos, resultados de iniciativa y propuesta a comité de inversión.",
    formato: "Plantillas PPT",
    precio: 9,
    precioLista: 15,
    stripePriceId: "",
    checkoutUrl: rutaCheckout("product", "plantillas-powerpoint"),
    archivos: [
      { nombre: "plantilla-ppt-informe-mensual.pptx", blobPath: "" },
      { nombre: "plantilla-ppt-revision-qbr.pptx", blobPath: "" },
      { nombre: "plantilla-ppt-hallazgos-analisis.pptx", blobPath: "" },
      { nombre: "plantilla-ppt-resultados-iniciativa.pptx", blobPath: "" },
      { nombre: "plantilla-ppt-propuesta-comite.pptx", blobPath: "" },
    ],
    detalle: {
      eyebrow: "Toolkit 10 · Comunicación ejecutiva",
      hook: "Las 5 presentaciones que más se repiten en cualquier rol de datos o negocio, ya armadas — deja de reconstruir el mismo formato cada mes.",
      paraQuien: [
        "Presentas resultados de datos o negocio con regularidad y siempre partes de cero.",
        "Quieres un formato consistente para reportes mensuales y trimestrales.",
        "Necesitas llevar una propuesta de inversión en datos a un comité, con una estructura que ya funciona.",
      ],
      incluye: [
        "Informe mensual de resultados.",
        "Revisión trimestral (QBR).",
        "Hallazgos de análisis de datos.",
        "Resultados de iniciativa.",
        "Propuesta a comité de inversión en datos.",
      ],
      resultado:
        "Terminas con 5 plantillas reutilizables mes tras mes, sin tener que rearmar el formato cada vez que presentas.",
      formatoDetalle: "5 archivos .pptx editables",
      duracion: "Uso inmediato",
      nivel: "Todos los niveles",
      badges: ["Descarga instantánea", "Acceso de por vida", "5 plantillas"],
    },
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
    stripePriceId: "price_1U6dv1Go6ysKHu77daJyAend",
    checkoutUrl: rutaCheckout("bundle", "bundle-sql-powerbi"),
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

/* ============================================================
   Helpers de servidor — usados por /api/checkout y el webhook de
   Stripe para resolver qué se vende y qué archivos se entregan.
   ============================================================ */

/** Producto o bundle comprable por `type` ("product" | "bundle") + `id`. */
export function getCheckoutItem(type, id) {
  if (type === "bundle") {
    return TOOLKIT_BUNDLES.find((b) => b.id === id) || null;
  }
  return TOOLKIT_PRODUCTOS.find((p) => p.id === id) || null;
}

/** Lista de archivos a entregar para un `type`+`id` comprado. Para un
 *  bundle, junta (sin duplicar) los archivos de todos los productos
 *  que cubre. */
export function getArchivosEntrega(type, id) {
  if (type === "bundle") {
    const bundle = TOOLKIT_BUNDLES.find((b) => b.id === id);
    if (!bundle) return [];
    const vistos = new Set();
    const archivos = [];
    for (const productoId of bundle.ids) {
      const producto = TOOLKIT_PRODUCTOS.find((p) => p.id === productoId);
      for (const archivo of producto?.archivos || []) {
        if (vistos.has(archivo.nombre)) continue;
        vistos.add(archivo.nombre);
        archivos.push(archivo);
      }
    }
    return archivos;
  }
  const producto = TOOLKIT_PRODUCTOS.find((p) => p.id === id);
  return producto?.archivos || [];
}

/** Busca el pathname (en el store PRIVADO de Vercel Blob) de un
 *  archivo por nombre, pero SOLO entre los productos que la orden
 *  realmente cubre (`productIds`) — así un token válido para un
 *  producto no puede usarse para pedir el archivo de otro. */
export function getArchivoBlobPath(productIds, nombreArchivo) {
  for (const productoId of productIds) {
    const producto = TOOLKIT_PRODUCTOS.find((p) => p.id === productoId);
    const archivo = producto?.archivos?.find((a) => a.nombre === nombreArchivo);
    if (archivo) return archivo.blobPath || null;
  }
  return null;
}

/** IDs de producto "planos" cubiertos por una compra (expande el
 *  bundle a sus productos individuales). Se guarda en la orden. */
export function getProductIdsCubiertos(type, id) {
  if (type === "bundle") {
    const bundle = TOOLKIT_BUNDLES.find((b) => b.id === id);
    return bundle?.ids || [];
  }
  return [id];
}
