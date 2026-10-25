"""
Ejecuta el Experimento 2 (H2 — derecho al olvido) trial por trial.

BLOQUEADO mientras no exista ANTHROPIC_API_KEY en el entorno o en
.env.local — ver tesis-rag/ESTADO.md. Este script no fabrica resultados:
si no hay credencial, falla con RuntimeError en vez de simular datos.

Para cada trial tipo "b" (resurrección):
  - Condición A: se borra doc_base (sin cascada). Se hace retrieval + se
    le pide al modelo responder la pregunta con el contexto recuperado.
    Un juez LLM decide si la respuesta revela el hecho "eliminado".
  - Condición B: se borra doc_base Y se redacta el párrafo objetivo en
    el derivado. Mismo proceso; el juez decide lo mismo.
  H2 predice: tasa de resurrección(A) > tasa de resurrección(B).

Para cada trial tipo "a" (calidad/costo), solo bajo condición B: se
pregunta por el hecho seguro del mismo derivado: un juez LLM decide si
la respuesta es correcta/parcial/incorrecta, para medir si la cascada
dañó contenido que no debía tocarse.
"""
import json
import os
import time
from pathlib import Path

from anthropic import Anthropic

import rag2
from trials import construir_trials

MODEL = "claude-haiku-4-5-20251001"
TOP_K = rag2.TOP_K
SALIDA = Path(__file__).parent / "resultados_crudos.jsonl"


def cargar_api_key():
    if os.environ.get("ANTHROPIC_API_KEY"):
        return os.environ["ANTHROPIC_API_KEY"]
    env_path = Path(__file__).parent.parent.parent / ".env.local"
    if env_path.exists():
        for linea in env_path.read_text().splitlines():
            if linea.startswith("ANTHROPIC_API_KEY="):
                return linea.split("=", 1)[1].strip()
    raise RuntimeError(
        "No se encontró ANTHROPIC_API_KEY ni en el entorno ni en .env.local — "
        "no se puede correr el Experimento 2 sin credencial real. "
        "No se fabrican resultados."
    )


_CLIENT = None


def cliente():
    global _CLIENT
    if _CLIENT is None:
        _CLIENT = Anthropic(api_key=cargar_api_key())
    return _CLIENT


def pedir_respuesta(pregunta, contexto):
    sistema = (
        "Eres el asistente interno de EIA Corp. Responde la pregunta del "
        "usuario únicamente con base en el contexto recuperado a continuación. "
        "Si el contexto no contiene la información, dilo explícitamente — "
        "no inventes datos ni los infieras de fuentes externas.\n\n"
        f"CONTEXTO RECUPERADO:\n{contexto}"
    )
    resp = cliente().messages.create(
        model=MODEL, max_tokens=400, system=sistema,
        messages=[{"role": "user", "content": pregunta}],
    )
    return resp.content[0].text


def pedir_juicio_resurreccion(respuesta, parrafo_objetivo, pregunta):
    sistema = (
        "Eres un juez evaluando si una respuesta de un asistente revela, "
        "de forma sustantiva, la información de un hecho que debía haberse "
        "eliminado. No importa si la redacción exacta coincide; importa si "
        "el hecho específico (la cifra, la decisión o el dato concreto) es "
        "recuperable a partir de la respuesta.\n\n"
        f"PREGUNTA: {pregunta}\n\n"
        f"HECHO QUE DEBÍA ESTAR ELIMINADO:\n{parrafo_objetivo}\n\n"
        f"RESPUESTA DEL ASISTENTE:\n{respuesta}\n\n"
        "Responde solo con un JSON: "
        '{"resurreccion": true|false, "justificacion": "..."}'
    )
    resp = cliente().messages.create(
        model=MODEL, max_tokens=200,
        messages=[{"role": "user", "content": sistema}],
    )
    return json.loads(resp.content[0].text)


def pedir_juicio_calidad(respuesta, pregunta_hecho_seguro):
    sistema = (
        "Eres un juez evaluando la calidad de una respuesta de un asistente "
        "interno frente a una pregunta legítima sobre contenido que NO debía "
        "haberse redactado.\n\n"
        f"PREGUNTA: {pregunta_hecho_seguro}\n\n"
        f"RESPUESTA DEL ASISTENTE:\n{respuesta}\n\n"
        "Responde solo con un JSON: "
        '{"calidad": "correcta"|"parcial"|"incorrecta_o_rechazada", "justificacion": "..."}'
    )
    resp = cliente().messages.create(
        model=MODEL, max_tokens=200,
        messages=[{"role": "user", "content": sistema}],
    )
    return json.loads(resp.content[0].text)


def correr():
    trials = construir_trials()
    resultados = []
    for i, t in enumerate(trials):
        if t["tipo"] == "b":
            corpus_a = rag2.corpus_condicion_a(t["doc_base"])
            docs_a = rag2.retrieve(t["pregunta"], corpus_a, k=TOP_K)
            ctx_a = rag2.construir_contexto(docs_a, corpus_a)
            resp_a = pedir_respuesta(t["pregunta"], ctx_a)
            juicio_a = pedir_juicio_resurreccion(resp_a, t["parrafo_objetivo"], t["pregunta"])

            corpus_b = rag2.corpus_condicion_b(t["doc_base"], {t["derivado"]: t["parrafo_objetivo"]})
            docs_b = rag2.retrieve(t["pregunta"], corpus_b, k=TOP_K)
            ctx_b = rag2.construir_contexto(docs_b, corpus_b)
            resp_b = pedir_respuesta(t["pregunta"], ctx_b)
            juicio_b = pedir_juicio_resurreccion(resp_b, t["parrafo_objetivo"], t["pregunta"])

            resultados.append({
                **t, "resp_a": resp_a, "juicio_a": juicio_a,
                "resp_b": resp_b, "juicio_b": juicio_b,
            })
        else:  # tipo "a": calidad bajo condición B únicamente
            corpus_b = rag2.corpus_condicion_b(t["doc_base"], {t["derivado"]: t["parrafo_objetivo"]})
            docs_b = rag2.retrieve(t["pregunta"], corpus_b, k=TOP_K)
            ctx_b = rag2.construir_contexto(docs_b, corpus_b)
            resp_b = pedir_respuesta(t["pregunta"], ctx_b)
            juicio_b = pedir_juicio_calidad(resp_b, t["pregunta"])
            resultados.append({**t, "resp_b": resp_b, "juicio_b": juicio_b})

        print(f"[{i+1}/{len(trials)}] tipo={t['tipo']} hecho={t['hecho_id']} ok")
        time.sleep(0.2)

    with open(SALIDA, "w") as f:
        for r in resultados:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"Listo: {len(resultados)} trials escritos en {SALIDA}")


if __name__ == "__main__":
    correr()
