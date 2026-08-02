/* ============================================================
   Configuración central del sitio (SEO)
   ------------------------------------------------------------
   Cambia SITE_URL aquí cuando tengas dominio propio
   (ej. "https://jesusgonzalez.mx"). Todo el SEO —sitemap,
   canónicos, Open Graph y datos estructurados— lo toma de aquí.
   ============================================================ */

export const SITE_URL = "https://jgonzalez.app";

/* Verificación de Google Search Console.
   Cuando registres tu sitio en https://search.google.com/search-console,
   Google te dará un código (método "etiqueta HTML"). Pega SOLO ese código
   entre las comillas de abajo y publica. Déjalo vacío si aún no lo tienes. */
export const GOOGLE_SITE_VERIFICATION = "qcvYmsq_VFybK0A9m-faRgb_bpPOY4SoZW2N324Vm_0";

export const SITE_NAME = "Jesús González — Datos & Analítica";

export const SITE_DESCRIPTION =
  "Notas sobre ingeniería de datos, Snowflake, arquitectura, IA y retail por Jesús Mario González Siller, Arquitecto de Soluciones y Product Owner de Data & Analytics en FEMSA, desde Saltillo, México.";

/* Datos del autor para el esquema Person de Google.
   Esto es lo que hace que, al buscar tu nombre, Google entienda
   quién eres y muestre tu sitio como resultado de identidad. */
export const AUTHOR = {
  name: "Jesús Mario González Siller",
  alternateName: ["Jesús González", "Chuy González", "Jesús Mario González"],
  jobTitle: "Arquitecto de Soluciones Data, Analytics & IA · Product Owner",
  worksFor: "FEMSA Proximidad y Salud",
  locality: "Saltillo",
  region: "Coahuila",
  country: "México",
  email: "jesusmariogonz@gmail.com",
  image: `${SITE_URL}/jesus-hero.png`,
  sameAs: [
    "https://www.linkedin.com/in/jesus-mario-gonzalez-siller-545301ab/",
  ],
  knowsAbout: [
    "Ingeniería de datos",
    "Snowflake",
    "Databricks",
    "PySpark",
    "Arquitectura de datos",
    "Inteligencia artificial",
    "Analítica de retail",
    "Azure Data Factory",
  ],
};

/** Une una ruta relativa con el dominio para canónicos y sitemap. */
export function absUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
