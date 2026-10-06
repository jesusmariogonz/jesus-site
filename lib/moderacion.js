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

   Si el crédito de la cuenta se agota (o la clave es inválida), se
   manda UN correo de aviso a jesusmariogonz@gmail.com (o
   ADMIN_ALERT_EMAIL si está definida) — con enfriamiento de 24h para
   no mandar un correo por cada comentario que falle mientras no se
   recargue el crédito.
   ============================================================ */

import { ensureAlertasSchema, puedeAlertar } from "@/lib/db";
import { sendAdminAlert } from "@/lib/resend";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5";

/** true si la respuesta de la API indica que la cuenta se quedó sin
 *  crédito o que la clave ya no es válida — los dos casos en los que
 *  tiene sentido avisarte por correo, a diferencia de un 429/5xx
 *  transitorio que se resuelve solo en el siguiente intento. */
function esFalloDeCredito(status, cuerpoError) {
  if (status === 401) return true; // clave inválida/revocada
  if (status === 400 && /credit|balance/i.test(cuerpoError || "")) return true;
  return false;
}

async function avisarFalloDeCredito(detalle) {
  try {
    await ensureAlertasSchema();
    const debeAvisar = await puedeAlertar("anthropic_sin_credito", 24);
    if (!debeAvisar) return;
    await sendAdminAlert({
      asunto: "Se quedó sin crédito (o la clave es inválida) la API de Anthropic",
      mensaje: `
        <p>La moderación de comentarios con IA dejó de funcionar porque la
        llamada a la API de Anthropic falló así:</p>
        <p style="background:#f4f4f4;padding:12px;border-radius:8px;font-family:monospace;font-size:13px;">${detalle}</p>
        <p>Mientras no se resuelva, <strong>todos los comentarios nuevos
        quedarán en la cola de revisión manual</strong> en
        <a href="https://jgonzalez.app/admin/moderacion">/admin/moderacion</a>
        — no se publica nada a ciegas, pero tampoco se auto-aprueba nada.</p>
        <p>Revisa tu crédito en
        <a href="https://console.anthropic.com">console.anthropic.com → Billing</a>.</p>
        <p style="color:#999;font-size:12px;">No volverás a recibir este aviso
        en las próximas 24 horas aunque el error se repita.</p>
      `,
    });
  } catch (err) {
    console.error("avisarFalloDeCredito:", err);
  }
}

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
      const cuerpoError = await res.text().catch(() => "");
      if (esFalloDeCredito(res.status, cuerpoError)) {
        await avisarFalloDeCredito(`HTTP ${res.status} — ${cuerpoError.slice(0, 300)}`);
      }
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
