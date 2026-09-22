/* ============================================================
   Publicación automática en LinkedIn (perfil personal)
   ------------------------------------------------------------
   Usa la API REST de LinkedIn para publicar una imagen con texto
   cada vez que se publica una nota nueva.

   Necesita estas variables de entorno (Vercel):
   LINKEDIN_CLIENT_ID      → Client ID de tu app de LinkedIn
   LINKEDIN_CLIENT_SECRET  → Client Secret de tu app de LinkedIn
   LINKEDIN_REFRESH_TOKEN  → refresh token obtenido una sola vez
                             (dura 365 días; renuévalo antes de que
                             expire repitiendo el flujo de OAuth)
   LINKEDIN_PERSON_URN     → tu identificador de persona, formato
                             "urn:li:person:XXXXXXXX"

   Los access tokens de LinkedIn expiran a los 60 días, así que en
   vez de guardar uno fijo, esta función pide uno nuevo con el
   refresh token cada vez que publica (el refresh token sí dura
   todo el año y no se consume al usarlo).

   Si alguna variable falta, la función no hace nada (integración
   opcional, no debe tumbar el resto del flujo de publicación).
   ============================================================ */

const LI_VERSION = "202601"; // header LinkedIn-Version, formato YYYYMM

async function getAccessToken() {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const refreshToken = process.env.LINKEDIN_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error_description || "No se pudo renovar el token de LinkedIn.");
  }
  return data.access_token;
}

async function subirImagen(accessToken, personUrn, imagenUrl) {
  // 1) Registrar la subida
  const initRes = await fetch("https://api.linkedin.com/rest/images?action=initializeUpload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": LI_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({ initializeUploadRequest: { owner: personUrn } }),
  });
  const initData = await initRes.json().catch(() => ({}));
  if (!initRes.ok) {
    throw new Error(initData?.message || "No se pudo iniciar la subida de imagen a LinkedIn.");
  }
  const { uploadUrl, image } = initData.value;

  // 2) Subir el binario de la imagen a la URL firmada
  const imgRes = await fetch(imagenUrl);
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: imgBuffer,
  });
  if (!putRes.ok) {
    throw new Error("No se pudo subir el archivo de imagen a LinkedIn.");
  }

  return image; // urn:li:image:xxxx
}

export async function postToLinkedIn({ titulo, resumen, url, imagenUrl }) {
  const personUrn = process.env.LINKEDIN_PERSON_URN;
  const accessToken = await getAccessToken();
  if (!accessToken || !personUrn) return; // integración opcional, no truena si falta

  const commentary = [
    titulo,
    resumen,
    `Análisis completo en jgonzalez.app: ${url}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const content = imagenUrl
    ? { media: { title: titulo, id: await subirImagen(accessToken, personUrn, imagenUrl) } }
    : undefined;

  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": LI_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: personUrn,
      commentary,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      ...(content ? { content } : {}),
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "No se pudo publicar en LinkedIn.");
  }
  return true;
}
