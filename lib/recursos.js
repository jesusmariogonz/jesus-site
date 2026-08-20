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
    cover: "/recursos/covers/framing.jpg",
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
    id: "los-primeros-5-minutos-revelan-tu-seniority",
    titulo: "Los primeros 5 minutos de una reunión revelan tu seniority",
    subtitulo: "Manual visual: cinco señales silenciosas que los líderes leen antes de que digas una palabra",
    resumen:
      "Un manual visual corto: las cinco señales que se leen en silencio en los primeros minutos de una reunión, y el mecanismo exacto para dominarlas.",
    archivo: "/recursos/los-primeros-5-minutos-revelan-tu-seniority.pdf",
    paginas: 10,
    detalle: {
      eyebrow: "Manual visual · Comunicación ejecutiva",
      hook: "La sala te evalúa antes de que hables. Antes de exponer una sola idea, ya se está formando una impresión sobre tu nivel — y esa impresión rara vez se corrige después.",
      paraQuien: [
        "Entras a reuniones donde tu nivel se juzga antes de que digas tu primera idea.",
        "Quieres entender el mecanismo detrás de la primera impresión, no solo \"tips\" sueltos.",
        "Buscas un checklist aplicable a tu próxima reunión, no una teoría abstracta.",
      ],
      incluye: [
        "Manual visual de 10 páginas.",
        "Las cinco señales que se leen antes de hablar.",
        "El error común: hablar temprano vs. hablar mucho.",
        "Checklist de aplicación para tu próxima reunión.",
      ],
      resultado:
        "Terminas con un mecanismo concreto para las cinco señales que definen cómo te perciben en los primeros minutos de cualquier reunión.",
    },
  },
];

/* Nota: "El Problema del Framing" también vive por ahora en The
   Toolkit (gratis por tiempo limitado, vía checkout de Lemon
   Squeezy). Se dejó a propósito en ambos lugares — pendiente
   quitarlo de uno de los dos más adelante.

   "La Analítica Avanzada" y "Gestión del Tiempo con Datos" se
   movieron de aquí (gratis) a lib/toolkit.js (de pago, vía
   Stripe) — sus archivos ya NO viven en public/recursos/. */
