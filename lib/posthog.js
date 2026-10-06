/* ============================================================
   Captura de eventos de PostHog desde el servidor (ej. webhooks),
   vía su API HTTP directa — sin agregar posthog-node como
   dependencia, igual que el resto del proyecto llama a APIs REST
   directamente (ver lib/resend.js).
   ============================================================ */

const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export async function capturarEventoServidor(evento, { distinctId, properties = {} } = {}) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return; // integración opcional, no truena si falta

  try {
    await fetch(`${HOST}/i/v0/e/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        event: evento,
        distinct_id: distinctId || `server-${Date.now()}`,
        properties,
      }),
    });
  } catch (err) {
    console.error("posthog (servidor):", err);
  }
}
