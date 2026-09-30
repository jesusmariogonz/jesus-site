/* ============================================================
   Publicación automática en LinkedIn (perfil personal)
   ------------------------------------------------------------
   Usa la API REST de LinkedIn para publicar una imagen con texto
   cada vez que se publica una nota nueva.

   Necesita estas variables de entorno (Vercel):
   LINKEDIN_ACCESS_TOKEN   → access token obtenido una sola vez vía
                             /api/linkedin/setup (dura ~60 días; la
                             app no tiene aprobado el refresh token
                             automático de LinkedIn, así que hay que
                             repetir el flujo de OAuth cada vez que
                             esté por expirar)
   LINKEDIN_PERSON_URN     → tu identificador de persona, formato
                             "urn:li:person:XXXXXXXX"

   Si alguna variable falta, la función no hace nada (integración
   opcional, no debe tumbar el resto del flujo de publicación).
   ============================================================ */

const LI_VERSION = "202601"; // header LinkedIn-Version, formato YYYYMM

// LinkedIn interpreta el campo `commentary` con su propio "Little Text
// Format": ciertos caracteres son reservados (para negritas, menciones,
// hashtags, etc.) y deben ir escapados con "\" si se usan literalmente,
// o la API puede recortar/malinterpretar el resto del texto. Nuestras
// notas casi siempre traen paréntesis y guiones en el título/gancho, así
// que hay que escaparlos antes de armar el commentary — la URL final NO
// se escapa, para que LinkedIn la siga reconociendo como link.
const RESERVADOS_LINKEDIN = /[\\{}@\[\]()<>#*_~|]/g;
function escaparTextoLinkedIn(texto) {
  return String(texto).replace(RESERVADOS_LINKEDIN, (c) => `\\${c}`);
}

// Igual que escaparTextoLinkedIn, pero sobre un bloque de texto que ya
// incluye una URL al final (o en medio) — la URL se deja intacta para
// que LinkedIn la siga detectando como link, solo se escapa el texto
// alrededor.
function escaparPreservandoUrls(texto) {
  return String(texto)
    .split(/(https?:\/\/[^\s]+)/g)
    .map((parte, i) => (i % 2 === 1 ? parte : escaparTextoLinkedIn(parte)))
    .join("");
}

async function getAccessToken() {
  return process.env.LINKEDIN_ACCESS_TOKEN || null;
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

export async function postToLinkedIn({ titulo, resumen, gancho, url, imagenUrl, esTarjetaSocial = false }) {
  const personUrn = process.env.LINKEDIN_PERSON_URN;
  const accessToken = await getAccessToken();
  if (!accessToken || !personUrn) return; // integración opcional, no truena si falta

  // Con tarjeta social (imagen ya trae titular/datos): el texto sigue el
  // formato fijo "jgonzalez.app <título>" + párrafo de gancho (pregunta
  // abierta, dato o tensión sin resolver — nunca solo el link) + "Análisis
  // completo aqui <link>". Usa `gancho` si la nota lo trae, si no cae a
  // `resumen`. Sin tarjeta: plantilla larga de antes.
  const commentary = esTarjetaSocial
    ? [
        escaparTextoLinkedIn(`jgonzalez.app ${titulo}`),
        escaparTextoLinkedIn(gancho || resumen),
        `Análisis completo aqui ${url}`,
      ]
        .filter(Boolean)
        .join("\n\n")
    : [
        escaparTextoLinkedIn(titulo),
        escaparTextoLinkedIn(resumen),
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

// Publica una imagen con un texto arbitrario, no atado a una nota
// específica (ej. el resumen semanal / one pager de la semana).
export async function postCustomToLinkedIn({ commentary, imagenUrl }) {
  const personUrn = process.env.LINKEDIN_PERSON_URN;
  const accessToken = await getAccessToken();
  if (!accessToken || !personUrn) return;

  commentary = escaparPreservandoUrls(commentary);

  const content = imagenUrl
    ? { media: { title: "jgonzalez.app", id: await subirImagen(accessToken, personUrn, imagenUrl) } }
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
