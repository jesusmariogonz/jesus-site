#!/usr/bin/env python3
"""
Genera la tarjeta social (Facebook/Instagram) de una nota: diseño oscuro
de una sola tarjeta (headline + datos clave en grid + tesis), con el logo
de jgonzalez.app. Reemplaza la plantilla anterior (portada + resumen en
el caption): ahora la imagen lleva toda la información y el caption del
post solo trae el link.

Uso: echo '{...}' | python3 scripts/social_card.py --out ruta.jpg

JSON esperado:
{
  "titulo": "...",
  "dek": "bajada/resumen corto (1-3 líneas)",
  "eyebrow": "México & LatAm · Business",   // etiqueta pequeña arriba del título
  "datos": [{"valor": "3.5–5M", "etiqueta": "..."}, ...],   // hasta 4
  "tesis": "frase corta de la tesis editorial"
}
"""
import sys
import json
from PIL import Image, ImageDraw, ImageFont

ANCHO, ALTO = 1080, 1150
FONDO = (11, 17, 32)
TINTA = (237, 242, 250)
GRIS = (139, 150, 171)
GRIS_CLARO = (195, 204, 220)
DORADO = (255, 200, 90)
AZUL = (107, 165, 255)
LINEA = (237, 242, 250)

F_SERIF_BLACK = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
F_SERIF_ITALIC = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
F_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
F_MONO_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
F_SANS_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

ICONO_PATH = "public/branding/jgonzalez-icono.png"


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


def alpha_over(base, color, alpha):
    """Mezcla color (r,g,b) sobre base (r,g,b) con alpha 0-255."""
    return tuple(int(base[i] + (color[i] - base[i]) * (alpha / 255)) for i in range(3))


def generar(datos_nota, salida):
    titulo = datos_nota["titulo"]
    dek = datos_nota.get("dek", "")
    eyebrow = datos_nota.get("eyebrow", "")
    stats = datos_nota.get("datos", [])[:4]
    tesis = datos_nota.get("tesis", "")

    img = Image.new("RGB", (ANCHO, ALTO), FONDO)
    draw = ImageDraw.Draw(img)
    margen = 68

    # masthead
    f_word = ImageFont.truetype(F_SANS_BOLD, 34)
    try:
        icono = Image.open(ICONO_PATH).convert("RGBA").resize((42, 42), Image.LANCZOS)
    except FileNotFoundError:
        icono = None
    x0, y0 = margen, 56
    if icono:
        img.paste(icono, (x0, y0), icono)
        x0 += 42 + 10
    draw.text((x0, y0 - 4), "jgonzalez", font=f_word, fill=TINTA)
    x0 += draw.textlength("jgonzalez", font=f_word)
    draw.text((x0, y0 - 4), ".app", font=f_word, fill=(200, 60, 50))

    f_kicker = ImageFont.truetype(F_MONO, 13)
    kicker = "NOTAS DE NEGOCIO & DATOS"
    kw = draw.textlength(kicker, font=f_kicker)
    draw.text((ANCHO - margen - kw, y0 + 6), kicker, font=f_kicker, fill=GRIS)

    y = 140

    # eyebrow: punto dorado + texto
    if eyebrow:
        draw.ellipse((margen, y + 6, margen + 8, y + 14), fill=DORADO)
        f_eb = ImageFont.truetype(F_MONO, 15)
        draw.text((margen + 18, y), eyebrow.upper(), font=f_eb, fill=DORADO)
        y += 40

    # headline
    ancho_texto = ANCHO - margen * 2
    tam = 58
    f_h1 = ImageFont.truetype(F_SERIF_BLACK, tam)
    lineas_h1 = envolver(draw, titulo, f_h1, ancho_texto)
    while len(lineas_h1) > 5 and tam > 38:
        tam -= 2
        f_h1 = ImageFont.truetype(F_SERIF_BLACK, tam)
        lineas_h1 = envolver(draw, titulo, f_h1, ancho_texto)
    alto_h1 = int(tam * 1.1)
    for linea in lineas_h1:
        draw.text((margen, y), linea, font=f_h1, fill=TINTA)
        y += alto_h1
    y += 22

    # dek
    f_dek = ImageFont.truetype(F_SERIF_ITALIC, 22)
    for linea in envolver(draw, dek, f_dek, ancho_texto):
        draw.text((margen, y), linea, font=f_dek, fill=GRIS_CLARO)
        y += 31
    y += 30

    # datos clave: grid 2x2, tarjetas translúcidas
    if stats:
        cols = 2
        gap = 18
        card_w = (ancho_texto - gap) // cols
        card_h = 108
        f_val = ImageFont.truetype(F_MONO_BOLD, 34)
        f_lab = ImageFont.truetype(F_SANS_BOLD, 13)
        for i, stat in enumerate(stats):
            col = i % cols
            row = i // cols
            cx = margen + col * (card_w + gap)
            cy = y + row * (card_h + gap)
            fill_card = alpha_over(FONDO, TINTA, 13)
            draw.rounded_rectangle((cx, cy, cx + card_w, cy + card_h), radius=14, fill=fill_card, outline=alpha_over(FONDO, TINTA, 36), width=1)
            draw.text((cx + 20, cy + 16), stat["valor"], font=f_val, fill=DORADO)
            ly = cy + 60
            for ll in envolver(draw, stat["etiqueta"], f_lab, card_w - 40)[:2]:
                draw.text((cx + 20, ly), ll, font=f_lab, fill=GRIS)
                ly += 17
        rows = (len(stats) + 1) // cols
        y += rows * (card_h + gap) + 20

    # tesis: recuadro con borde izquierdo azul
    if tesis:
        draw.rectangle((margen, y, margen + 4, y + 130), fill=AZUL)
        f_tk = ImageFont.truetype(F_MONO, 13)
        draw.text((margen + 22, y), "LA TESIS", font=f_tk, fill=AZUL)
        f_te = ImageFont.truetype(F_SERIF_ITALIC, 21)
        ty = y + 30
        lineas_te = envolver(draw, tesis, f_te, ancho_texto - 40)
        for linea in lineas_te:
            draw.text((margen + 22, ty), linea, font=f_te, fill=(223, 229, 240))
            ty += 30

    # pie
    pie_y = ALTO - 100
    draw.line((margen, pie_y, ANCHO - margen, pie_y), fill=alpha_over(FONDO, TINTA, 36), width=1)
    f_pie = ImageFont.truetype(F_MONO, 16)
    draw.text((margen, pie_y + 26), "Nota completa en", font=f_pie, fill=GRIS)
    f_pie_brand = ImageFont.truetype(F_SANS_BOLD, 27)
    bw = draw.textlength("jgonzalez", font=f_pie_brand) + draw.textlength(".app", font=f_pie_brand)
    bx = ANCHO - margen - bw
    draw.text((bx, pie_y + 20), "jgonzalez", font=f_pie_brand, fill=TINTA)
    bx += draw.textlength("jgonzalez", font=f_pie_brand)
    draw.text((bx, pie_y + 20), ".app", font=f_pie_brand, fill=(200, 60, 50))

    img.save(salida, quality=92)
    print(f"OK: {salida}")


if __name__ == "__main__":
    if "--out" not in sys.argv:
        print(__doc__)
        sys.exit(1)
    idx = sys.argv.index("--out")
    salida = sys.argv[idx + 1]
    datos_nota = json.load(sys.stdin)
    generar(datos_nota, salida)
