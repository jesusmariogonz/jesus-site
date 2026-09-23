/** Agrupación editorial en 8 "mundos" temáticos, pensada como una capa de
 *  navegación por encima de `categoria` (que no cambia: sigue siendo la
 *  fuente de verdad para URLs de /blog/categoria/[categoria] y SEO).
 *
 *  Cada nota puede fijar `mundo` en su frontmatter (recomendado para notas
 *  nuevas, sobre todo en los mundos 6-8 donde `categoria` por sí sola es
 *  ambigua). Si no trae `mundo`, se le asigna el mundo por default de su
 *  `categoria` vía `MUNDO_POR_CATEGORIA`. */
export const MUNDOS = {
  "ia-nueva-economia": {
    nombre: "IA y la Nueva Economía",
    descripcion:
      "Productividad, empleo, agentes, infraestructura, chips y adopción empresarial de IA.",
  },
  "datos-como-negocio": {
    nombre: "Datos como Negocio",
    descripcion:
      "Estrategia y arquitectura de datos, gobernanza, monetización y el stack moderno de analítica.",
  },
  "tecnologia-y-negocio": {
    nombre: "Tecnología y Negocio",
    descripcion:
      "Big Tech, semiconductores, ciberseguridad, SaaS, fintech y plataformas digitales.",
  },
  "mexico-y-latam": {
    nombre: "México y Latinoamérica",
    descripcion:
      "Nearshoring, economía digital, manufactura e infraestructura de datos en la región.",
  },
  "mercados-y-capital": {
    nombre: "Mercados y Capital",
    descripcion:
      "Valuaciones de IA, venture capital, ciclos de mercado y capex de infraestructura.",
  },
  "mente-y-sistemas": {
    nombre: "Mente y Sistemas",
    descripcion:
      "Ciencia del comportamiento, experimentos históricos y sociología de la tecnología.",
  },
  "ideas-y-ensayos": {
    nombre: "Ideas y Ensayos",
    descripcion:
      "Reflexión de fondo sobre el futuro del trabajo, la automatización y las organizaciones.",
  },
  "notas-de-campo": {
    nombre: "Notas de Campo",
    descripcion:
      "Reflexión desde la experiencia real implementando estas cosas, sin nombrar clientes.",
  },
};

/** Mundo por default de cada `categoria`, usado solo cuando la nota no fija
 *  `mundo` explícitamente en su frontmatter. */
export const MUNDO_POR_CATEGORIA = {
  ia: "ia-nueva-economia",
  "business-analytics": "datos-como-negocio",
  arquitectura: "datos-como-negocio",
  "data-model": "datos-como-negocio",
  "ingenieria-de-datos": "datos-como-negocio",
  snowflake: "datos-como-negocio",
  cloud: "tecnologia-y-negocio",
  geopolitics: "mexico-y-latam",
  fintech: "mercados-y-capital",
  business: "tecnologia-y-negocio",
  opinion: "mente-y-sistemas",
  leadership: "notas-de-campo",
};

export function mundoDe(post) {
  return post.mundo || MUNDO_POR_CATEGORIA[post.categoria] || "ideas-y-ensayos";
}

/** Notas listables agrupadas por mundo (para /mundos). */
export function getPostsPorMundo() {
  const { getPostsListado } = require("@/lib/posts");
  const posts = getPostsListado();
  const porMundo = {};
  for (const slug of Object.keys(MUNDOS)) porMundo[slug] = [];
  for (const post of posts) porMundo[mundoDe(post)].push(post);
  return porMundo;
}

export function getPostsByMundo(mundo) {
  const { getPostsListado } = require("@/lib/posts");
  return getPostsListado().filter((p) => mundoDe(p) === mundo);
}
