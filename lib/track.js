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

/* Descarga protegida: pasa por /api/descargar (verificado por
   BotID) en vez de apuntar directo al PDF en /public, así un bot
   no puede simplemente pedir la URL del archivo. */
export async function descargarProtegido(id, nombreDescarga) {
  try {
    const res = await fetch("/api/descargar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "No se pudo descargar el archivo.");
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreDescarga || `${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    alert(err.message || "No se pudo descargar el archivo. Intenta de nuevo.");
    return false;
  }
}
