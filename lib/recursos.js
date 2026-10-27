/* ============================================================
   Biblioteca — TODOS los libros, gratis y de pago
   ------------------------------------------------------------
   Antes esto era solo el catálogo gratuito y los libros de pago
   vivían en The Toolkit. Ahora un libro vive en un solo lugar
   (aquí), tenga precio o no — The Toolkit se quedó con kits,
   plantillas y cursos (lib/toolkit.js).

   Campos de un libro GRATIS: id, titulo, subtitulo, resumen,
   archivo (descarga directa desde /public), paginas, detalle.

   Campos EXTRA de un libro DE PAGO: precio, precioLista,
   stripePriceId (vacío = "Próximamente"), checkoutUrl (se genera
   con rutaCheckout()), archivos (PDFs en Vercel Blob privado, ver
   la nota grande en lib/toolkit.js sobre cómo subirlos).

   `variante`: qué motivo geométrico usa la portada (LibroCover).
   ============================================================ */

import { rutaCheckout } from "./toolkit.js";

export const LIBROS = [
  {
    id: "el-problema-del-framing",
    tema: "Negocio",
    landingUrl: "/el-problema-del-framing",
    imagenPortada: "/libros/el-problema-del-framing.jpg",
    categoria: "Business",
    titulo: "El Problema del Framing",
    subtitulo: "Un toolkit de framing para datos, IA y negocio",
    resumen:
      "Cómo decidir qué importa cuando todo cambia. 30 capítulos con ejemplos reales y el Framework Canvas para hacer explícitos los supuestos detrás de cualquier modelo o decisión.",
    archivo: "/recursos/el-problema-del-framing.pdf",
    paginas: 210,
    variante: "framing",
    detalle: {
      eyebrow: "Libro · Framework de decisión",
      hook: "El framework que evita que un proyecto de meses se caiga en la primera junta de revisión porque nadie hizo explícito un supuesto — gratis, sin correo ni registro.",
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
        "Terminas con vocabulario y un canvas concretos para hacer explícitos los supuestos detrás de cualquier modelo, dashboard o proceso — la próxima vez que un director pregunte \"¿y esto ya lo pensaron?\", tienes la respuesta antes de que la pregunta llegue.",
    },
  },
  {
    id: "control-cognitivo-empresarial",
    tema: "Negocio",
    imagenPortada: "/libros/control-cognitivo-empresarial.jpg",
    categoria: "Business",
    titulo: "Control Cognitivo Empresarial",
    subtitulo: "Los patrones ocultos detrás de quién influye, quién controla y quién decide",
    resumen:
      "Los patrones ocultos detrás de quién influye, quién controla y quién decide en una organización — con un capítulo dedicado a cómo la IA está cambiando esas reglas.",
    paginas: 124,
    variante: "cognitivo",
    precio: 349,
    precioLista: 629,
    stripePriceId: "price_1U86Z8Go6ysKHu770YmF3FI3",
    checkoutUrl: rutaCheckout("libro", "control-cognitivo-empresarial"),
    landingUrl: "/control-cognitivo-empresarial",
    archivos: [{ nombre: "control-cognitivo-empresarial.pdf", blobPath: "toolkit/control-cognitivo-empresarial.pdf" }],
    detalle: {
      eyebrow: "Libro insignia · Poder, psicología y decisiones",
      hook: "El libro insignia por una razón: es la diferencia entre seguir preguntándote por qué tus buenas ideas no avanzan, y entender por fin quién realmente decide en tu organización — para dejar de perder terreno frente a quien sí lo sabe.",
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
        "Terminas con un framework personal de control cognitivo: cómo leer el poder real en tu organización, construir influencia sin manipular, y dar retroalimentación difícil sin activar defensividad — el tipo de criterio que normalmente solo se adquiere después de años viendo cómo se juega el poder de cerca, no leyéndolo en un libro de liderazgo genérico.",
    },
  },
  {
    id: "la-analitica-avanzada",
    tema: "Datos",
    imagenPortada: "/libros/la-analitica-avanzada.jpg",
    categoria: "Analytics",
    titulo: "La Analítica Avanzada",
    subtitulo: "Fundamentos, Implementación y Aplicaciones en la Industria",
    resumen:
      "Guía completa para entender y aplicar analítica avanzada en un negocio real: desde los fundamentos hasta casos de implementación por industria.",
    paginas: 176,
    variante: "analitica",
    precio: 219,
    precioLista: 349,
    stripePriceId: "price_1U86Z9Go6ysKHu771K8GA09d",
    checkoutUrl: rutaCheckout("libro", "la-analitica-avanzada"),
    landingUrl: "/la-analitica-avanzada",
    archivos: [{ nombre: "la-analitica-avanzada.pdf", blobPath: "toolkit/la-analitica-avanzada.pdf" }],
    detalle: {
      eyebrow: "Libro · Analítica avanzada",
      hook: "Evita el error más caro en analítica: lanzar una iniciativa de meses y presupuesto sin tener claro para qué industria ni qué problema realmente resuelve.",
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
        "Terminas con un mapa claro de qué es la analítica avanzada, cuándo usarla y cómo empezar a aplicarla en tu contexto — suficiente criterio para defender (o frenar a tiempo) la próxima iniciativa de analítica que se proponga en tu mesa.",
    },
  },
  {
    id: "gestion-del-tiempo-con-datos",
    tema: "Productividad",
    imagenPortada: "/libros/gestion-del-tiempo-con-datos.jpg",
    categoria: "Business",
    titulo: "Gestión del Tiempo con Datos",
    subtitulo: "Un enfoque científico, humano y basado en evidencia",
    resumen:
      "Estrategia para optimizar tu productividad combinando evidencia científica con un enfoque humano, no solo trucos de productividad genéricos.",
    paginas: 137,
    variante: "tiempo",
    precio: 169,
    precioLista: 279,
    stripePriceId: "price_1U86Z9Go6ysKHu778XCwcKls",
    checkoutUrl: rutaCheckout("libro", "gestion-del-tiempo-con-datos"),
    landingUrl: "/gestion-del-tiempo-con-datos",
    archivos: [{ nombre: "gestion-del-tiempo-con-datos.pdf", blobPath: "toolkit/gestion-del-tiempo-con-datos.pdf" }],
    detalle: {
      eyebrow: "Libro · Productividad basada en evidencia",
      hook: "Ya probaste apps y métodos y el día te sigue sin alcanzar. Esto no es otro truco más: es entender por qué los trucos genéricos no funcionan para ti — para recuperar horas reales, no solo reordenar el mismo caos.",
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
        "Terminas con un sistema propio para gestionar tu tiempo, basado en evidencia y no en trucos de moda — el precio del libro se recupera con la primera semana en la que dejas de perder horas en el método equivocado.",
    },
  },
  {
    id: "los-primeros-5-minutos-revelan-tu-seniority",
    tema: "Productividad",
    landingUrl: "/los-primeros-5-minutos-revelan-tu-seniority",
    imagenPortada: "/libros/los-primeros-5-minutos-revelan-tu-seniority.jpg",
    categoria: "Business",
    titulo: "Los primeros 5 minutos de una reunión revelan tu seniority",
    subtitulo: "Manual visual: cinco señales silenciosas que los líderes leen antes de que digas una palabra",
    resumen:
      "Un manual visual corto: las cinco señales que se leen en silencio en los primeros minutos de una reunión, y el mecanismo exacto para dominarlas.",
    archivo: "/recursos/los-primeros-5-minutos-revelan-tu-seniority.pdf",
    paginas: 10,
    variante: "seniority",
    detalle: {
      eyebrow: "Manual visual · Comunicación ejecutiva",
      hook: "La sala te evalúa antes de que hables, y esa impresión rara vez se corrige después — puede ser la diferencia entre que te vean listo para el siguiente nivel o no. 10 páginas, gratis, léelo antes de tu próxima reunión importante.",
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
        "Terminas con un mecanismo concreto para las cinco señales que definen cómo te perciben en los primeros minutos de cualquier reunión — la clase de detalle que separa a quien ya está listo para el siguiente puesto de quien todavía no se nota.",
    },
  },
  {
    id: "el-cerebro-organizacional",
    tema: "Negocio",
    imagenPortada: "/libros/el-cerebro-organizacional.jpg",
    categoria: "Business",
    titulo: "El Cerebro Organizacional",
    subtitulo: "Colección de 7 libros — por qué tu empresa decide como decide",
    resumen:
      "7 libros, 7 capas, 56 mecanismos de neurociencia y ciencia de la decisión citados, con casos reales (Blockbuster, Kodak, NASA, Apolo 13) para rediseñar cómo decide tu organización.",
    paginas: 330,
    variante: "cerebro",
    precio: 325,
    precioLista: 0,
    stripePriceId: "price_1U8RHP1xdVreYBebphvUDact",
    checkoutUrl: rutaCheckout("libro", "el-cerebro-organizacional"),
    // La landing especial (diagrama de las 7 capas, detalle de cada libro) vive
    // en /el-cerebro-organizacional — este link reemplaza el de la página de
    // detalle estándar en las tarjetas de Biblioteca (ver RecursoCard.js).
    landingUrl: "/el-cerebro-organizacional",
    archivos: [
      { nombre: "1-el-cerebro-que-decide.pdf", blobPath: "" },
      { nombre: "2-vision-de-tunel.pdf", blobPath: "" },
      { nombre: "3-el-precio-del-sesgo.pdf", blobPath: "" },
      { nombre: "4-memoria-de-corto-plazo.pdf", blobPath: "" },
      { nombre: "5-piloto-automatico.pdf", blobPath: "" },
      { nombre: "6-instinto-de-manada.pdf", blobPath: "" },
      { nombre: "7-mas-alla-del-ci.pdf", blobPath: "" },
    ],
    detalle: {
      eyebrow: "Colección · Neurociencia & Datos",
      hook: "7 libros. 7 capas. Por qué tu empresa decide como decide — y cómo rediseñarlo con evidencia, no con opinión.",
      paraQuien: [
        "Líderes de datos, analytics e IA que necesitan que su equipo decida mejor, no solo que tenga mejores dashboards.",
        "Equipos de producto y estrategia cansados de repetir los mismos errores.",
        "Cualquiera responsable de que una nueva herramienta o práctica de IA se adopte de verdad, no solo se anuncie.",
      ],
      incluye: [
        "7 PDFs, ≈47-51 páginas cada uno, formato A5.",
        "56 mecanismos citados de investigación original (Kahneman, Klein, Woolley, Edmondson, Rogers, Argote y otros).",
        "7 casos históricos reales (Blockbuster, Kodak, JCPenney, NASA, vuelo 1549, Semmelweis, Apolo 13).",
        "Canvas descargable e imprimible al final de cada libro.",
      ],
      resultado:
        "Terminas con el modelo completo de las 7 capas del Cerebro Organizacional — de la decisión individual a la inteligencia colectiva — y el glosario de referencia rápida de los 56 mecanismos.",
    },
  },
  {
    id: "ai-solution-architect",
    tema: "IA",
    imagenPortada: "/libros/ai-solution-architect.jpg",
    categoria: "Architecture",
    titulo: "AI Solution Architect",
    subtitulo: "De LLMs y RAG a Agentes, Orquestación y Sistemas Inteligentes Empresariales",
    resumen:
      "La inteligencia artificial generativa no necesita otro manual de herramientas: necesita arquitectos que sepan diseñar sistemas confiables, escalables y gobernables. 23 capítulos, código Python ejecutable y el AI Architecture Stack para razonar sobre cualquier problema de IA generativa.",
    paginas: 452,
    previewPaginas: 15,
    variante: "stack",
    precio: 208,
    stripePriceId: "price_1US1hHGo6ysKHu77PXZI01YD",
    checkoutUrl: rutaCheckout("libro", "ai-solution-architect"),
    // Landing a medida (igual que El Cerebro Organizacional) en vez de la
    // página de detalle estándar — ver public/ai-solution-architect/index.html.
    landingUrl: "/ai-solution-architect",
    archivos: [{ nombre: "AI_Solution_Architect.pdf", blobPath: "toolkit/AI_Solution_Architect.pdf" }],
    detalle: {
      eyebrow: "Libro · AI Architecture Series",
      hook: "La IA generativa no necesita otro manual de herramientas: necesita arquitectos que sepan diseñar sistemas confiables, escalables y gobernables — este libro te lleva de los fundamentos a una arquitectura empresarial completa de Nivel 3.",
      paraQuien: [
        "Eres arquitecto de soluciones, ingeniero senior o líder técnico y ya dominas los fundamentos de sistemas distribuidos.",
        "Quieres entender por qué un sistema de IA generativa rompe con la arquitectura de software tradicional, no solo qué herramienta usar.",
        "Buscas diseñar — o evaluar — una arquitectura empresarial de IA con agentes especializados, orquestación, seguridad y gobierno, no un prototipo de demo.",
        "Prefieres un sistema de referencia completo con código ejecutable sobre una colección de tips sueltos de prompting.",
      ],
      incluye: [
        "23 capítulos que construyen de forma incremental un sistema de referencia completo: el Enterprise Intelligence Agent.",
        "Código Python ejecutable y diagramas de arquitectura en cada etapa del diseño.",
        "El AI Architecture Stack: una taxonomía propia para razonar sobre cualquier problema de IA generativa.",
        "Recorrido completo desde los fundamentos de LLMs y RAG hasta agentes, orquestación y arquitectura empresarial de Nivel 3.",
        "Código del proyecto disponible en GitHub (github.com/jesusmariogonz/Enterprise-Intelligence-Agent).",
      ],
      resultado:
        "Terminas con un sistema de referencia completo y ejecutable, y con el AI Architecture Stack como marco propio para diseñar — o auditar — la próxima generación de software: sistemas que no solo ejecutan, sino que razonan.",
    },
  },
  {
    id: "como-leer-el-mercado-fundamentos",
    tema: "Finanzas",
    landingUrl: "/recursos/como-leer-el-mercado",
    imagenPortada: "/libros/como-leer-el-mercado-fundamentos.jpg",
    categoria: "Mercados",
    titulo: "Cómo leer el mercado · Fundamentos",
    subtitulo: "Libro 1 de 4 · Metodología de 90 días, nivel básico",
    resumen:
      "Parte de cero: mercados y precios, inflación y tasas, instrumentos y diversificación, estados financieros, valuación, riesgo y psicología de la decisión — con una metodología diaria de 90 minutos, ejercicios con respuesta y práctica documentada contra datos reales de Pulso de Mercado.",
    paginas: 91,
    variante: "framing",
    precio: 115,
    stripePriceId: "price_1UUvyxGo6ysKHu77doPXObXa",
    checkoutUrl: rutaCheckout("libro", "como-leer-el-mercado-fundamentos"),
    archivos: [{ nombre: "Como_leer_el_mercado_Fundamentos.pdf", blobPath: "libros/Como_leer_el_mercado_Fundamentos.pdf" }],
    detalle: {
      eyebrow: "Cómo leer el mercado · Libro 1 de 4",
      hook: "No es otro libro de \"cómo invertir\": es una metodología de 90 días, con tarjetas de repaso, ejercicios con respuesta y un sistema de práctica documentada contra datos reales — para construir criterio antes de poner dinero real.",
      paraQuien: [
        "Nunca has invertido y quieres entender cómo se forma un precio antes de arriesgar dinero real.",
        "Prefieres un método con estructura diaria (lección, ejercicio, repaso, diario) sobre contenido suelto de redes sociales.",
        "Quieres practicar con datos reales — este libro usa Pulso de Mercado (jgonzalez.app/pulso-mercado) como fuente de práctica documentada, con fecha y fuente en cada ficha.",
        "Buscas un Plan base con reglas numéricas propias, no una promesa de rendimientos.",
      ],
      incluye: [
        "13 semanas (91 días) con lección, pregunta inicial, ejercicios en tres niveles y técnica Feynman cada sábado.",
        "Mercados y precios, inflación y tasas, instrumentos y diversificación, estados financieros, valuación, riesgo y tamaño de posición.",
        "Psicología de la decisión, lectura de gráficas, position trading, swing trading, costos, impuestos en México y seguridad.",
        "Tarjetas de repaso espaciado (N−1, N−3, N−7, N−14, N−30), diario de tres líneas y una constitución de inversor.",
        "Práctica con paper trading (dinero ficticio) — nunca una recomendación de compra o venta.",
      ],
      resultado:
        "Terminas con un Plan base propio (reglas con números, tabla de caída de 30%, registro de práctica) y la puerta medible que decide si avanzas al Libro 2 (Sistemas) o refuerzas un punto antes de seguir.",
    },
  },
  {
    id: "como-leer-el-mercado-cuantitativo",
    tema: "Finanzas",
    landingUrl: "/recursos/como-leer-el-mercado",
    imagenPortada: "/libros/como-leer-el-mercado-cuantitativo.jpg",
    categoria: "Mercados",
    titulo: "Cómo leer el mercado · Cuantitativo",
    subtitulo: "Libro 3 de 4 · Metodología de 90 días, nivel avanzado — en preparación",
    resumen:
      "Distribuciones y colas gruesas, inferencia sobre estrategias, series de tiempo, riesgo cuantitativo, portafolios, factores, derivados, microestructura y validación de sistemas, con trabajo en Python. Entregable: un reporte de investigación con método, datos y limitaciones.",
    paginas: 0,
    variante: "framing",
    precio: 115,
    stripePriceId: "",
    checkoutUrl: rutaCheckout("libro", "como-leer-el-mercado-cuantitativo"),
    detalle: {
      eyebrow: "Cómo leer el mercado · Libro 3 de 4 · En preparación",
      hook: "El tercer libro de la colección lleva la metodología de 90 días al nivel avanzado: evaluar con estadística si un resultado es habilidad o azar, con trabajo real en Python.",
      paraQuien: [
        "Ya completaste los Libros 1 y 2 (Fundamentos y Sistemas) de esta colección.",
        "Quieres evaluar estrategias con inferencia estadística, no solo con backtesting visual.",
        "Te interesa trabajar con series de tiempo, riesgo cuantitativo, factores y derivados en Python.",
      ],
      incluye: [
        "Distribuciones y colas gruesas, inferencia sobre estrategias, series de tiempo.",
        "Riesgo cuantitativo, portafolios, factores, derivados y microestructura de mercado.",
        "Validación de sistemas con trabajo real en Python.",
      ],
      resultado:
        "Terminas con un reporte de investigación propio, con método, datos y limitaciones declaradas explícitamente.",
    },
  },
  {
    id: "como-leer-el-mercado-practica-ia",
    tema: "Finanzas",
    landingUrl: "/recursos/como-leer-el-mercado",
    imagenPortada: "/libros/como-leer-el-mercado-practica-ia.jpg",
    categoria: "Mercados",
    titulo: "Cómo leer el mercado · Practica con IA",
    subtitulo: "Libro 4 de 4 · Cuaderno de práctica — en preparación",
    resumen:
      "Cerca de 320 ejercicios con código, ocho flujos de trabajo con IA y cuatro proyectos integradores, para usar a lo largo de los tres libros anteriores. Entregable: una carpeta de práctica con registro y auditoría.",
    paginas: 0,
    variante: "stack",
    precio: 115,
    stripePriceId: "",
    checkoutUrl: rutaCheckout("libro", "como-leer-el-mercado-practica-ia"),
    detalle: {
      eyebrow: "Cómo leer el mercado · Libro 4 de 4 · En preparación",
      hook: "El cuaderno que atraviesa toda la colección: usar la IA como examinadora y auditora de tu propio proceso, no como oráculo que decide por ti.",
      paraQuien: [
        "Ya estás trabajando con alguno de los tres libros anteriores de esta colección.",
        "Quieres practicar con ejercicios de código y flujos de trabajo asistidos por IA bajo un protocolo definido.",
        "Buscas auditar tu propio proceso de decisión, no que la IA te diga qué comprar.",
      ],
      incluye: [
        "Cerca de 320 ejercicios con código.",
        "Ocho flujos de trabajo con IA, usados a lo largo de los tres libros anteriores.",
        "Cuatro proyectos integradores.",
      ],
      resultado:
        "Terminas con una carpeta de práctica propia, con registro y auditoría de cada ejercicio resuelto.",
    },
  },
  {
    id: "como-leer-el-mercado-sistemas",
    tema: "Finanzas",
    landingUrl: "/recursos/como-leer-el-mercado",
    imagenPortada: "/libros/como-leer-el-mercado-sistemas.jpg",
    categoria: "Mercados",
    titulo: "Cómo leer el mercado · Sistemas",
    subtitulo: "Libro 2 de 4 · Metodología de 90 días, nivel intermedio — requiere el Libro 1",
    resumen:
      "Convierte el Plan base del Libro 1 en un sistema de inversión probado: estadística aplicada, análisis fundamental y técnico sistemáticos, sistemas completos de position y swing trading, riesgo de portafolio, backtesting honesto y simulación, con laboratorios en hoja de cálculo.",
    paginas: 91,
    variante: "stack",
    precio: 115,
    stripePriceId: "price_1UUvyxGo6ysKHu77b3owTSS6",
    checkoutUrl: rutaCheckout("libro", "como-leer-el-mercado-sistemas"),
    archivos: [{ nombre: "Como_leer_el_mercado_Sistemas.pdf", blobPath: "libros/Como_leer_el_mercado_Sistemas.pdf" }],
    detalle: {
      eyebrow: "Cómo leer el mercado · Libro 2 de 4",
      hook: "La diferencia entre tener reglas y tener un sistema es si ya las probaste con honestidad — este libro enseña a distinguir una ventaja real de un ajuste al pasado, con laboratorios en hoja de cálculo y 90 días de simulación evaluados.",
      paraQuien: [
        "Ya completaste el Libro 1 (Fundamentos) y tienes un Plan base con reglas numéricas propias.",
        "Quieres convertir esas reglas en un sistema completo de position y swing trading, no solo una intuición.",
        "Necesitas saber si tu sistema tiene una ventaja real o solo se ajusta bien al pasado — backtesting honesto, no optimizado de más.",
        "Prefieres evaluar riesgo de portafolio con estadística aplicada antes que con una corazonada.",
      ],
      incluye: [
        "13 semanas (91 días) con laboratorios en hoja de cálculo los viernes, en vez del repaso mezclado del Libro 1.",
        "Estadística aplicada y macro, análisis fundamental y técnico sistemáticos.",
        "Sistemas completos de position trading y swing trading, con reglas de entrada, salida y tamaño de posición.",
        "Riesgo de portafolio, backtesting honesto (sin sobreajuste) y simulación de 90 días.",
        "Mismo sistema de práctica documentada contra Pulso de Mercado y paper trading del Libro 1.",
      ],
      resultado:
        "Terminas con un sistema de inversión propio, documentado y con 90 días de simulación evaluados — y con el criterio para distinguir una ventaja real de una coincidencia estadística antes de arriesgar dinero real.",
    },
  },
];
