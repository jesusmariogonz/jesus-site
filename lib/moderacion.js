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
import { elegirModelo } from "@/lib/llm/router";
import { llamarClaude } from "@/lib/llm/cliente";

// Routing (lib/llm/): moderación es clasificación simple, de alto volumen y
// con latencia visible para el usuario → Haiku. Solo si Haiku no puede decidir
// ("ambiguo" o respuesta ilegible) se pide una segunda opinión a Sonnet, y
// nunca se sube a Opus. Desactivable con MODERACION_ESCALAR=0.
const PERFIL = { tipo: "moderacion", complejidad: "baja", volumen: "alto", latencia: "critica", costoError: "medio" };

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

const SYSTEM = `Eres un moderador de comentarios para un blog de tecnología/negocios en español.
Clasifica el comentario del usuario en una de tres categorías:
- "limpio": comentario de buena fe, aunque sea crítico o esté en desacuerdo con la nota. El desacuerdo NO es motivo de rechazo.
- "toxico": spam, publicidad, insultos, ataques personales (no al argumento, a la persona), discurso de odio, contenido ilegal o enlaces a sitios sospechosos.
- "ambiguo": no estás seguro — sarcasmo que podría ser ofensivo, lenguaje fuerte pero posiblemente de buena fe, contexto insuficiente.

Responde ÚNICAMENTE con un JSON: {"clasificacion": "limpio"|"toxico"|"ambiguo", "justificacion": "una frase breve"}`;

/** Una llamada de clasificación. `fallo` indica error de API (no escalar). */
async function clasificarEn(tier, texto, ctx) {
  const r = await llamarClaude({
    taskId: ctx.taskId,
    tipoTarea: "moderacion",
    tier,
    system: SYSTEM,
    messages: [{ role: "user", content: texto }],
    maxTokens: 150,
    razonRouting: ctx.razonRouting,
    escaladaDesde: ctx.escaladaDesde,
    razonEscalacion: ctx.razonEscalacion,
  });

  if (r.error && !r.status) {
    return { fallo: true, clasificacion: "ambiguo", justificacion: `Error al moderar: ${r.error}` };
  }
  if (!r.ok) {
    if (esFalloDeCredito(r.status, r.errorBody)) {
      await avisarFalloDeCredito(`HTTP ${r.status} — ${(r.errorBody || "").slice(0, 300)}`);
    }
    return { fallo: true, clasificacion: "ambiguo", justificacion: `La API de moderación respondió ${r.status}.` };
  }

  const inicio = r.text.indexOf("{");
  const fin = r.text.lastIndexOf("}");
  if (inicio === -1 || fin === -1) {
    return { fallo: false, ilegible: true, clasificacion: "ambiguo", justificacion: "Respuesta del moderador no se pudo interpretar." };
  }
  try {
    const parsed = JSON.parse(r.text.slice(inicio, fin + 1));
    const clasificacion = ["limpio", "toxico", "ambiguo"].includes(parsed.clasificacion)
      ? parsed.clasificacion
      : "ambiguo";
    return { fallo: false, clasificacion, justificacion: parsed.justificacion || "" };
  } catch {
    return { fallo: false, ilegible: true, clasificacion: "ambiguo", justificacion: "Respuesta del moderador no se pudo interpretar." };
  }
}

export async function clasificarComentario(texto) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { clasificacion: "ambiguo", justificacion: "Falta configurar ANTHROPIC_API_KEY." };
  }

  const taskId = globalThis.crypto.randomUUID();
  const decision = elegirModelo(PERFIL);
  const primero = await clasificarEn(decision.tier, texto, { taskId, razonRouting: decision.razon });

  const debeEscalar =
    !primero.fallo &&
    primero.clasificacion === "ambiguo" &&
    process.env.MODERACION_ESCALAR !== "0";
  if (!debeEscalar) {
    return { clasificacion: primero.clasificacion, justificacion: primero.justificacion };
  }

  // Escalación Haiku → Sonnet (techo: Sonnet). Si Sonnet falla, se conserva
  // el "ambiguo" de Haiku → cola de revisión manual, como antes.
  const segundo = await clasificarEn("sonnet", texto, {
    taskId,
    razonRouting: `${decision.razon}; escalada`,
    escaladaDesde: decision.tier,
    razonEscalacion: primero.ilegible ? "haiku_respuesta_ilegible" : "haiku_ambiguo",
  });
  if (segundo.fallo) {
    return { clasificacion: "ambiguo", justificacion: primero.justificacion };
  }
  return { clasificacion: segundo.clasificacion, justificacion: segundo.justificacion };
}
