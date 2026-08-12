"use client";

import { track } from "@vercel/analytics";

/* Envoltura chiquita sobre Vercel Analytics para registrar eventos
   personalizados: quién descarga qué (nombre + categoría), sin
   guardar datos personales, solo el nombre del recurso.

   Estos eventos aparecen en tu dashboard de Vercel en
   Analytics → Events, con el conteo de cuántas veces se disparó
   cada uno. */

export function trackDescarga(nombre, categoria = "general") {
  try {
    track("descarga", { nombre, categoria });
  } catch {
    /* si Analytics no está disponible (ej. localhost), no truena nada */
  }
}

export function trackCopiarLink(pagina) {
  try {
    track("copiar_link", { pagina });
  } catch {
    /* no-op */
  }
}
