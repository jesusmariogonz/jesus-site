#!/usr/bin/env python3
"""
Genera un "one pager" estilo portada de diario (tipo El País/El Economista)
con las notas más leídas de la semana en jgonzalez.app. Distribución
asimétrica: no todas las historias tienen foto, no todas tienen el mismo
tamaño. Uso puntual, no forma parte del pipeline automático.

Uso: python3 scripts/one_pager_semana.py --out ruta.jpg
"""
import json
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


def texto_bloque(draw, x, y, texto, fuente, ancho_max, color, interlinea, max_lineas=None):
    lineas = envolver(draw, texto, fuente, ancho_max)
    if max_lineas:
        lineas = lineas[:max_lineas]
    for linea in lineas:
        draw.text((x, y), linea, font=fuente, fill=color)
        y += interlinea
    return y


def foto_cover(path, ancho, alto, recorte_superior=None):
    im = Image.open(path).convert("RGB")
    if recorte_superior:
        w0, h0 = im.size
        im = im.crop((0, 0, w0, int(h0 * recorte_superior)))
    w, h = im.size
    ratio_obj = ancho / alto
    ratio = w / h
    if ratio > ratio_obj:
        nw = int(h * ratio_obj)
        x0 = (w - nw) // 2
        im = im.crop((x0, 0, x0 + nw, h))
    else:
        nh = int(w / ratio_obj)
        y0 = (h - nh) // 2
        im = im.crop((0, y0, w, y0 + nh))
    return im.resize((int(ancho), int(alto)), Image.LANCZOS)


def pegar_foto(img, path, x, y, ancho, alto, recorte_superior=0.55):
    if not path:
        return False
    try:
        foto = foto_cover(path, ancho, alto, recorte_superior=recorte_superior)
        img.paste(foto, (int(x), int(y)))
        return True
    except (FileNotFoundError, OSError):
        return False


def dibujar_historia(draw, img, x, y, w, historia, *, foto_h=0, tam_titulo=22,
                      interlinea_titulo=26, max_lineas_titulo=3, tam_desc=15,
                      interlinea_desc=20, max_lineas_desc=4, con_regla_fecha=True):
    """Dibuja una historia (kicker+fecha, título, descripción) en (x,y) con
    ancho w. Si foto_h > 0, pega la foto arriba. Regresa la y final."""
    if foto_h and historia.get("foto"):
        pegar_foto(img, historia["foto"], x, y, w, foto_h)
        y += foto_h + 10

    f_kicker = ImageFont.truetype(F_MONO_BOLD, 13)
    f_fecha = ImageFont.truetype(F_MONO_BOLD, 13)
    if con_regla_fecha:
        draw.text((x, y), historia["kicker"], font=f_kicker, fill=AZUL)
        fw = draw.textlength(historia["fecha"], font=f_fecha)
        draw.text((x + w - fw, y), historia["fecha"], font=f_fecha, fill=GRIS)
        y += 20

    f_titulo = ImageFont.truetype(F_SERIF_BLACK, tam_titulo)
    y = texto_bloque(draw, x, y, historia["titulo"], f_titulo, w, TINTA,
                      interlinea_titulo, max_lineas=max_lineas_titulo)
    y += 6
    f_desc = ImageFont.truetype(F_SERIF_REG, tam_desc)
    y = texto_bloque(draw, x, y, historia["desc"], f_desc, w, GRIS,
                      interlinea_desc, max_lineas=max_lineas_desc)
    return y


# ------------------------------------------------------------------
# El contenido (INTRO, FLASH, MAIN, SECUNDARIA_LARGA/CORTA, DATOS,
# MEDIA, ABAJO, semana/edicion) ahora vive en un JSON externo, para que
# la rutina automática semanal pueda regenerarlo sin tocar este código.
# Ver scripts/one_pager_semana_datos.json (o --datos <ruta>).
# ------------------------------------------------------------------


def generar(salida, datos):
    INTRO = datos["intro"]
    FLASH = datos["flash"]
    MAIN = datos["main"]
    SECUNDARIA_LARGA = datos["secundaria_larga"]
    SECUNDARIA_CORTA = datos["secundaria_corta"]
    DATOS = [(d["valor"], d["etiqueta"]) for d in datos["datos"]]
    MEDIA = datos["media"]
    ABAJO = datos["abajo"]
    semana_texto = datos.get("semana_texto", "")
    edicion_texto = datos.get("edicion_texto", "EDICIÓN SEMANAL · TOP 13")

    img = Image.new("RGB", (ANCHO, 3400), CREMA)
    draw = ImageDraw.Draw(img)
    margen = 60

    # ---- masthead ----
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
    draw.text((margen, y), semana_texto, font=f_meta, fill=TINTA)
    ed = edicion_texto
    ew = draw.textlength(ed, font=f_meta)
    draw.text((ANCHO - margen - ew, y), ed, font=f_meta, fill=TINTA)
    y += 30
    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=1)
    y += 20

    # ---- intro ----
    f_intro = ImageFont.truetype(F_SERIF_ITALIC, 19)
    y = texto_bloque(draw, margen, y, INTRO, f_intro, ANCHO - margen * 2, (45, 40, 33), 26)
    y += 16
    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=1)
    y += 22

    # ---- franja flash: 3 notas cortas, sin foto ----
    fila_y = y
    n = len(FLASH)
    gap = 40
    fw_col = (ANCHO - margen * 2 - gap * (n - 1)) / n
    max_y = fila_y
    for i, h in enumerate(FLASH):
        fx = margen + i * (fw_col + gap)
        fin = dibujar_historia(draw, img, fx, fila_y, fw_col, h, foto_h=0,
                                tam_titulo=19, interlinea_titulo=23, max_lineas_titulo=2,
                                tam_desc=14, interlinea_desc=18, max_lineas_desc=2)
        max_y = max(max_y, fin)
        if i < n - 1:
            lx = fx + fw_col + gap / 2
            draw.line((lx, fila_y, lx, max_y + 10), fill=LINEA, width=1)
    y = max_y + 16
    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=2)
    y += 26

    # ---- fila principal: historia grande (izq, ~62%) + columna derecha (~38%) ----
    col_gap = 50
    w_izq = int((ANCHO - margen * 2 - col_gap) * 0.62)
    w_der = ANCHO - margen * 2 - col_gap - w_izq
    x_izq = margen
    x_der = margen + w_izq + col_gap
    fila_top_y = y

    foto_main_h = 320
    pegar_foto(img, MAIN["foto"], x_izq, y, w_izq, foto_main_h, recorte_superior=0.48)
    ym = y + foto_main_h + 16
    f_kicker_m = ImageFont.truetype(F_MONO_BOLD, 16)
    draw.text((x_izq, ym), MAIN["kicker"], font=f_kicker_m, fill=AZUL)
    fw = draw.textlength(MAIN["fecha"], font=f_kicker_m)
    draw.text((x_izq + w_izq - fw, ym), MAIN["fecha"], font=f_kicker_m, fill=GRIS)
    ym += 32
    f_h1 = ImageFont.truetype(F_SERIF_BLACK, 38)
    ym = texto_bloque(draw, x_izq, ym, MAIN["titulo"], f_h1, w_izq, TINTA, 44)
    ym += 10
    f_dek = ImageFont.truetype(F_SERIF_ITALIC, 18)
    ym = texto_bloque(draw, x_izq, ym, MAIN["dek"], f_dek, w_izq, (60, 55, 48), 25)
    ym += 14

    sub_gap = 30
    sub_w = (w_izq - sub_gap) / 2
    f_body = ImageFont.truetype(F_SERIF_REG, 16)
    lineas_cuerpo = envolver(draw, MAIN["cuerpo"], f_body, sub_w)
    mitad = -(-len(lineas_cuerpo) // 2)
    colA, colB = lineas_cuerpo[:mitad], lineas_cuerpo[mitad:]
    yA = ym
    for linea in colA:
        draw.text((x_izq, yA), linea, font=f_body, fill=TINTA)
        yA += 23
    yB = ym
    for linea in colB:
        draw.text((x_izq + sub_w + sub_gap, yB), linea, font=f_body, fill=TINTA)
        yB += 23
    div_sub_x = x_izq + sub_w + sub_gap / 2
    izq_fin = max(yA, yB)
    draw.line((div_sub_x, ym, div_sub_x, izq_fin), fill=LINEA, width=1)

    yd = fila_top_y
    yd = dibujar_historia(draw, img, x_der, yd, w_der, SECUNDARIA_LARGA, foto_h=0,
                          tam_titulo=24, interlinea_titulo=28, max_lineas_titulo=2,
                          tam_desc=16, interlinea_desc=23, max_lineas_desc=8)
    yd += 20
    draw.line((x_der, yd, x_der + w_der, yd), fill=LINEA, width=1)
    yd += 20
    yd = dibujar_historia(draw, img, x_der, yd, w_der, SECUNDARIA_CORTA, foto_h=150,
                          tam_titulo=21, interlinea_titulo=25, max_lineas_titulo=2,
                          tam_desc=15, interlinea_desc=20, max_lineas_desc=3)

    fila_fin = max(izq_fin, yd) + 10
    div_x = x_der - col_gap / 2
    draw.line((div_x, fila_top_y, div_x, fila_fin), fill=LINEA, width=1)

    y = fila_fin + 26
    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=2)
    y += 26

    # ---- franja de datos clave ----
    f_dk_k = ImageFont.truetype(F_MONO_BOLD, 15)
    draw.text((margen, y), "LA SEMANA EN NÚMEROS", font=f_dk_k, fill=GRIS)
    y += 30
    n4 = len(DATOS)
    col_w = (ANCHO - margen * 2 - 24 * (n4 - 1)) / n4
    f_val = ImageFont.truetype(F_SERIF_BLACK, 40)
    f_lab = ImageFont.truetype(F_SANS, 15)
    max_dy = y
    for i, (valor, etiqueta) in enumerate(DATOS):
        cx = margen + i * (col_w + 24)
        draw.text((cx, y), valor, font=f_val, fill=AZUL)
        dy = y + 52
        dy = texto_bloque(draw, cx, dy, etiqueta, f_lab, col_w, GRIS, 19)
        max_dy = max(max_dy, dy)
        if i < n4 - 1:
            lx = cx + col_w + 12
            draw.line((lx, y, lx, max_dy), fill=LINEA, width=1)
    y = max_dy + 20
    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=2)
    y += 26

    # ---- fila media: 3 historias, mixtas (foto/sin foto) ----
    fila_y = y
    n3 = len(MEDIA)
    gap3 = 40
    w3 = (ANCHO - margen * 2 - gap3 * (n3 - 1)) / n3
    max_y = fila_y
    for i, h in enumerate(MEDIA):
        mx = margen + i * (w3 + gap3)
        fh = 160 if h["foto"] else 0
        fin = dibujar_historia(draw, img, mx, fila_y, w3, h, foto_h=fh,
                                tam_titulo=21, interlinea_titulo=25, max_lineas_titulo=3,
                                tam_desc=15, interlinea_desc=20,
                                max_lineas_desc=4 if h["foto"] else 10)
        max_y = max(max_y, fin)
        if i < n3 - 1:
            lx = mx + w3 + gap3 / 2
            draw.line((lx, fila_y, lx, max_y + 10), fill=LINEA, width=1)
    y = max_y + 20
    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=2)
    y += 26

    # ---- fila inferior: 4 historias compactas, mixtas ----
    f_ot_k = ImageFont.truetype(F_MONO_BOLD, 14)
    draw.text((margen, y), "TAMBIÉN ESTA SEMANA", font=f_ot_k, fill=GRIS)
    y += 28
    fila_y = y
    n5 = len(ABAJO)
    gap4 = 32
    w4 = (ANCHO - margen * 2 - gap4 * (n5 - 1)) / n5
    max_y = fila_y
    for i, h in enumerate(ABAJO):
        bx = margen + i * (w4 + gap4)
        fh = 110 if h["foto"] else 0
        fin = dibujar_historia(draw, img, bx, fila_y, w4, h, foto_h=fh,
                                tam_titulo=18, interlinea_titulo=22, max_lineas_titulo=2,
                                tam_desc=14, interlinea_desc=18,
                                max_lineas_desc=3 if h["foto"] else 8)
        max_y = max(max_y, fin)
        if i < n5 - 1:
            lx = bx + w4 + gap4 / 2
            draw.line((lx, fila_y, lx, max_y + 10), fill=LINEA, width=1)
    y = max_y + 20

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
    salida = sys.argv[idx + 1]
    idx_d = sys.argv.index("--datos")
    ruta_datos = sys.argv[idx_d + 1]
    with open(ruta_datos, encoding="utf-8") as f:
        datos = json.load(f)
    generar(salida, datos)
