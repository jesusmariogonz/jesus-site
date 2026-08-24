/* ============================================================
   Catálogo de "The Toolkit" — kits, plantillas y cursos (de pago)
   ------------------------------------------------------------
   Los libros ya NO viven aquí — están todos en Biblioteca
   (lib/recursos.js), gratis o de pago. Aquí solo quedan kits,
   plantillas y cursos.

   Cada producto/bundle necesita `stripePriceId` (el ID del Price
   creado en Stripe, empieza con "price_..."). Mientras esté vacío
   ("") el producto se muestra como "Próximamente" en vez del botón
   de compra. Usa scripts/crear-precios-stripe.mjs para generarlos.

   `checkoutUrl` apunta a la ruta interna /api/checkout, que crea
   la sesión de Stripe en el servidor y redirige. No lo edites a
   mano — se genera con `rutaCheckout()` a partir del `id`. Los
   libros de Biblioteca usan la misma función con type="libro".

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

import { LIBROS } from "./recursos.js";

export function rutaCheckout(tipo, id) {
  return `/api/checkout?type=${tipo}&id=${id}`;
}

export const TOOLKIT_PRODUCTOS = [
  {
    id: "power-bi",
    nombre: "Power BI de Cero a Hero",
    resumen:
      "Curso completo en PDF para construir un modelo de Power BI desde cero, con buenas prácticas de modelado y DAX.",
    formato: "PDF",
    imagen: "/images/toolkit/power-bi.jpg",
    precio: 219,
    precioLista: 349,
    stripePriceId: "price_1U86Z4Go6ysKHu77RVECeAuz",
    checkoutUrl: rutaCheckout("product", "power-bi"),
    archivos: [{ nombre: "power-bi-de-cero-a-hero.pdf", blobPath: "toolkit/power-bi-de-cero-a-hero.pdf" }],
    detalle: {
      eyebrow: "Toolkit 01 · Business Intelligence",
      hook: "Lo que normalmente te toma semanas de prueba y error (o un curso de varios cientos de dólares), aquí en un PDF que puedes releer las veces que necesites — para dejar de improvisar dashboards y empezar a publicar modelos que tu equipo de verdad usa.",
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
        "Al terminar publicas tu primer modelo de Power BI en producción sin pagarle a nadie más por hacerlo, y sin depender de tutoriales sueltos para el siguiente. Es la diferencia entre \"sé dar clics en Power BI\" y \"puedo modelar los datos de mi área\" en tu próxima revisión de desempeño.",
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
    imagen: "/images/toolkit/sql-retail.jpg",
    precio: 239,
    precioLista: 539,
    stripePriceId: "price_1U86Z5Go6ysKHu77xjXVRRjy",
    checkoutUrl: rutaCheckout("product", "sql-retail"),
    archivos: [
      { nombre: "sql-retail-dataset.zip", blobPath: "toolkit/sql-retail-dataset.zip" },
      { nombre: "sql-retail-recetario.sql", blobPath: "toolkit/sql-retail-recetario.sql" },
      { nombre: "sql-retail-guia.pdf", blobPath: "toolkit/sql-retail-guia.pdf" },
      { nombre: "sql-retail-fundamentos.pdf", blobPath: "toolkit/sql-retail-fundamentos.pdf" },
    ],
    detalle: {
      eyebrow: "Toolkit 02 · SQL & Retail Analytics",
      hook: "No es un curso de SQL. Es el atajo para no perder días armando a mano las 22 consultas que cualquier analista de retail tiene que resolver tarde o temprano — ya escritas, probadas y explicadas.",
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
        "Al terminar tienes 22 consultas resueltas que copias, adaptas a tu propio punto de venta y entregas el mismo día — en vez de las horas (o días) que te tomaría escribirlas y depurarlas desde cero — más la teoría para defenderlas cuando tu jefe o tu equipo pregunte \"¿y por qué está escrito así?\".",
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
    imagen: "/images/toolkit/retail-analytics-claude.jpg",
    precio: 279,
    precioLista: 459,
    stripePriceId: "price_1U86Z5Go6ysKHu771nRMgTbI",
    checkoutUrl: rutaCheckout("product", "retail-analytics-claude"),
    archivos: [
      { nombre: "retail-analytics-claude-kit.zip", blobPath: "toolkit/retail-analytics-claude-kit.zip" },
      { nombre: "retail-analytics-claude-guia.pdf", blobPath: "toolkit/retail-analytics-claude-guia.pdf" },
    ],
    detalle: {
      eyebrow: "Toolkit 03 · IA aplicada a retail",
      hook: "Deja de escribirle el mismo prompt largo a Claude cada vez que necesitas un análisis: instala el kit una vez y recupera minutos en cada tarea de analítica retail que hoy haces a mano.",
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
        "Terminas con Claude configurado como copiloto de analítica retail: las tareas que antes te tomaban armar desde cero cada vez (limpiar un reporte, interpretar una caída de ventas, redactar un hallazgo) ahora las resuelves con una instrucción ya probada, no un prompt improvisado.",
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
    imagen: "/images/toolkit/modelo-punto-venta.jpg",
    precio: 279,
    precioLista: 459,
    stripePriceId: "price_1U86Z5Go6ysKHu77lWTSqYrT",
    checkoutUrl: rutaCheckout("product", "modelo-punto-venta"),
    archivos: [
      { nombre: "modelo-punto-venta-datos.xlsx", blobPath: "toolkit/modelo-punto-venta-datos.xlsx" },
      { nombre: "modelo-punto-venta-tema.json", blobPath: "toolkit/modelo-punto-venta-tema.json" },
      { nombre: "modelo-punto-venta-medidas.dax", blobPath: "toolkit/modelo-punto-venta-medidas.dax" },
      { nombre: "modelo-punto-venta-guia.pdf", blobPath: "toolkit/modelo-punto-venta-guia.pdf" },
    ],
    detalle: {
      eyebrow: "Toolkit 04 · Modelo de datos de retail",
      hook: "Construir esto desde cero — datos de ejemplo, tema visual y medidas DAX — te toma días. Aquí lo tienes listo para abrir y adaptar a tu propio punto de venta en una tarde.",
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
        "Terminas con un modelo analítico de punto de venta armado y funcionando — el tema visual y las medidas DAX ya no los construyes tú, los adaptas — y con el criterio para modificarlo cuando cambien tus propios datos.",
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
    imagen: "/images/toolkit/excel-finanzas.jpg",
    precio: 169,
    precioLista: 279,
    stripePriceId: "price_1U86Z6Go6ysKHu77QKHSiX7x",
    checkoutUrl: rutaCheckout("product", "excel-finanzas"),
    archivos: [
      { nombre: "finanzas-caseras-manual.pdf", blobPath: "toolkit/finanzas-caseras-manual.pdf" },
      { nombre: "plantilla-habitos.xlsx", blobPath: "toolkit/plantilla-habitos.xlsx" },
      { nombre: "plantilla-gestion-proyectos.xlsx", blobPath: "toolkit/plantilla-gestion-proyectos.xlsx" },
      { nombre: "plantilla-task-tracker.xlsx", blobPath: "toolkit/plantilla-task-tracker.xlsx" },
    ],
    detalle: {
      eyebrow: "Toolkit 05 · Finanzas y productividad personal",
      hook: "Antes de pagarle a un asesor financiero por algo que puedes resolver tú mismo en una tarde: plantillas ya armadas y el manual que te dice exactamente cómo usarlas.",
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
        "Terminas con tus finanzas, hábitos y proyectos personales organizados desde el primer día — el costo del kit se paga solo con evitar un mes de gastos hormiga que ya no ves porque nadie los está registrando.",
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
    imagen: "/images/toolkit/prompting-profesional.jpg",
    precio: 169,
    precioLista: 279,
    stripePriceId: "price_1U86Z6Go6ysKHu77SJzw2RRs",
    checkoutUrl: rutaCheckout("product", "prompting-profesional"),
    archivos: [{ nombre: "prompting-profesional-manual.pdf", blobPath: "toolkit/prompting-profesional-manual.pdf" }],
    detalle: {
      eyebrow: "Toolkit 06 · IA aplicada al trabajo",
      hook: "Ya pagas la suscripción a una IA generativa. Este manual es la diferencia entre usarla para respuestas genéricas y sacarle el rendimiento que justifica ese gasto mensual en trabajo real de datos y negocio.",
      paraQuien: [
        "Usas IA generativa en tu trabajo pero sientes que no le sacas todo el rendimiento.",
        "Quieres estructura y criterio para escribir prompts, no una lista de ejemplos sueltos.",
        "Trabajas en datos, analítica o negocio y necesitas prompts que resuelvan problemas reales.",
      ],
      incluye: ["Manual completo en PDF."],
      resultado:
        "Terminas con un método propio para escribir prompts profesionales, aplicable a cualquier herramienta de IA generativa — cada prompt bien escrito es una tarea que ya no repites tres veces hasta que la IA te entienda.",
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
    imagen: "/images/toolkit/plantillas-powerpoint.jpg",
    precio: 169,
    precioLista: 279,
    stripePriceId: "price_1U86Z7Go6ysKHu77ePJSHHJB",
    checkoutUrl: rutaCheckout("product", "plantillas-powerpoint"),
    archivos: [
      { nombre: "plantilla-ppt-informe-mensual.pptx", blobPath: "toolkit/plantilla-ppt-informe-mensual.pptx" },
      { nombre: "plantilla-ppt-revision-qbr.pptx", blobPath: "toolkit/plantilla-ppt-revision-qbr.pptx" },
      { nombre: "plantilla-ppt-hallazgos-analisis.pptx", blobPath: "toolkit/plantilla-ppt-hallazgos-analisis.pptx" },
      { nombre: "plantilla-ppt-resultados-iniciativa.pptx", blobPath: "toolkit/plantilla-ppt-resultados-iniciativa.pptx" },
      { nombre: "plantilla-ppt-propuesta-comite.pptx", blobPath: "toolkit/plantilla-ppt-propuesta-comite.pptx" },
    ],
    detalle: {
      eyebrow: "Toolkit 07 · Comunicación ejecutiva",
      hook: "Cada mes rearmas el mismo formato de presentación desde cero. Estas 5 plantillas te devuelven esas horas: abres, llenas tus datos y presentas.",
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
        "Terminas con 5 plantillas reutilizables mes tras mes: la próxima vez que te pidan un reporte con dos días de anticipación, ya tienes el formato — solo falta tu contenido.",
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
    precio: 335,
    precioLista: 458, // suma de precios individuales (219 + 239)
    stripePriceId: "price_1U86Z7Go6ysKHu77CugWoDoL",
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
   Type puede ser "product"/"bundle" (The Toolkit) o "libro"
   (Biblioteca, ver lib/recursos.js).
   ============================================================ */

function buscarProducto(id) {
  return TOOLKIT_PRODUCTOS.find((p) => p.id === id) || LIBROS.find((l) => l.id === id) || null;
}

/** Producto, libro o bundle comprable por `type` + `id`. */
export function getCheckoutItem(type, id) {
  if (type === "bundle") {
    return TOOLKIT_BUNDLES.find((b) => b.id === id) || null;
  }
  if (type === "libro") {
    return LIBROS.find((l) => l.id === id) || null;
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
      const producto = buscarProducto(productoId);
      for (const archivo of producto?.archivos || []) {
        if (vistos.has(archivo.nombre)) continue;
        vistos.add(archivo.nombre);
        archivos.push(archivo);
      }
    }
    return archivos;
  }
  return buscarProducto(id)?.archivos || [];
}

/** Busca el pathname (en el store PRIVADO de Vercel Blob) de un
 *  archivo por nombre, pero SOLO entre los productos que la orden
 *  realmente cubre (`productIds`) — así un token válido para un
 *  producto no puede usarse para pedir el archivo de otro. */
export function getArchivoBlobPath(productIds, nombreArchivo) {
  for (const productoId of productIds) {
    const archivo = buscarProducto(productoId)?.archivos?.find((a) => a.nombre === nombreArchivo);
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
