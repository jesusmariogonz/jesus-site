/* ============================================================
   Router de modelos — decide Haiku, Sonnet u Opus por la NATURALEZA
   de la tarea, no por la página donde ocurre.
   ------------------------------------------------------------
   Regla: empezar por el modelo más barato que razonablemente pueda
   resolver la tarea y escalar solo si hace falta. Cada decisión
   devuelve `razones[]`, que se guarda en el registro (llm_llamadas)
   para poder responder "¿por qué esta tarea usó este modelo?".

   Perfil de la tarea:
     tipo           clave de TIPOS (abajo); si no se conoce, "otro"
     complejidad    "baja" | "media" | "alta"
     razonamiento   true si requiere razonamiento de varios pasos o juicio
     volumen        "bajo" | "alto" (muchos elementos independientes)
     latencia       "critica" | "normal"
     costoError     "bajo" | "medio" | "alto"
     contextoTokens tamaño aproximado del contexto de entrada
   ============================================================ */

import { TIERS } from "./modelos";

/* Tipo de tarea → nivel mínimo. Ejemplos de la política acordada. */
export const TIPOS = {
  // Haiku: simples, repetitivas, alto volumen, latencia prioritaria.
  clasificacion: "haiku",
  extraccion: "haiku",
  formateo: "haiku",
  normalizacion: "haiku",
  resumen_simple: "haiku",
  validacion_simple: "haiku",
  respuesta_corta: "haiku",
  moderacion: "haiku",
  // Sonnet: default para código, análisis técnico y flujos de varios pasos.
  codigo: "sonnet",
  debugging: "sonnet",
  refactor: "sonnet",
  revision_codigo: "sonnet",
  analisis_datos: "sonnet",
  integracion: "sonnet",
  automatizacion: "sonnet",
  explicacion_tecnica: "sonnet",
  redaccion_analitica: "sonnet",
  // Opus: razonamiento profundo donde la calidad pesa más que la velocidad.
  diseno_experimento: "opus",
  evaluacion_estadistica: "opus",
  interpretacion_ambigua: "opus",
  revision_hipotesis: "opus",
  estrategia: "opus",
  investigacion_multipaso: "opus",
  otro: "haiku",
};

const CONTEXTO_GRANDE = 50_000; // por encima, Haiku pierde fiabilidad
const nivel = (t) => TIERS.indexOf(t);
const max = (a, b) => (nivel(a) >= nivel(b) ? a : b);

export function elegirModelo(perfil = {}) {
  const p = {
    tipo: "otro",
    complejidad: "baja",
    razonamiento: false,
    volumen: "bajo",
    latencia: "normal",
    costoError: "bajo",
    contextoTokens: 0,
    ...perfil,
  };
  const razones = [];

  let tier = TIPOS[p.tipo] || "haiku";
  razones.push(`tipo "${p.tipo}" → mínimo ${tier}`);

  if (p.complejidad === "media") {
    tier = max(tier, "sonnet");
    razones.push("complejidad media → al menos sonnet");
  } else if (p.complejidad === "alta") {
    tier = max(tier, p.razonamiento ? "opus" : "sonnet");
    razones.push(
      p.razonamiento
        ? "complejidad alta + razonamiento profundo → opus"
        : "complejidad alta sin razonamiento profundo → sonnet"
    );
  }

  if (p.razonamiento && p.complejidad !== "baja") {
    tier = max(tier, "sonnet");
    razones.push("requiere razonamiento de varios pasos → al menos sonnet");
  }

  if (p.contextoTokens > CONTEXTO_GRANDE) {
    tier = max(tier, "sonnet");
    razones.push(`contexto grande (${p.contextoTokens} tokens) → al menos sonnet`);
  }

  if (p.costoError === "alto" && p.complejidad !== "baja") {
    tier = max(tier, "sonnet");
    razones.push("costo de error alto con complejidad no trivial → al menos sonnet");
  }

  // Tareas de bajo nivel se quedan en haiku aunque el tipo no esté en la tabla.
  if (
    tier === "haiku" &&
    p.complejidad === "baja" &&
    !p.razonamiento &&
    (p.volumen === "alto" || p.latencia === "critica")
  ) {
    razones.push("simple + alto volumen/latencia crítica → haiku");
  }

  return { tier, razones, razon: razones.join("; "), perfil: p };
}
