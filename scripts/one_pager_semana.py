#!/usr/bin/env python3
"""
Genera un "one pager" estilo portada de diario (tipo El Economista) con
las notas publicadas esta semana en jgonzalez.app. Uso puntual, no forma
parte del pipeline automático de tarjetas sociales.

Uso: python3 scripts/one_pager_semana.py --out ruta.jpg
Los datos de las notas están hardcodeados abajo (EDICIONES) — editar ahí
para reusar el script en otra semana.
"""
from PIL import Image, ImageDraw, ImageFont

ANCHO = 1600
CREMA = (245, 232, 208)
TINTA = (25, 20, 15)
AZUL = (0, 110, 160)
GRIS = (90, 85, 78)
LINEA = (25, 20, 15)

F_SERIF_BLACK = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
F_SERIF_ITALIC = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
F_SERIF_REG = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
F_SANS_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
F_SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
F_MONO_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

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


def texto_bloque(draw, img, x, y, texto, fuente, ancho_max, color, interlinea, max_lineas=None):
    lineas = envolver(draw, texto, fuente, ancho_max)
    if max_lineas:
        lineas = lineas[:max_lineas]
    for linea in lineas:
        draw.text((x, y), linea, font=fuente, fill=color)
        y += interlinea
    return y


MAIN = {
    "kicker": "EN PRIMER PLANO · BUSINESS",
    "titulo": "AHMSA ya tiene comprador: CIESA pagó $1,400 millones por una empresa que debe casi el triple",
    "dek": "El grupo de Arturo Domínguez ganó la subasta de Altos Hornos de México. Tiene 90 días para completar el pago — y una promesa de hacer la planta 12 veces más grande que ningún operador ha demostrado poder cumplir.",
    "cuerpo": "CIESA se convirtió en comprador virtual de AHMSA y su filial minera Minosa, con un depósito de garantía de apenas 56.4 millones de dólares —el 4% de su oferta total— y 90 días para completar el pago. Contra una deuda de casi 3,900 millones de dólares, la recuperación para más de 1,600 acreedores será parcial. Domínguez prometió reactivar la planta en seis meses bajo la marca CIESA Desarrollo Acero — una promesa hecha por una constructora sin trayectoria previa operando una acerería a esta escala.",
}

LATERAL_IZQ = {
    "kicker": "IDEAS Y ENSAYOS",
    "titulo": "La paradoja de Jevons y la IA",
    "desc": "Hacer los modelos más eficientes no baja el consumo de energía de la IA — lo dispara. El mismo mecanismo que multiplicó el consumo de carbón en 1865.",
}

LATERAL_DER = {
    "kicker": "MÉXICO Y LATAM",
    "titulo": "LEGO y el mito del nearshoring",
    "desc": "400 millones de dólares más en Nuevo León no es una empresa descubriendo México: es una que ya no puede irse sin perder mil millones invertidos.",
}

DATOS = [
    ("$1,400M", "Oferta de CIESA por AHMSA"),
    ("160M", "Niños en trabajo infantil en el mundo"),
    ("90 años", "Del Holodomor a la guerra en Ucrania"),
    ("10 semanas", "Nueva serie: tesis sobre gobernanza en RAG"),
]

OTRAS = [
    ("GEOPOLÍTICA", "90 años del Holodomor", "La clave para entender —y desinformar sobre— la guerra en Ucrania."),
    ("OPINIÓN", "Raskolnikov y el mito del fundador", "La teoría del hombre extraordinario, 160 años después."),
    ("OPINIÓN", "El trabajo infantil en el mundo", "Historia, datos duros y por qué la meta 2025 se dio por perdida."),
    ("NOTAS DE CAMPO", "El experimento de la ciudad de las ratas", "Qué pasó cuando el Universo 25 tuvo todo, menos espacio."),
    ("NOTAS DE CAMPO", "El mito de las ocho horas de sueño", "No lo inventó un vendedor de colchones — la verdad es más rara."),
    ("DATOS COMO NEGOCIO", "El Excel paralelo", "Por qué los equipos siguen desconfiando del dato \"oficial\"."),
    ("IA Y NUEVA ECONOMÍA", "Qué es un \"agent context layer\"", "La pieza que falta entre tus datos y un agente que no invente."),
    ("TESIS · SEMANA 1-2", "Persistencia no gobernada en RAG", "Arranca la serie de 10 semanas sobre gobernanza de datos en IA."),
]


def generar(salida):
    img = Image.new("RGB", (ANCHO, 100), CREMA)  # temporal, se recorta al final
    img = Image.new("RGB", (ANCHO, 3000), CREMA)
    draw = ImageDraw.Draw(img)
    margen = 60

    # masthead
    y = 50
    try:
        icono = Image.open(ICONO_PATH).convert("RGBA").resize((90, 90), Image.LANCZOS)
    except FileNotFoundError:
        icono = None
    f_titulo_sitio = ImageFont.truetype(F_SERIF_BLACK, 90)
    texto_sitio = "jgonzalez.app"
    ancho_sitio = draw.textlength(texto_sitio, font=f_titulo_sitio)
    ancho_total = (icono.width + 20 if icono else 0) + ancho_sitio
    x0 = (ANCHO - ancho_total) / 2
    if icono:
        img.paste(icono, (int(x0), int(y + 5)), icono)
        x0 += icono.width + 20
    draw.text((x0, y), texto_sitio, font=f_titulo_sitio, fill=TINTA)
    y += 110

    f_sub = ImageFont.truetype(F_SANS_BOLD, 20)
    sub = "www.jgonzalez.app  ·  NOTAS DE NEGOCIO, DATOS E IA"
    sw = draw.textlength(sub, font=f_sub)
    draw.text(((ANCHO - sw) / 2, y), sub, font=f_sub, fill=AZUL)
    y += 42

    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=2)
    y += 14
    f_meta = ImageFont.truetype(F_SANS, 18)
    draw.text((margen, y), "SEMANA DEL 22 AL 28 DE SEPTIEMBRE DE 2026", font=f_meta, fill=TINTA)
    ed = "EDICIÓN SEMANAL"
    ew = draw.textlength(ed, font=f_meta)
    draw.text((ANCHO - margen - ew, y), ed, font=f_meta, fill=TINTA)
    y += 30
    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=1)
    y += 30

    # ---- fila superior: lateral izq | historia principal | lateral der ----
    col_gap = 40
    col_lat_w = 330
    col_main_w = ANCHO - margen * 2 - col_lat_w * 2 - col_gap * 2
    x_izq = margen
    x_main = margen + col_lat_w + col_gap
    x_der = x_main + col_main_w + col_gap

    fila_top_y = y

    # lateral izquierda
    f_kicker_s = ImageFont.truetype(F_MONO_BOLD, 15)
    draw.text((x_izq, y), LATERAL_IZQ["kicker"], font=f_kicker_s, fill=AZUL)
    yl = y + 26
    f_h3 = ImageFont.truetype(F_SERIF_BLACK, 26)
    yl = texto_bloque(draw, img, x_izq, yl, LATERAL_IZQ["titulo"], f_h3, col_lat_w, TINTA, 30)
    yl += 8
    f_desc = ImageFont.truetype(F_SERIF_REG, 17)
    yl = texto_bloque(draw, img, x_izq, yl, LATERAL_IZQ["desc"], f_desc, col_lat_w, GRIS, 23)

    # lateral derecha
    draw.text((x_der, y), LATERAL_DER["kicker"], font=f_kicker_s, fill=AZUL)
    yr = y + 26
    yr = texto_bloque(draw, img, x_der, yr, LATERAL_DER["titulo"], f_h3, col_lat_w, TINTA, 30)
    yr += 8
    yr = texto_bloque(draw, img, x_der, yr, LATERAL_DER["desc"], f_desc, col_lat_w, GRIS, 23)

    # separadores verticales
    fila_top_fin = max(yl, yr) + 10
    div_x1 = x_main - col_gap / 2
    div_x2 = x_der - col_gap / 2

    # ---- historia principal (centro) ----
    ym = y
    f_kicker_m = ImageFont.truetype(F_MONO_BOLD, 16)
    draw.text((x_main, ym), MAIN["kicker"], font=f_kicker_m, fill=AZUL)
    ym += 30
    f_h1 = ImageFont.truetype(F_SERIF_BLACK, 46)
    ym = texto_bloque(draw, img, x_main, ym, MAIN["titulo"], f_h1, col_main_w, TINTA, 52)
    ym += 12
    f_dek = ImageFont.truetype(F_SERIF_ITALIC, 21)
    ym = texto_bloque(draw, img, x_main, ym, MAIN["dek"], f_dek, col_main_w, (60, 55, 48), 29)
    ym += 16
    f_body = ImageFont.truetype(F_SERIF_REG, 18)
    ym = texto_bloque(draw, img, x_main, ym, MAIN["cuerpo"], f_body, col_main_w, TINTA, 26)

    fila_top_fin = max(fila_top_fin, ym + 10)

    draw.line((div_x1, fila_top_y, div_x1, fila_top_fin), fill=LINEA, width=1)
    draw.line((div_x2, fila_top_y, div_x2, fila_top_fin), fill=LINEA, width=1)

    y = fila_top_fin + 26
    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=2)
    y += 30

    # ---- franja de datos clave ----
    f_dk_k = ImageFont.truetype(F_MONO_BOLD, 15)
    draw.text((margen, y), "LA SEMANA EN NÚMEROS", font=f_dk_k, fill=GRIS)
    y += 30
    n = len(DATOS)
    col_w = (ANCHO - margen * 2 - 24 * (n - 1)) / n
    f_val = ImageFont.truetype(F_SERIF_BLACK, 40)
    f_lab = ImageFont.truetype(F_SANS, 15)
    max_dy = y
    for i, (valor, etiqueta) in enumerate(DATOS):
        cx = margen + i * (col_w + 24)
        draw.text((cx, y), valor, font=f_val, fill=AZUL)
        dy = y + 52
        dy = texto_bloque(draw, img, cx, dy, etiqueta, f_lab, col_w, GRIS, 19)
        max_dy = max(max_dy, dy)
        if i < n - 1:
            lx = cx + col_w + 12
            draw.line((lx, y, lx, max_dy), fill=LINEA, width=1)
    y = max_dy + 20
    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=2)
    y += 30

    # ---- otras notas de la semana, grid 4x2 ----
    f_ot_k = ImageFont.truetype(F_MONO_BOLD, 14)
    draw.text((margen, y), "TAMBIÉN ESTA SEMANA", font=f_ot_k, fill=GRIS)
    y += 32
    cols = 4
    gap = 30
    ow = (ANCHO - margen * 2 - gap * (cols - 1)) / cols
    f_ok = ImageFont.truetype(F_MONO_BOLD, 13)
    f_ot = ImageFont.truetype(F_SERIF_BLACK, 19)
    f_od = ImageFont.truetype(F_SERIF_REG, 15)
    row_h = 190
    for i, (kicker, titulo, desc) in enumerate(OTRAS):
        col = i % cols
        row = i // cols
        ox = margen + col * (ow + gap)
        oy = y + row * row_h
        draw.text((ox, oy), kicker, font=f_ok, fill=AZUL)
        oyy = oy + 22
        oyy = texto_bloque(draw, img, ox, oyy, titulo, f_ot, ow, TINTA, 23, max_lineas=3)
        oyy += 6
        texto_bloque(draw, img, ox, oyy, desc, f_od, ow, GRIS, 19, max_lineas=3)
        if col < cols - 1:
            lx = ox + ow + gap / 2
            draw.line((lx, oy, lx, oy + row_h - 30), fill=LINEA, width=1)
    filas = -(-len(OTRAS) // cols)
    y = y + filas * row_h + 10

    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=3)
    y += 24
    f_pie = ImageFont.truetype(F_SANS, 17)
    draw.text((margen, y), "Todas las notas completas, con fuentes verificadas, en jgonzalez.app", font=f_pie, fill=GRIS)
    y += 40

    img = img.crop((0, 0, ANCHO, int(y + 20)))
    img.save(salida, quality=93)
    print(f"OK: {salida} ({img.height}px alto)")


if __name__ == "__main__":
    import sys
    idx = sys.argv.index("--out")
    generar(sys.argv[idx + 1])
