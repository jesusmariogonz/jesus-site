/* Cliente central de la API de Anthropic. Toda llamada a Claude del
   sitio pasa por aquí para que quede registrada (modelo, tokens, costo,
   latencia, éxito, razón de routing/escalación). El registro es "best
   effort": si la base falla, la llamada NO se rompe. */

import { MODELOS, costoEstimado } from "./modelos";
import { ensureLlmSchema, registrarLlmLlamada } from "@/lib/db";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

/**
 * @param {object} o
 * @param {string} o.taskId        agrupa la llamada inicial y sus escalaciones
 * @param {string} o.tipoTarea
 * @param {"haiku"|"sonnet"|"opus"} o.tier
 * @param {string} o.system
 * @param {Array}  o.messages
 * @param {number} o.maxTokens
 * @param {string} [o.razonRouting]
 * @param {string} [o.escaladaDesde]    tier anterior si esto es una escalación
 * @param {string} [o.razonEscalacion]
 * @returns {{ok:boolean,status:number,text:string,errorBody:string,tokensEntrada:number,tokensSalida:number,latenciaMs:number,costoUsd:number,error?:string}}
 */
export async function llamarClaude(o) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const modelo = MODELOS[o.tier];
  const inicio = Date.now();
  let r = {
    ok: false, status: 0, text: "", errorBody: "",
    tokensEntrada: 0, tokensSalida: 0, latenciaMs: 0, costoUsd: 0,
  };

  if (!apiKey) {
    r.error = "Falta configurar ANTHROPIC_API_KEY.";
    return r; // sin llamada de red: no se registra
  }

  try {
    const res = await fetch(ANTHROPIC_API, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelo.id,
        max_tokens: o.maxTokens,
        system: o.system,
        messages: o.messages,
      }),
    });
    r.status = res.status;
    r.latenciaMs = Date.now() - inicio;
    if (res.ok) {
      const data = await res.json();
      r.ok = true;
      r.text = data?.content?.[0]?.text || "";
      r.tokensEntrada = data?.usage?.input_tokens || 0;
      r.tokensSalida = data?.usage?.output_tokens || 0;
      r.costoUsd = costoEstimado(o.tier, r.tokensEntrada, r.tokensSalida);
    } else {
      r.errorBody = await res.text().catch(() => "");
    }
  } catch (err) {
    r.latenciaMs = Date.now() - inicio;
    r.error = String(err.message || err);
  }

  try {
    await ensureLlmSchema();
    await registrarLlmLlamada({
      taskId: o.taskId,
      tipoTarea: o.tipoTarea,
      modelo: modelo.id,
      tier: o.tier,
      tokensEntrada: r.tokensEntrada,
      tokensSalida: r.tokensSalida,
      costoUsd: r.costoUsd,
      latenciaMs: r.latenciaMs,
      exito: r.ok,
      httpStatus: r.status || null,
      escaladaDesde: o.escaladaDesde,
      razonEscalacion: o.razonEscalacion,
      razonRouting: o.razonRouting,
    });
  } catch (err) {
    console.error("registro LLM:", err.message || err);
  }
  return r;
}
