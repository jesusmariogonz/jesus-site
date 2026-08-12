/* ============================================================
   Biblioteca (libros de descarga directa)
   ------------------------------------------------------------
   A diferencia de The Toolkit, esto NO se vende: son libros que
   regalas para atraer visitas y suscriptores. Sin checkoutUrl,
   sin precio: solo un link de descarga directa al PDF dentro de
   /public/recursos.

   Para agregar uno nuevo:
   1. Pon el PDF en /public/recursos/tu-archivo.pdf
   2. Agrega un objeto aquí abajo con su info y su `detalle`
      (misma idea que en lib/toolkit.js, para la página de
      explicación de cada libro).
   ============================================================ */

export const LIBROS = [
  {
    id: "el-problema-del-framing",
    titulo: "El Problema del Framing",
    subtitulo: "Un toolkit de framing para datos, IA y negocio",
    resumen:
      "Cómo decidir qué importa cuando todo cambia. 30 capítulos con ejemplos reales y el Framework Canvas para hacer explícitos los supuestos detrás de cualquier modelo o decisión.",
    archivo: "/recursos/el-problema-del-framing.pdf",
    paginas: 210,
    detalle: {
      eyebrow: "Libro · Framework de decisión",
      hook: "Por qué un modelo que funcionaba perfecto en el papel falla en producción, y por qué dos áreas de la misma empresa interpretan el mismo dato distinto.",
      paraQuien: [
        "Diseñas sistemas, modelos o procesos que deben seguir siendo válidos cuando el negocio cambia.",
        "Presentaste un plan perfecto que el mundo real desarmó en una semana, y quieres entender por qué.",
        "Lideras un equipo de datos, producto o IA y necesitas un lenguaje común para discutir supuestos.",
      ],
      incluye: [
        "PDF completo de 210 páginas, 30 capítulos.",
        "Cada capítulo cierra con un ejemplo real (anonimizado) y un ejercicio aplicable de inmediato.",
        "Framework Canvas de 6 secciones, pensado para completarse en equipo sin jerga técnica.",
      ],
      resultado:
        "Terminas con vocabulario y un canvas concretos para hacer explícitos los supuestos detrás de cualquier modelo, dashboard o proceso, antes de que el negocio los rompa por ti.",
    },
  },
  {
    id: "la-analitica-avanzada",
    titulo: "La Analítica Avanzada",
    subtitulo: "Fundamentos, Implementación y Aplicaciones en la Industria",
    resumen:
      "Guía completa para entender y aplicar analítica avanzada en un negocio real: desde los fundamentos hasta casos de implementación por industria.",
    archivo: "/recursos/la-analitica-avanzada.pdf",
    paginas: 176,
    detalle: {
      eyebrow: "Libro · Analítica avanzada",
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
    },
  },
  {
    id: "gestion-del-tiempo-con-datos",
    titulo: "Gestión del Tiempo con Datos",
    subtitulo: "Un enfoque científico, humano y basado en evidencia",
    resumen:
      "Estrategia para optimizar tu productividad combinando evidencia científica con un enfoque humano, no solo trucos de productividad genéricos.",
    archivo: "/recursos/gestion-del-tiempo-con-datos.pdf",
    paginas: 137,
    detalle: {
      eyebrow: "Libro · Productividad basada en evidencia",
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
    },
  },
];

/* Nota: "El Problema del Framing" también vive por ahora en The
   Toolkit (gratis por tiempo limitado, vía checkout de Lemon
   Squeezy). Se dejó a propósito en ambos lugares — pendiente
   quitarlo de uno de los dos más adelante. */
