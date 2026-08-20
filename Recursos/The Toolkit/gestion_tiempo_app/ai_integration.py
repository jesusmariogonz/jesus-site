"""
Integración con la API de Anthropic (Claude) para la pestaña "Asistente IA".

Enfoque sencillo para una prueba de concepto:
- El usuario pega su propia API key de Anthropic (obtenida en console.anthropic.com).
- La key se guarda localmente en el archivo gestion_tiempo.db (SQLite), asociada a su
  usuario. Nunca se envía a ningún lado más que a la API oficial de Anthropic.
- Con un clic, la app arma un resumen de tus tareas, bloques de tiempo y tu última
  revisión semanal, y le pide a Claude sugerencias concretas de cómo organizar mejor
  tu semana (inspirado en el Capítulo 13 del libro: "revisión asistida por IA").

Requisitos:
    pip install requests

Nada de esto usa Copilot, Microsoft Graph, ni servicios de Microsoft: es la API
pública de Anthropic (https://api.anthropic.com), completamente independiente de Outlook.
"""

import requests

API_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-5"
ANTHROPIC_VERSION = "2023-06-01"

SYSTEM_PROMPT = (
    "Eres un asistente de productividad experto en el método descrito en el libro "
    "'Gestión del Tiempo con Datos' (matriz Eisenhower, MoSCoW, time blocking, GTD, "
    "revisión semanal). Analizas datos reales de un usuario (tareas capturadas, "
    "bloques de tiempo registrados y su última revisión semanal) y das sugerencias "
    "concretas, breves y accionables en español, en formato de lista. No inventes "
    "datos que no te dieron. Sé directo y práctico, como un coach de productividad, "
    "no como un ensayo. Máximo 300 palabras."
)


def has_requests():
    return True  # requests es una dependencia declarada del proyecto


def ask_claude(api_key, user_summary):
    """
    Envía el resumen de datos del usuario a la API de Claude y regresa (respuesta, error).
    Si error no está vacío, respuesta será None.
    """
    if not api_key or not api_key.strip():
        return None, "Primero guarda tu API key de Anthropic en esta pestaña."

    headers = {
        "x-api-key": api_key.strip(),
        "anthropic-version": ANTHROPIC_VERSION,
        "content-type": "application/json",
    }
    payload = {
        "model": MODEL,
        "max_tokens": 700,
        "system": SYSTEM_PROMPT,
        "messages": [{"role": "user", "content": user_summary}],
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
    except requests.exceptions.RequestException as e:
        return None, f"No se pudo conectar con la API de Anthropic. Detalle: {e}"

    if response.status_code == 401:
        return None, "Tu API key parece inválida o expiró. Revísala en console.anthropic.com."
    if response.status_code == 429:
        return None, "Se alcanzó el límite de uso de tu cuenta de Anthropic. Intenta más tarde."
    if response.status_code != 200:
        try:
            detail = response.json().get("error", {}).get("message", response.text)
        except Exception:
            detail = response.text
        return None, f"La API respondió con un error ({response.status_code}): {detail}"

    try:
        data = response.json()
        text_blocks = [b["text"] for b in data.get("content", []) if b.get("type") == "text"]
        text = "\n".join(text_blocks).strip()
        if not text:
            return None, "La API respondió sin contenido de texto."
        return text, ""
    except Exception as e:
        return None, f"No se pudo interpretar la respuesta de la API. Detalle: {e}"


def build_summary(tasks, time_blocks, latest_review):
    """
    Arma, en texto plano, el resumen de datos del usuario que se le manda a Claude.
    Mantiene todo compacto para no gastar de más en tokens.
    """
    lines = ["Aquí están mis datos de gestión del tiempo. Dame sugerencias concretas:\n"]

    pending = [t for t in tasks if t["status"] == "pendiente"]
    lines.append(f"TAREAS PENDIENTES ({len(pending)}):")
    if pending:
        for t in pending[:40]:
            eis = t["eisenhower"] or "sin priorizar"
            mos = t["moscow"] or "sin MoSCoW"
            lines.append(f"- {t['title']} | categoría: {t['category']} | {eis} | {mos}")
        if len(pending) > 40:
            lines.append(f"... y {len(pending) - 40} más.")
    else:
        lines.append("(No hay tareas pendientes capturadas.)")

    lines.append("\nHORAS REGISTRADAS POR CATEGORÍA (bloques de tiempo):")
    by_category = {}
    for b in time_blocks:
        by_category[b["category"]] = by_category.get(b["category"], 0) + b["duration_minutes"]
    if by_category:
        for cat, minutes in sorted(by_category.items(), key=lambda kv: -kv[1]):
            lines.append(f"- {cat}: {minutes / 60:.1f} h")
    else:
        lines.append("(No hay bloques de tiempo registrados todavía.)")

    lines.append("\nÚLTIMA REVISIÓN SEMANAL:")
    if latest_review:
        lines.append(f"- Logro principal: {latest_review.get('q1') or '(sin responder)'}")
        lines.append(f"- Dónde perdió más tiempo: {latest_review.get('q2') or '(sin responder)'}")
        lines.append(f"- Tareas importantes postergadas: {latest_review.get('q3') or '(sin responder)'}")
        lines.append(f"- Ajuste planeado: {latest_review.get('q4') or '(sin responder)'}")
    else:
        lines.append("(Todavía no ha hecho ninguna revisión semanal.)")

    lines.append(
        "\nCon esto: dime en qué debería enfocarme esta semana, qué tareas priorizar "
        "primero (usa mis propias categorías Eisenhower/MoSCoW si ya las asigné), y si "
        "notas algún desequilibrio en cómo estoy usando mi tiempo."
    )

    return "\n".join(lines)
