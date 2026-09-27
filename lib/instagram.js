/* ============================================================
   Publicación automática en Instagram (cuenta profesional vinculada
   a la página de Facebook)
   ------------------------------------------------------------
   Usa la Graph API de Meta, flujo de dos pasos: crear un contenedor
   de medios (imagen + caption) y luego publicarlo.

   Necesita estas variables de entorno (Vercel):
   IG_BUSINESS_ACCOUNT_ID → ID numérico de la cuenta de Instagram
                            profesional (Settings → business_account
                            de la página en Graph API Explorer)
   FB_PAGE_ACCESS_TOKEN   → el mismo token de la página de Facebook,
                            con permiso instagram_content_publish

   Si alguna falta, la función no hace nada (integración opcional,
   no debe tumbar el resto del flujo de publicación).
   ============================================================ */

const GRAPH_API = "https://graph.facebook.com/v21.0";

export async function postToInstagram({ url, imagenUrl }) {
  const igId = process.env.IG_BUSINESS_ACCOUNT_ID;
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!igId || !token || !imagenUrl) return; // integración opcional, no truena si falta

  const caption = `Nota completa (link en bio / stories) — ${url}`;

  // Paso 1: crear el contenedor de medios.
  const crearRes = await fetch(`${GRAPH_API}/${igId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: imagenUrl,
      caption,
      access_token: token,
    }),
  });
  const crearData = await crearRes.json().catch(() => ({}));
  if (!crearRes.ok) {
    throw new Error(crearData?.error?.message || "No se pudo crear el contenedor de Instagram.");
  }

  // Paso 2: publicar el contenedor.
  const pubRes = await fetch(`${GRAPH_API}/${igId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creation_id: crearData.id,
      access_token: token,
    }),
  });
  const pubData = await pubRes.json().catch(() => ({}));
  if (!pubRes.ok) {
    throw new Error(pubData?.error?.message || "No se pudo publicar en Instagram.");
  }
  return pubData;
}
