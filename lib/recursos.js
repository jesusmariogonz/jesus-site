/* ============================================================
   Recursos gratuitos ("lead magnets")
   ------------------------------------------------------------
   A diferencia de The Toolkit, esto NO se vende: son libros /
   guías que regalas para atraer visitas y suscriptores. Sin
   checkoutUrl, sin precio: solo un link de descarga directa al
   PDF dentro de /public/recursos.

   Para agregar uno nuevo:
   1. Pon el PDF en /public/recursos/tu-archivo.pdf
   2. Agrega un objeto aquí abajo con su info.
   ============================================================ */

export const RECURSOS_GRATUITOS = [
  {
    id: "la-analitica-avanzada",
    titulo: "La Analítica Avanzada",
    subtitulo: "Fundamentos, Implementación y Aplicaciones en la Industria",
    resumen:
      "Guía completa para entender y aplicar analítica avanzada en un negocio real: desde los fundamentos hasta casos de implementación por industria.",
    archivo: "/recursos/la-analitica-avanzada.pdf",
    paginas: 176,
  },
  {
    id: "gestion-del-tiempo-con-datos",
    titulo: "Gestión del Tiempo con Datos",
    subtitulo: "Un enfoque científico, humano y basado en evidencia",
    resumen:
      "Estrategia para optimizar tu productividad combinando evidencia científica con un enfoque humano, no solo trucos de productividad genéricos.",
    archivo: "/recursos/gestion-del-tiempo-con-datos.pdf",
    paginas: 137,
  },
];

/* Nota: "El Problema del Framing" ya vive en The Toolkit (gratis por
   tiempo limitado, vía checkout de Lemon Squeezy) — no se duplica
   aquí para no tener dos flujos de descarga distintos del mismo PDF. */
