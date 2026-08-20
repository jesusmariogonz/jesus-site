/* ============================================================
   Catálogo de "The Toolkit" — cobros vía Stripe
   ------------------------------------------------------------
   Cada producto/bundle necesita `stripePriceId` (el ID del Price
   creado en Stripe, empieza con "price_..."). Mientras esté vacío
   ("") el producto se muestra como "Próximamente" en vez del botón
   de compra — igual que antes con `checkoutUrl` de Lemon Squeezy.

   `checkoutUrl` ahora ya NO es un link externo: apunta a la ruta
   interna /api/checkout, que crea la sesión de Stripe en el
   servidor y redirige. No lo edites a mano — se genera con
   `rutaCheckout()` más abajo a partir del `id`.

   `archivos`: lista de los PDFs/zips que se entregan al comprar
   este producto, subidos a un store PRIVADO de Vercel Blob (NO al
   repo — el repo es público). Cada entrada es { nombre, blobPath }
   — el pathname dentro del store (ej. "toolkit/archivo.pdf"), NO
   una URL pública. Súbelos con scripts/subir-archivo-toolkit.mjs y
   pega aquí el `blobPath` que te devuelva.

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
      { nombre: "dataset-punto-de-venta.zip", blobPath: "" },
      { nombre: "recetario.sql", blobPath: "" },
      { nombre: "guia-recetario.pdf", blobPath: "" },
      { nombre: "fundamentos.pdf", blobPath: "" },
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
