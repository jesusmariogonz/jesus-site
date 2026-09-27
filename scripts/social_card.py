#!/usr/bin/env python3
"""
Genera la tarjeta social (Facebook/Instagram) de una nota: réplica del
diseño de "portada de diario" de dos columnas + sidebar de datos, con el
logo de jgonzalez.app. Reemplaza la plantilla anterior (portada + resumen
en el caption): ahora la imagen lleva toda la información y el caption
del post solo trae el link.

Uso (todo por stdin, JSON, para no pelear con el escapado de shell):
  echo '{...}' | python3 scripts/social_card.py --out ruta.jpg

JSON esperado:
{
  "titulo": "...",
  "dek": "...",                       // bajada/resumen corto (1-2 líneas)
  "categoria": "GEOPOLÍTICA",
  "seccionSecundaria": "90 AÑOS DEL HOLODOMOR",   // opcional, esquina der.
  "cuerpo": "texto plano del cuerpo, 2-4 párrafos cortos...",
  "datos": [{"valor": "3.5–5M", "etiqueta": "..."}, ...],   // hasta 4
  "tesis": "frase corta de la tesis editorial",
  "otras": [{"kicker": "BUSINESS", "titulo": "...", "desc": "..."}, ...] // hasta 3
}
"""
import sys
import json
from PIL import Image, ImageDraw, ImageFont

ANCHO, ALTO = 1080, 1350
CREMA = (243, 240, 232)
TINTA = (20, 26, 36)
GRIS = (91, 100, 114)
GRIS_CUERPO = (28, 35, 46)
LINEA = (201, 194, 178)
ROJO = (181, 50, 31)

F_SERIF_REG = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
F_SERIF_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
F_SERIF_ITALIC = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
F_SERIF_BLACK = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
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


def dibujar_logo(draw, img, x, y, escala=1.0):
    """Dibuja icono + 'jgonzalez.app' con la punta izquierda en (x,y). Regresa el ancho total."""
    tam_icono = int(46 * escala)
    tam_fuente = int(34 * escala)
    f_word = ImageFont.truetype(F_SANS_BOLD, tam_fuente)
    try:
        icono = Image.open(ICONO_PATH).convert("RGBA").resize((tam_icono, tam_icono), Image.LANCZOS)
    except FileNotFoundError:
        icono = None
    cx = x
    if icono:
        img.paste(icono, (int(cx), int(y)), icono)
        cx += tam_icono + int(10 * escala)
    ty = y + (tam_icono - tam_fuente) // 2 - 4
    draw.text((cx, ty), "jgonzalez", font=f_word, fill=TINTA)
    cx += draw.textlength("jgonzalez", font=f_word)
    draw.text((cx, ty), ".app", font=f_word, fill=ROJO)
    cx += draw.textlength(".app", font=f_word)
    return cx - x


def ancho_logo(draw, escala=1.0):
    tam_icono = int(46 * escala)
    f_word = ImageFont.truetype(F_SANS_BOLD, int(34 * escala))
    return tam_icono + int(10 * escala) + draw.textlength("jgonzalez.app", font=f_word)


def generar(datos_nota, salida):
    titulo = datos_nota["titulo"]
    dek = datos_nota.get("dek", "")
    categoria = datos_nota.get("categoria", "")
    seccion_secundaria = datos_nota.get("seccionSecundaria", "")
    cuerpo = datos_nota.get("cuerpo", "")
    stats = datos_nota.get("datos", [])[:4]
    tesis = datos_nota.get("tesis", "")
    otras = datos_nota.get("otras", [])[:3]

    img = Image.new("RGB", (ANCHO, ALTO), CREMA)
    draw = ImageDraw.Draw(img)
    margen = 56

    # ---- masthead, centrado ----
    aw = ancho_logo(draw)
    dibujar_logo(draw, img, (ANCHO - aw) / 2, 44)
    f_kicker = ImageFont.truetype(F_MONO, 13)
    kicker = "NOTAS DE NEGOCIO, DATOS E IA"
    kw = draw.textlength(kicker, font=f_kicker)
    draw.text(((ANCHO - kw) / 2, 100), kicker, font=f_kicker, fill=GRIS)

    y = 128
    draw.rectangle((0, y, ANCHO, y + 4), fill=TINTA)
    draw.line((0, y + 14, ANCHO, y + 14), fill=TINTA, width=1)
    y += 30

    # ---- barra de sección ----
    f_cat = ImageFont.truetype(F_MONO_BOLD, 14)
    draw.text((margen, y), categoria.upper(), font=f_cat, fill=TINTA)
    if seccion_secundaria:
        sw = draw.textlength(seccion_secundaria.upper(), font=f_cat)
        draw.text((ANCHO - margen - sw, y), seccion_secundaria.upper(), font=f_cat, fill=ROJO)
    y += 28
    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=1)
    y += 22

    # ---- headline ----
    ancho_texto = ANCHO - margen * 2
    tam = 42
    f_h1 = ImageFont.truetype(F_SERIF_BLACK, tam)
    lineas_h1 = envolver(draw, titulo, f_h1, ancho_texto)
    while len(lineas_h1) > 4 and tam > 30:
        tam -= 2
        f_h1 = ImageFont.truetype(F_SERIF_BLACK, tam)
        lineas_h1 = envolver(draw, titulo, f_h1, ancho_texto)
    alto_h1 = int(tam * 1.12)
    for linea in lineas_h1:
        draw.text((margen, y), linea, font=f_h1, fill=TINTA)
        y += alto_h1
    y += 10

    # ---- dek ----
    f_dek = ImageFont.truetype(F_SERIF_ITALIC, 19)
    for linea in envolver(draw, dek, f_dek, ancho_texto):
        draw.text((margen, y), linea, font=f_dek, fill=(58, 67, 81))
        y += 27
    y += 18

    body_top = y

    # ---- columna lateral: "en una mirada" + tesis ----
    sidebar_w = 300
    gap_principal = 32
    cuerpo_total_w = ancho_texto - sidebar_w - gap_principal
    sub_gap = 26
    sub_w = (cuerpo_total_w - sub_gap) / 2

    sidebar_x = margen + cuerpo_total_w + gap_principal
    divisor_x = sidebar_x - gap_principal / 2

    sy = body_top
    f_mirada = ImageFont.truetype(F_MONO, 12)
    draw.text((sidebar_x, sy), "EN UNA MIRADA", font=f_mirada, fill=GRIS)
    sy += 18
    draw.line((sidebar_x, sy, ANCHO - margen, sy), fill=TINTA, width=1)
    sy += 16
    f_val = ImageFont.truetype(F_MONO_BOLD, 27)
    f_lab = ImageFont.truetype(F_SANS_BOLD, 12)
    for i, stat in enumerate(stats):
        draw.text((sidebar_x, sy), stat["valor"], font=f_val, fill=TINTA)
        sy += 34
        lab_lineas = envolver(draw, stat["etiqueta"], f_lab, sidebar_w)[:2]
        for ll in lab_lineas:
            draw.text((sidebar_x, sy), ll, font=f_lab, fill=GRIS)
            sy += 16
        sy += 8
        if i < len(stats) - 1:
            for dx in range(0, int(ANCHO - margen - sidebar_x), 8):
                draw.line((sidebar_x + dx, sy, sidebar_x + dx + 4, sy), fill=LINEA, width=1)
            sy += 14

    # tesis: caja oscura que llena el resto del sidebar hasta donde termine el cuerpo (calculado luego)

    # ---- cuerpo en dos sub-columnas con letra capital ----
    f_cuerpo = ImageFont.truetype(F_SERIF_REG, 16)
    interlinea = 22

    palabras = cuerpo.split()
    primera_letra = palabras[0][0] if palabras else ""
    resto_primera = palabras[0][1:] if palabras else ""
    texto_sin_capital = " ".join([resto_primera] + palabras[1:]) if palabras else ""

    # letra capital: ocupa ~2 líneas de alto
    f_cap = ImageFont.truetype(F_SERIF_BLACK, int(interlinea * 2.35))
    cap_w = draw.textlength(primera_letra, font=f_cap) + 8

    # arma todas las líneas del cuerpo respetando el hueco de la letra capital
    # en las primeras 2 líneas de la primera sub-columna.
    def envolver_con_hueco(texto, ancho_normal, ancho_reducido, n_reducidas):
        palabras = texto.split()
        lineas, actual = [], ""
        idx_linea = 0
        for palabra in palabras:
            ancho_disp = ancho_reducido if idx_linea < n_reducidas else ancho_normal
            prueba = f"{actual} {palabra}".strip()
            if draw.textlength(prueba, font=f_cuerpo) <= ancho_disp:
                actual = prueba
            else:
                if actual:
                    lineas.append(actual)
                    idx_linea += 1
                actual = palabra
        if actual:
            lineas.append(actual)
        return lineas

    pie_franja_y = ALTO - 130
    otras_h = 118 if otras else 0
    limite_cuerpo_y = pie_franja_y - otras_h - 20

    todas_lineas = envolver_con_hueco(texto_sin_capital, sub_w, sub_w - cap_w, 2)
    # reparte en dos sub-columnas por mitad de líneas (como column-count:2),
    # nunca más de lo que cabe verticalmente antes de la franja de abajo.
    max_por_col = max(6, int((limite_cuerpo_y - body_top) / interlinea))
    mitad = min(-(-len(todas_lineas) // 2), max_por_col)  # ceil, acotado
    colA = todas_lineas[:mitad]
    colB = todas_lineas[mitad:mitad + max_por_col]

    # columna A, con letra capital sobrepuesta en la esquina
    cx, cy = margen, body_top
    draw.text((cx, cy - 4), primera_letra, font=f_cap, fill=TINTA)
    for i, linea in enumerate(colA):
        lx = cx + (cap_w if i < 2 else 0)
        draw.text((lx, cy), linea, font=f_cuerpo, fill=GRIS_CUERPO)
        cy += interlinea

    cx2, cy2 = margen + sub_w + sub_gap, body_top
    for linea in colB:
        draw.text((cx2, cy2), linea, font=f_cuerpo, fill=GRIS_CUERPO)
        cy2 += interlinea

    cuerpo_fin_y = max(cy, cy2)
    limite_visual = max(limite_cuerpo_y, cuerpo_fin_y)

    # divisor vertical entre sub-columnas
    div2_x = margen + sub_w + sub_gap / 2
    draw.line((div2_x, body_top, div2_x, limite_visual), fill=LINEA, width=1)

    # divisor vertical principal, entre cuerpo y sidebar
    draw.line((divisor_x, body_top, divisor_x, limite_visual), fill=LINEA, width=1)

    # ---- caja de tesis: llena el resto del sidebar hasta la franja de abajo ----
    if tesis:
        caja_y0 = sy + 6
        caja_y1 = max(limite_cuerpo_y, caja_y0 + 90)
        draw.rectangle((sidebar_x, caja_y0, ANCHO - margen, caja_y1), fill=TINTA)
        f_tk = ImageFont.truetype(F_MONO, 11)
        draw.text((sidebar_x + 16, caja_y0 + 16), "LA TESIS", font=f_tk, fill=(255, 200, 90))
        f_te = ImageFont.truetype(F_SANS_BOLD, 13)
        ty = caja_y0 + 40
        for linea in envolver(draw, tesis, f_te, sidebar_w - 32):
            draw.text((sidebar_x + 16, ty), linea, font=f_te, fill=(237, 242, 250))
            ty += 19

    # ---- franja de otras notas ----
    if otras:
        fy = pie_franja_y - otras_h + 14
        draw.line((margen, fy - 14, ANCHO - margen, fy - 14), fill=TINTA, width=1)
        col_w = (ancho_texto - 24 * (len(otras) - 1)) / len(otras)
        f_ok = ImageFont.truetype(F_MONO_BOLD, 11)
        f_ot = ImageFont.truetype(F_SERIF_BOLD, 17)
        f_od = ImageFont.truetype(F_SERIF_REG, 13)
        for i, item in enumerate(otras):
            ox = margen + i * (col_w + 24)
            oy = fy
            draw.text((ox, oy), item.get("kicker", "").upper(), font=f_ok, fill=ROJO)
            oy += 20
            for linea in envolver(draw, item.get("titulo", ""), f_ot, col_w)[:2]:
                draw.text((ox, oy), linea, font=f_ot, fill=TINTA)
                oy += 21
            oy += 3
            for linea in envolver(draw, item.get("desc", ""), f_od, col_w)[:2]:
                draw.text((ox, oy), linea, font=f_od, fill=(58, 67, 81))
                oy += 17
            if i < len(otras) - 1:
                draw.line((ox + col_w + 12, fy, ox + col_w + 12, fy + otras_h - 30), fill=LINEA, width=1)

    # ---- pie ----
    pie_y = ALTO - 96
    draw.line((margen, pie_y, ANCHO - margen, pie_y), fill=TINTA, width=3)
    f_pie = ImageFont.truetype(F_MONO, 15)
    draw.text((margen, pie_y + 22), "Nota completa, con fuentes verificadas, en", font=f_pie, fill=GRIS)
    aw2 = ancho_logo(draw, escala=0.72)
    dibujar_logo(draw, img, ANCHO - margen - aw2, pie_y + 12, escala=0.72)

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
