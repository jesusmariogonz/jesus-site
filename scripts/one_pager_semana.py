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


def foto_cover(path, ancho, alto, recorte_superior=None):
    """Abre y recorta una foto para llenar ancho x alto sin deformarla.
    Las portadas del sitio llevan el título incrustado en el tercio
    inferior: para miniaturas (recorte_superior) usamos solo la mitad de
    arriba de la imagen, que es foto limpia sin texto encima."""
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


def pegar_foto(img, path, x, y, ancho, alto, recorte_superior=None):
    try:
        foto = foto_cover(path, ancho, alto, recorte_superior=recorte_superior)
        img.paste(foto, (int(x), int(y)))
        return True
    except (FileNotFoundError, OSError):
        return False


INTRO = (
    "Una semana marcada por el cierre de la quiebra más larga del acero mexicano, un giro de fondo en "
    "la infraestructura de datos para IA, y un cambio de fase en la carrera de la inteligencia artificial "
    "global — de los benchmarks a los robots, la energía y quién escribe las reglas. Abajo, las 13 notas "
    "más leídas de la semana, con fecha y resumen, para quien se las perdió."
)

MAIN = {
    "kicker": "LO MÁS LEÍDO DE LA SEMANA · BUSINESS",
    "fecha": "25 SEP",
    "titulo": "AHMSA ya tiene comprador: CIESA pagó $1,400 millones por una empresa que debe casi el triple",
    "dek": "El grupo de Arturo Domínguez ganó la subasta de Altos Hornos de México. Tiene 90 días para completar el pago — y una promesa de hacer la planta 12 veces más grande que ningún operador ha demostrado poder cumplir.",
    "cuerpo": "CIESA se convirtió en comprador virtual de AHMSA y su filial minera Minosa, con un depósito de garantía de apenas 56.4 millones de dólares —el 4% de su oferta total— y 90 días para completar el pago. Contra una deuda de casi 3,900 millones de dólares, la recuperación para más de 1,600 acreedores será parcial.",
    "foto": "public/blog/portadas/ahmsa-venta-ciesa-1400-millones-dolares.jpg",
}

LATERAL_IZQ = {
    "kicker": "DATOS COMO NEGOCIO · 2º MÁS LEÍDA",
    "fecha": "24 SEP",
    "titulo": "Fivetran y dbt Labs rediseñan su stack para agentes de IA",
    "desc": "Snowflake y Databricks convergen en la misma apuesta — un cambio de fondo en para quién se construye la infraestructura de datos.",
    "foto": "public/blog/portadas/fivetran-dbt-labs-datos-listos-para-agentes-ia.jpg",
}

LATERAL_DER = {
    "kicker": "IA Y NUEVA ECONOMÍA · 3ª MÁS LEÍDA",
    "fecha": "23 SEP",
    "titulo": "La carrera de la IA cambia de fase",
    "desc": "De los benchmarks a los robots, la energía y las reglas — mientras OpenAI pide que el gobierno de EU le imponga reglas obligatorias.",
    "foto": "public/blog/portadas/carrera-ia-cambia-de-fase-robots-energia-reglas.jpg",
}

DATOS = [
    ("$1,400M", "Oferta de CIESA por AHMSA"),
    ("160M", "Niños en trabajo infantil en el mundo"),
    ("90 años", "Del Holodomor a la guerra en Ucrania"),
    ("10 semanas", "Nueva serie: tesis sobre gobernanza en RAG"),
]

# Top 4 a 13 por visitas (Vercel Analytics), con foto, fecha y resumen corto.
OTRAS = [
    {"kicker": "IA Y NUEVA ECONOMÍA", "fecha": "24 SEP", "titulo": "Lo que Altman y Amodei pidieron a la ONU",
     "desc": "Pidieron estándares globales un día después de que Trump llamara \"globalista\" a esa misma idea.",
     "foto": "public/blog/portadas/altman-amodei-consejo-seguridad-onu-ia.jpg"},
    {"kicker": "DATOS COMO NEGOCIO", "fecha": "25 SEP", "titulo": "El Excel paralelo",
     "desc": "Por qué los equipos siguen desconfiando del dato \"oficial\" aunque la plataforma sea impecable.",
     "foto": "public/blog/portadas/el-excel-paralelo-por-que-los-equipos-desconfian-del-dato-oficial.jpg"},
    {"kicker": "NOTAS DE CAMPO", "fecha": "22 SEP", "titulo": "El experimento de la ciudad de las ratas",
     "desc": "Qué pasó cuando el Universo 25 tuvo todo: comida, agua y refugio — menos espacio.",
     "foto": "public/blog/portadas/experimento-ciudad-de-las-ratas.jpg"},
    {"kicker": "GEOPOLÍTICA", "fecha": "26 SEP", "titulo": "90 años del Holodomor",
     "desc": "La clave para entender —y para desinformar sobre— la guerra en Ucrania.",
     "foto": "public/blog/portadas/holodomor-90-anos-guerra-rusia-ucrania-nazis-mito.jpg"},
    {"kicker": "TESIS · SEMANA 1", "fecha": "27 SEP", "titulo": "Persistencia no gobernada en RAG",
     "desc": "Arranca la serie de 10 semanas sobre gobernanza de datos en sistemas de IA.",
     "foto": "public/blog/portadas/tesis-rag-semana-01-introduccion-planteamiento.jpg"},
    {"kicker": "MÉXICO Y LATAM", "fecha": "22 SEP", "titulo": "La encuesta de Banxico sobre IA",
     "desc": "Casi la mitad de las grandes empresas mexicanas ya usa IA — el doble que hace 9 meses.",
     "foto": "public/blog/portadas/inteligencia-artificial-6.jpg"},
    {"kicker": "SERIE SEMANAL", "fecha": "28 SEP", "titulo": "Lo que se espera esta semana",
     "desc": "Proyecciones verificables de mercado y economía para la semana que entra.",
     "foto": "public/blog/portadas/lo-que-se-espera-esta-semana-28-09-2026.jpg"},
    {"kicker": "MÉXICO Y LATAM", "fecha": "23 SEP", "titulo": "México exporta servidores, no autos",
     "desc": "Las exportaciones de cómputo ya superaron a las automotrices en este semestre.",
     "foto": "public/blog/portadas/mexico-exporta-servidores-no-autos-boom-ia.jpg"},
    {"kicker": "NOTAS DE CAMPO", "fecha": "23 SEP", "titulo": "El mito de las ocho horas de sueño",
     "desc": "No lo inventó un vendedor de colchones — la verdad es más rara.",
     "foto": "public/blog/portadas/mito-ocho-horas-sueno-vendedor-colchones.jpg"},
    {"kicker": "IDEAS Y ENSAYOS", "fecha": "26 SEP", "titulo": "La paradoja de Jevons y la IA",
     "desc": "Hacer los modelos más eficientes no baja el consumo de energía — lo dispara.",
     "foto": "public/blog/portadas/paradoja-de-jevons-ia-eficiencia-mas-consumo.jpg"},
]


def generar(salida):
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
    draw.text((margen, y), "SEMANA DEL 22 AL 28 DE SEPTIEMBRE DE 2026", font=f_meta, fill=TINTA)
    ed = "EDICIÓN SEMANAL · TOP 13"
    ew = draw.textlength(ed, font=f_meta)
    draw.text((ANCHO - margen - ew, y), ed, font=f_meta, fill=TINTA)
    y += 30
    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=1)
    y += 24

    # ---- intro / resumen de la semana ----
    f_intro_k = ImageFont.truetype(F_MONO_BOLD, 15)
    draw.text((margen, y), "EN ESTA EDICIÓN", font=f_intro_k, fill=AZUL)
    y += 26
    f_intro = ImageFont.truetype(F_SERIF_ITALIC, 21)
    y = texto_bloque(draw, img, margen, y, INTRO, f_intro, ANCHO - margen * 2, (45, 40, 33), 29)
    y += 20
    draw.line((margen, y, ANCHO - margen, y), fill=TINTA, width=2)
    y += 30

    # ---- fila superior: lateral izq | historia principal | lateral der ----
    col_gap = 40
    col_lat_w = 330
    col_main_w = ANCHO - margen * 2 - col_lat_w * 2 - col_gap * 2
    x_izq = margen
    x_main = margen + col_lat_w + col_gap
    x_der = x_main + col_main_w + col_gap

    fila_top_y = y
    foto_lat_h = 170

    # lateral izquierda
    pegar_foto(img, LATERAL_IZQ["foto"], x_izq, y, col_lat_w, foto_lat_h, recorte_superior=0.55)
    yl = y + foto_lat_h + 14
    f_kicker_s = ImageFont.truetype(F_MONO_BOLD, 13)
    f_fecha_s = ImageFont.truetype(F_MONO_BOLD, 13)
    yl = texto_bloque(draw, img, x_izq, yl, LATERAL_IZQ["kicker"], f_kicker_s, col_lat_w, AZUL, 18)
    draw.text((x_izq, yl), LATERAL_IZQ["fecha"], font=f_fecha_s, fill=GRIS)
    yl += 22
    f_h3 = ImageFont.truetype(F_SERIF_BLACK, 25)
    yl = texto_bloque(draw, img, x_izq, yl, LATERAL_IZQ["titulo"], f_h3, col_lat_w, TINTA, 29)
    yl += 6
    f_desc = ImageFont.truetype(F_SERIF_REG, 16)
    yl = texto_bloque(draw, img, x_izq, yl, LATERAL_IZQ["desc"], f_desc, col_lat_w, GRIS, 22)

    # lateral derecha
    pegar_foto(img, LATERAL_DER["foto"], x_der, y, col_lat_w, foto_lat_h, recorte_superior=0.55)
    yr = y + foto_lat_h + 14
    yr = texto_bloque(draw, img, x_der, yr, LATERAL_DER["kicker"], f_kicker_s, col_lat_w, AZUL, 18)
    draw.text((x_der, yr), LATERAL_DER["fecha"], font=f_fecha_s, fill=GRIS)
    yr += 22
    yr = texto_bloque(draw, img, x_der, yr, LATERAL_DER["titulo"], f_h3, col_lat_w, TINTA, 29)
    yr += 6
    yr = texto_bloque(draw, img, x_der, yr, LATERAL_DER["desc"], f_desc, col_lat_w, GRIS, 22)

    # ---- historia principal (centro), con foto ----
    ym = y
    foto_main_h = 260
    pegar_foto(img, MAIN["foto"], x_main, ym, col_main_w, foto_main_h, recorte_superior=0.48)
    ym += foto_main_h + 16
    f_kicker_m = ImageFont.truetype(F_MONO_BOLD, 16)
    draw.text((x_main, ym), MAIN["kicker"], font=f_kicker_m, fill=AZUL)
    f_fecha_m = ImageFont.truetype(F_MONO_BOLD, 16)
    fw = draw.textlength(MAIN["fecha"], font=f_fecha_m)
    draw.text((x_main + col_main_w - fw, ym), MAIN["fecha"], font=f_fecha_m, fill=GRIS)
    ym += 32
    f_h1 = ImageFont.truetype(F_SERIF_BLACK, 40)
    ym = texto_bloque(draw, img, x_main, ym, MAIN["titulo"], f_h1, col_main_w, TINTA, 46)
    ym += 10
    f_dek = ImageFont.truetype(F_SERIF_ITALIC, 19)
    ym = texto_bloque(draw, img, x_main, ym, MAIN["dek"], f_dek, col_main_w, (60, 55, 48), 26)
    ym += 14
    f_body = ImageFont.truetype(F_SERIF_REG, 17)
    ym = texto_bloque(draw, img, x_main, ym, MAIN["cuerpo"], f_body, col_main_w, TINTA, 24)

    fila_top_fin = max(yl, yr, ym) + 10
    div_x1 = x_main - col_gap / 2
    div_x2 = x_der - col_gap / 2
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

    # ---- top 4-13, grid con fotos ----
    f_ot_k = ImageFont.truetype(F_MONO_BOLD, 14)
    draw.text((margen, y), "TOP 13 DE LA SEMANA (4ª A 13ª MÁS LEÍDA)", font=f_ot_k, fill=GRIS)
    y += 32
    cols = 3
    gap = 34
    ow = (ANCHO - margen * 2 - gap * (cols - 1)) / cols
    foto_h = 130
    f_ok = ImageFont.truetype(F_MONO_BOLD, 13)
    f_fecha_o = ImageFont.truetype(F_MONO_BOLD, 13)
    f_ot = ImageFont.truetype(F_SERIF_BLACK, 20)
    f_od = ImageFont.truetype(F_SERIF_REG, 15)
    row_h = 300
    for i, item in enumerate(OTRAS):
        col = i % cols
        row = i // cols
        ox = margen + col * (ow + gap)
        oy = y + row * row_h
        pegar_foto(img, item["foto"], ox, oy, ow, foto_h, recorte_superior=0.55)
        oyy = oy + foto_h + 12
        draw.text((ox, oyy), item["kicker"], font=f_ok, fill=AZUL)
        fw = draw.textlength(item["fecha"], font=f_fecha_o)
        draw.text((ox + ow - fw, oyy), item["fecha"], font=f_fecha_o, fill=GRIS)
        oyy += 22
        oyy = texto_bloque(draw, img, ox, oyy, item["titulo"], f_ot, ow, TINTA, 24, max_lineas=2)
        oyy += 6
        texto_bloque(draw, img, ox, oyy, item["desc"], f_od, ow, GRIS, 20, max_lineas=3)
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
