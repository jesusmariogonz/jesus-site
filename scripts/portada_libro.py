#!/usr/bin/env python3
"""
Genera la portada de un libro de Biblioteca (formato vertical, estilo
libro real) con la API de Imágenes de OpenAI, con el mismo tratamiento
visual (degradado + acento + marca jgonzalez.app) que scripts/portada_ia.py
usa para las portadas de notas, adaptado a proporción de libro (2:3).

Uso:
  python3 scripts/portada_libro.py <salida.jpg> "<Título>" "<Subtítulo>" "<categoría>" "<prompt de escena en inglés>"
"""
import io
import sys
import textwrap

from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.path.insert(0, "/home/user/jesus-site/scripts")
from portada_ia import generar_imagen_openai  # noqa: E402
from portada_titulo import recortar_cubrir, color_categoria, FUENTE_TAG  # noqa: E402

ANCHO, ALTO = 800, 1200  # 2:3, misma proporción que .lc en el sitio
F_SERIF_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
F_SERIF_ITALIC = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
F_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"


def envolver(draw, texto, fuente, ancho_max):
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


def generar(salida, titulo, subtitulo, categoria, prompt_escena):
    prompt_completo = (
        "Abstract conceptual book cover illustration, editorial style, bright and "
        "well-lit, clean modern lighting, high detail, no text, no logos, no "
        "watermarks, no people's faces identifiable, vertical 2:3 portrait "
        "composition with the main subject in the upper two-thirds and calm "
        "negative space in the lower third. Scene: " + prompt_escena
    )
    imagen_openai = generar_imagen_openai(prompt_completo)
    base = recortar_cubrir(imagen_openai.convert("RGB"), ANCHO, ALTO)

    # Degradado oscuro de abajo hacia arriba, igual que portada_titulo.py,
    # para que el bloque de texto siempre sea legible.
    degradado = Image.new("L", (1, ALTO), color=0)
    for y in range(ALTO):
        t = max(0, (y - ALTO * 0.5) / (ALTO * 0.5))
        degradado.putpixel((0, y), int(225 * (t ** 1.0)))
    degradado = degradado.resize((ANCHO, ALTO))
    overlay = Image.new("RGBA", (ANCHO, ALTO), (8, 10, 16, 0))
    overlay.putalpha(degradado)
    base = base.convert("RGBA")
    base = Image.alpha_composite(base, overlay)

    draw = ImageDraw.Draw(base)
    acento = color_categoria(categoria)
    margen = 56
    ancho_texto = ANCHO - margen * 2

    # Etiqueta de categoría
    fuente_tag = ImageFont.truetype(F_MONO, 20)
    tag_y = ALTO - 310
    draw.text((margen, tag_y), categoria.upper(), font=fuente_tag, fill=(*acento, 255))

    # Título
    tam_fuente = 46
    fuente_titulo = ImageFont.truetype(F_SERIF_BOLD, tam_fuente)
    lineas = envolver(draw, titulo, fuente_titulo, ancho_texto)
    while len(lineas) > 4 and tam_fuente > 30:
        tam_fuente -= 3
        fuente_titulo = ImageFont.truetype(F_SERIF_BOLD, tam_fuente)
        lineas = envolver(draw, titulo, fuente_titulo, ancho_texto)

    y = tag_y + 34
    alto_linea = int(tam_fuente * 1.16)
    for linea in lineas:
        draw.text((margen, y), linea, font=fuente_titulo, fill=(255, 255, 255, 255))
        y += alto_linea

    # Subtítulo
    if subtitulo:
        y += 10
        fuente_sub = ImageFont.truetype(F_SERIF_ITALIC, 22)
        lineas_sub = envolver(draw, subtitulo, fuente_sub, ancho_texto)[:3]
        for linea in lineas_sub:
            draw.text((margen, y), linea, font=fuente_sub, fill=(230, 230, 235, 235))
            y += 30

    # Marca jgonzalez.app (igual que portada_titulo.py)
    fuente_marca = ImageFont.truetype(FUENTE_TAG, 24)
    marca = "jgonzalez.app"
    ancho_marca = draw.textlength(marca, font=fuente_marca)
    pad_x, pad_y = 16, 10
    linea_ancho, linea_gap = 3, 12
    placa_y0 = ALTO - 60
    placa_alto = 24 + pad_y * 2
    placa_ancho = linea_ancho + linea_gap + ancho_marca + pad_x * 2
    placa_x0 = margen
    draw.rounded_rectangle(
        (placa_x0, placa_y0, placa_x0 + placa_ancho, placa_y0 + placa_alto),
        radius=8,
        fill=(10, 12, 18, 150),
    )
    linea_x0 = placa_x0 + pad_x
    draw.rectangle(
        (linea_x0, placa_y0 + 7, linea_x0 + linea_ancho, placa_y0 + placa_alto - 7),
        fill=(*acento, 255),
    )
    draw.text(
        (linea_x0 + linea_ancho + linea_gap, placa_y0 + pad_y),
        marca,
        font=fuente_marca,
        fill=(255, 255, 255, 255),
    )

    base.convert("RGB").save(salida, quality=85, optimize=True)
    print(f"OK: {salida}")


if __name__ == "__main__":
    if len(sys.argv) != 6:
        print(__doc__)
        sys.exit(1)
    try:
        generar(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
    except Exception as err:  # noqa: BLE001
        print(f"ERROR generando portada de libro: {err}", file=sys.stderr)
        sys.exit(1)
