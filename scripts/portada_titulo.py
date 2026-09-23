#!/usr/bin/env python3
"""
Compone el título de la nota sobre una foto del banco de portadas
(lib/portadas.js), con degradado oscuro + etiqueta de categoría, igual
al tratamiento que se le da a las portadas "arregladas" a mano.

Uso:
  python3 scripts/portada_titulo.py <entrada.jpg> <salida.jpg> "Título de la nota" "CATEGORIA"

- <entrada.jpg>: ruta a la foto original del banco (public/blog/portadas/...)
- <salida.jpg>: ruta del archivo nuevo a generar (no sobrescribe el original
  del banco: usa un nombre distinto, ej. public/blog/portadas/<slug>.jpg)
- "Título de la nota": el `titulo` del frontmatter, tal cual
- "CATEGORIA": nombre visible de la categoría (ej. "Fintech", "IA & GenAI")
"""
import sys
import textwrap
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ANCHO, ALTO = 1600, 900  # relación 16:9, consistente para todas las portadas

FUENTE_TITULO = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FUENTE_TAG = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def recortar_cubrir(img, ancho, alto):
    """Recorta la imagen al centro para llenar ancho x alto sin deformarla."""
    ratio_objetivo = ancho / alto
    w, h = img.size
    ratio = w / h
    if ratio > ratio_objetivo:
        nuevo_w = int(h * ratio_objetivo)
        x0 = (w - nuevo_w) // 2
        img = img.crop((x0, 0, x0 + nuevo_w, h))
    else:
        nuevo_h = int(w / ratio_objetivo)
        y0 = (h - nuevo_h) // 2
        img = img.crop((0, y0, w, y0 + nuevo_h))
    return img.resize((ancho, alto), Image.LANCZOS)


def envolver_titulo(draw, texto, fuente, ancho_max):
    """Envuelve el título en líneas que quepan en ancho_max px."""
    palabras = texto.split()
    lineas, actual = [], ""
    for palabra in palabras:
        prueba = f"{actual} {palabra}".strip()
        if draw.textlength(prueba, font=fuente) <= ancho_max:
            actual = prueba
        else:
            if actual:
                lineas.append(actual)
            actual = palabra
    if actual:
        lineas.append(actual)
    return lineas


def generar(entrada, salida, titulo, categoria):
    base = Image.open(entrada).convert("RGB")
    base = recortar_cubrir(base, ANCHO, ALTO)

    # Degradado oscuro de abajo hacia arriba, para que el texto blanco
    # siempre sea legible sin importar qué tan clara sea la foto.
    degradado = Image.new("L", (1, ALTO), color=0)
    for y in range(ALTO):
        # Oscurece con fuerza en el tercio inferior, transparente arriba.
        t = max(0, (y - ALTO * 0.35) / (ALTO * 0.65))
        degradado.putpixel((0, y), int(235 * (t ** 0.8)))
    degradado = degradado.resize((ANCHO, ALTO))
    overlay = Image.new("RGBA", (ANCHO, ALTO), (10, 12, 18, 0))
    overlay.putalpha(degradado)
    base = base.convert("RGBA")
    base = Image.alpha_composite(base, overlay)

    draw = ImageDraw.Draw(base)

    margen = 72
    ancho_texto = ANCHO - margen * 2

    # Título, en 2-4 líneas según longitud (se calcula primero para poder
    # colocar la etiqueta de categoría arriba, sin encimarse).
    tam_fuente = 64
    fuente_titulo = ImageFont.truetype(FUENTE_TITULO, tam_fuente)
    lineas = envolver_titulo(draw, titulo, fuente_titulo, ancho_texto)
    while len(lineas) > 4 and tam_fuente > 36:
        tam_fuente -= 4
        fuente_titulo = ImageFont.truetype(FUENTE_TITULO, tam_fuente)
        lineas = envolver_titulo(draw, titulo, fuente_titulo, ancho_texto)

    alto_linea = int(tam_fuente * 1.2)
    bloque_titulo = alto_linea * len(lineas)
    y_titulo = ALTO - 80 - bloque_titulo

    # Etiqueta de categoría, siempre arriba del bloque de título con margen fijo.
    fuente_tag = ImageFont.truetype(FUENTE_TAG, 30)
    tag_y = y_titulo - 56
    draw.text((margen, tag_y), categoria.upper(), font=fuente_tag, fill=(255, 200, 90, 255))

    y = y_titulo
    for linea in lineas:
        draw.text((margen, y), linea, font=fuente_titulo, fill=(255, 255, 255, 255))
        y += alto_linea

    base.convert("RGB").save(salida, quality=90)
    print(f"OK: {salida} ({len(lineas)} líneas, fuente {tam_fuente}px)")


if __name__ == "__main__":
    if len(sys.argv) != 5:
        print(__doc__)
        sys.exit(1)
    generar(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
