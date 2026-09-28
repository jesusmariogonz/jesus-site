/* ============================================================
   Publicación automática en la página de Facebook
   ------------------------------------------------------------
   Usa la Graph API de Meta para publicar una foto con caption en
   la página de Facebook cada vez que se publica una nota nueva.

   Necesita estas variables de entorno (Vercel):
   FB_PAGE_ID            → ID numérico de la página (ej. 1320088001189473)
   FB_PAGE_ACCESS_TOKEN  → token de acceso de la página, de larga
                           duración (no expira mientras seas admin)

   Si alguna falta, la función no hace nada (integración opcional,
   no debe tumbar el resto del flujo de publicación).
   ============================================================ */

const GRAPH_API = "https://graph.facebook.com/v21.0";

export async function postToFacebookPage({ titulo, resumen, url, imagenUrl, esTarjetaSocial = false }) {
  const pageId = process.env.FB_PAGE_ID;
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) return; // integración opcional, no truena si falta

  // Con tarjeta social (imagen ya trae titular/resumen/datos): el caption
  // solo lleva el link, la imagen es la que hace el trabajo. Sin tarjeta
  // (nota sin imagen social generada todavía): plantilla anterior de texto.
  const caption = esTarjetaSocial
    ? url
    : [titulo, resumen, `Análisis completo en jgonzalez.app: ${url}`]
        .filter(Boolean)
        .join("\n\n");

  const endpoint = imagenUrl
    ? `${GRAPH_API}/${pageId}/photos`
    : `${GRAPH_API}/${pageId}/feed`;

  const body = imagenUrl
    ? { url: imagenUrl, caption, access_token: token }
    : { message: caption, link: url, access_token: token };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || "No se pudo publicar en Facebook.");
  }
  return data;
}

// Publica una imagen con un caption arbitrario, no atado a una nota
// específica (ej. el resumen semanal / one pager de la semana).
export async function postCustomToFacebookPage({ caption, imagenUrl }) {
  const pageId = process.env.FB_PAGE_ID;
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) return;

  const endpoint = imagenUrl
    ? `${GRAPH_API}/${pageId}/photos`
    : `${GRAPH_API}/${pageId}/feed`;

  const body = imagenUrl
    ? { url: imagenUrl, caption, access_token: token }
    : { message: caption, access_token: token };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || "No se pudo publicar en Facebook.");
  }
  return data;
}
