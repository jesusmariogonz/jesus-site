#!/usr/bin/env python3
"""
Genera la portada de una nota nueva con la API de Imágenes de OpenAI
(modelo gpt-image-1) y le aplica el mismo tratamiento de título +
etiqueta de categoría + marca que usa scripts/portada_titulo.py —
reemplaza el uso del banco de fotos de lib/portadas.js.

Uso:
  python3 scripts/portada_ia.py <salida.jpg> "Título de la nota" "CATEGORIA" "<prompt de imagen>"

- <salida.jpg>: ruta del archivo a generar, ej. public/blog/portadas/<slug>.jpg
- "Título de la nota": el `titulo` del frontmatter, tal cual
- "CATEGORIA": nombre visible de la categoría (ej. "Fintech", "IA & GenAI")
- "<prompt de imagen>": descripción en inglés de la escena/composición que
  quieres que genere OpenAI — NUNCA pidas que incluya texto/letras en la
  imagen (los modelos de generación lo renderizan mal); el título se
  sobrepone después con PIL, igual que con las fotos del banco. Evita
  también pedir logos, marcas o personas reales identificables.

No lee ninguna API key del entorno: este sandbox tiene configurado un
"Network secret" que inyecta el header Authorization automáticamente en
cualquier petición saliente a api.openai.com (configurado a mano en el
menú del entorno de Claude Code, no en este repo). Si ese secreto no
está configurado, la petición falla con 401 y el script termina con
código de salida 1 sin escribir ningún archivo — quien llame a este
script debe tener un plan de respaldo (ej. caer al banco de fotos) en
vez de bloquear la publicación.
"""
import base64
import io
import json
import os
import sys
import urllib.request
import urllib.error

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from portada_titulo import tratar_imagen, ANCHO, ALTO  # noqa: E402

OPENAI_IMAGES_URL = "https://api.openai.com/v1/images/generations"

# 1536x1024 es el tamaño "apaisado" más cercano a la relación 16:9 (1200x675)
# que soporta gpt-image-1 — se recorta al centro a la relación exacta dentro
# de tratar_imagen() (recortar_cubrir), igual que con las fotos del banco.
TAMANO_GENERACION = "1536x1024"
CALIDAD = "low"  # ~4x más barato que "medium" (~$0.016 vs ~$0.065/imagen) — decisión explícita
# del usuario de priorizar costo sobre nitidez; "medium" se ve mejor en detalle fino si el
# presupuesto lo permite más adelante.


def generar_imagen_openai(prompt):
    payload = json.dumps(
        {
            "model": "gpt-image-1",
            "prompt": prompt,
            "size": TAMANO_GENERACION,
            "quality": CALIDAD,
            "n": 1,
        }
    ).encode("utf-8")

    # Sin header Authorization explícito a propósito: lo agrega el proxy
    # de red del sandbox para peticiones a api.openai.com (ver docstring).
    req = urllib.request.Request(
        OPENAI_IMAGES_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as res:
            data = json.loads(res.read())
    except urllib.error.HTTPError as e:
        cuerpo = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI Images API respondió {e.code}: {cuerpo}") from e

    b64 = data["data"][0]["b64_json"]
    return Image.open(io.BytesIO(base64.b64decode(b64)))


def generar(salida, titulo, categoria, prompt_imagen):
    # Prefijo fijo de estilo editorial — consistente en TODAS las portadas
    # generadas, para que no se sienta cada una un estilo visual distinto.
    # Nunca pide texto/letras: eso se sobrepone después con PIL.
    prompt_completo = (
        "Editorial photojournalism-style cover image for a business/tech/economics "
        "news website, cinematic lighting, realistic, high detail, no text, no logos, "
        "no watermarks, no captions, 16:9 composition. "
        f"Scene: {prompt_imagen}"
    )
    imagen = generar_imagen_openai(prompt_completo)
    tratar_imagen(imagen, salida, titulo, categoria)


if __name__ == "__main__":
    if len(sys.argv) != 5:
        print(__doc__)
        sys.exit(1)
    try:
        generar(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    except Exception as err:  # noqa: BLE001 — reportar y salir, nunca bloquear la publicación
        print(f"ERROR generando portada con OpenAI: {err}", file=sys.stderr)
        sys.exit(1)
