/* ============================================================
   Catálogo de "The Toolkit"
   ------------------------------------------------------------
   Cuando tengas cada producto cargado en Lemon Squeezy, copia su
   "Checkout Link" (o su "Product/Variant ID" si usas el overlay
   de Lemon.js) y pégalo en `checkoutUrl`. Mientras esté vacío
   ("") el producto se muestra como "Próximamente" en vez del
   botón de compra.
   ============================================================ */

export const TOOLKIT_PRODUCTOS = [
  {
    id: "power-bi",
    nombre: "Power BI de Cero a Hero",
    resumen:
      "Curso práctico para construir dashboards de analítica desde cero, con buenas prácticas de modelado.",
    formato: "Curso + PDF",
    precio: 9.99,
    precioLista: 24.99,
    checkoutUrl: "https://jgonzalez.lemonsqueezy.com/checkout/buy/2f5dd473-1fa6-465b-a4e9-903db0fba8c4",
    detalle: {
      eyebrow: "Toolkit 01 · Business Intelligence",
      hook: "De datos sueltos a un dashboard que se ve —y se usa— como el de un analista senior.",
      paraQuien: [
        "Vienes de Excel y quieres dar el salto a Power BI sin perderte en tutoriales inconexos.",
        "Ya usas Power BI pero tus reportes se sienten lentos, feos o difíciles de mantener.",
        "Quieres un caso real de retail/ventas para practicar, no datos de juguete.",
      ],
      incluye: [
        "Curso en video, de cero a modelo funcionando (Power Query → modelo → DAX → visuales).",
        "Caso práctico completo con datos tipo ventas retail, igual que en un proyecto real.",
        "PDF de referencia rápida: patrones de modelado estrella, medidas DAX más usadas y errores comunes.",
        "Plantilla .pbix de arranque para no empezar de una página en blanco.",
      ],
      resultado:
        "Al terminar tienes un dashboard propio, publicable, y el criterio para construir el siguiente sin depender de tutoriales.",
      formatoDetalle: "6 módulos en video + PDF de referencia + plantilla .pbix",
      duracion: "≈ 3.5 horas de contenido",
      nivel: "Principiante → intermedio",
      badges: ["Descarga instantánea", "Acceso de por vida", "Plantilla .pbix incluida"],
    },
  },
  {
    id: "sql-retail",
    nombre: "SQL for Retail",
    resumen:
      "Kit completo de consultas y ejercicios SQL aplicados a analítica de retail y punto de venta.",
    formato: "Kit completo",
    precio: 15,
    checkoutUrl: "",
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

export const TOOLKIT_BUNDLE = {
  id: "bundle-completo",
  nombre: "Bundle completo — los 6 recursos",
  resumen:
    "Todo The Toolkit en un solo paquete: Power BI, SQL for Retail, Retail Analytics con Claude, Modelo de punto de venta, Excel & Finanzas y Prompting Profesional.",
  precio: 49,
  precioLista: 82,
  checkoutUrl: "",
};
