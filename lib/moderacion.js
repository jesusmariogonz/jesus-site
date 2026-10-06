/* ============================================================
   Moderación de comentarios con Claude (Anthropic)
   ------------------------------------------------------------
   Clasifica cada comentario en 3 categorías antes de publicarlo:
   - "limpio"   → se aprueba y se muestra de inmediato.
   - "toxico"   → se rechaza de inmediato (spam, insultos, ataques
                  personales, contenido ilegal/dañino). Nunca llega
                  a verse públicamente.
   - "ambiguo"  → queda pendiente de revisión manual en
                  /admin/moderacion (ver app/admin/moderacion/page.js).

   Necesita ANTHROPIC_API_KEY en Vercel (Project Settings →
   Environment Variables). Si falta la clave o la llamada falla, el
   comentario se manda a "ambiguo" en vez de publicarse a ciegas —
   nunca se asume "limpio" por default ante un error.
   ============================================================ */

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5";

export async function clasificarComentario(texto) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { clasificacion: "ambiguo", justificacion: "Falta configurar ANTHROPIC_API_KEY." };
  }

  const system = `Eres un moderador de comentarios para un blog de tecnología/negocios en español.
Clasifica el comentario del usuario en una de tres categorías:
- "limpio": comentario de buena fe, aunque sea crítico o esté en desacuerdo con la nota. El desacuerdo NO es motivo de rechazo.
- "toxico": spam, publicidad, insultos, ataques personales (no al argumento, a la persona), discurso de odio, contenido ilegal o enlaces a sitios sospechosos.
- "ambiguo": no estás seguro — sarcasmo que podría ser ofensivo, lenguaje fuerte pero posiblemente de buena fe, contexto insuficiente.

Responde ÚNICAMENTE con un JSON: {"clasificacion": "limpio"|"toxico"|"ambiguo", "justificacion": "una frase breve"}`;

  try {
    const res = await fetch(ANTHROPIC_API, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 150,
        system,
        messages: [{ role: "user", content: texto }],
      }),
    });

    if (!res.ok) {
      return { clasificacion: "ambiguo", justificacion: `La API de moderación respondió ${res.status}.` };
    }

    const data = await res.json();
    const raw = data?.content?.[0]?.text || "";
    const inicio = raw.indexOf("{");
    const fin = raw.lastIndexOf("}");
    if (inicio === -1 || fin === -1) {
      return { clasificacion: "ambiguo", justificacion: "Respuesta del moderador no se pudo interpretar." };
    }
    const parsed = JSON.parse(raw.slice(inicio, fin + 1));
    const clasificacion = ["limpio", "toxico", "ambiguo"].includes(parsed.clasificacion)
      ? parsed.clasificacion
      : "ambiguo";
    return { clasificacion, justificacion: parsed.justificacion || "" };
  } catch (err) {
    return { clasificacion: "ambiguo", justificacion: `Error al moderar: ${String(err.message || err)}` };
  }
}
