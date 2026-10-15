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

ANCHO, ALTO = 1200, 675  # relación 16:9 — suficiente para cualquier card del sitio;
# antes era 1600x900 a calidad 90, lo que generaba archivos de ~250-900KB cada uno
# y disparó el uso de Deployment Storage de Vercel (425 portadas × ese peso, en
# cada deployment retenido). 1200x675 a calidad 80 se ve igual de nítido en
# pantalla y pesa una fracción.

FUENTE_TITULO = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FUENTE_TAG = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

# Paleta de colores de acento — antes todas las portadas usaban el mismo
# ámbar fijo para la etiqueta de categoría y la marca "jgonzalez.app". Ahora
# el color varía según la categoría (mismo color siempre para la misma
# categoría, así se mantiene cierta identidad visual por tema sin que
# TODO el sitio se vea amarillo).
PALETA_ACENTO = [
    (111, 168, 255),  # azul
    (90, 209, 200),  # teal
    (126, 217, 87),  # verde
    (255, 111, 97),  # coral
    (184, 156, 255),  # morado
    (255, 143, 177),  # rosa
    (255, 200, 90),  # ámbar (el original — ya no es el único)
]
COLOR_POR_CATEGORIA = {
    "ia & genai": PALETA_ACENTO[0],
    "ia": PALETA_ACENTO[0],
    "cloud": PALETA_ACENTO[0],
    "data architecture": PALETA_ACENTO[0],
    "data model": PALETA_ACENTO[0],
    "data engineering": PALETA_ACENTO[0],
    "snowflake": PALETA_ACENTO[0],
    "business": PALETA_ACENTO[1],
    "business analytics": PALETA_ACENTO[1],
    "fintech": PALETA_ACENTO[2],
    "geopolitics": PALETA_ACENTO[3],
    "opinión": PALETA_ACENTO[4],
    "opinion": PALETA_ACENTO[4],
    "leadership": PALETA_ACENTO[5],
}


def color_categoria(categoria):
    """Color de acento para una categoría — fijo para las conocidas (ver
    COLOR_POR_CATEGORIA), determinístico por hash para cualquier otra (ej.
    "TESIS · SEMANA 4", "Pulso de Mercado") para que varíe entre portadas
    pero nunca cambie para la misma categoría entre una corrida y otra."""
    clave = categoria.strip().lower()
    if clave in COLOR_POR_CATEGORIA:
        return COLOR_POR_CATEGORIA[clave]
    indice = sum(ord(c) for c in clave) % len(PALETA_ACENTO)
    return PALETA_ACENTO[indice]


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
    tratar_imagen(base, salida, titulo, categoria)


def tratar_imagen(base, salida, titulo, categoria):
    """Igual que generar(), pero recibe una imagen PIL ya abierta en vez de
    una ruta — la usa también scripts/portada_ia.py sobre la imagen que
    acaba de generar OpenAI, sin tener que guardarla y reabrirla primero."""
    base = base.convert("RGB")
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

    # Margen "title-safe": el sitio recorta esta imagen 16:9 a proporciones
    # más angostas en distintos lugares (el carrusel la muestra en 4:3), lo
    # que recorta ~12.5% de cada lado. Un margen de 72px quedaba fuera de
    # esa zona segura y el texto se cortaba por los bordes; 230px asegura
    # que el texto sobreviva incluso el recorte 4:3 más agresivo del sitio.
    margen = 230
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

    acento = color_categoria(categoria)

    # Etiqueta de categoría, siempre arriba del bloque de título con margen fijo.
    fuente_tag = ImageFont.truetype(FUENTE_TAG, 30)
    tag_y = y_titulo - 56
    draw.text((margen, tag_y), categoria.upper(), font=fuente_tag, fill=(*acento, 255))

    y = y_titulo
    for linea in lineas:
        draw.text((margen, y), linea, font=fuente_titulo, fill=(255, 255, 255, 255))
        y += alto_linea

    # Marca "jgonzalez.app" en la esquina superior derecha. Antes era una
    # placa sólida color ámbar — se veía como un botón pegado encima de la
    # foto. Ahora: fondo oscuro translúcido (solo para legibilidad, no un
    # bloque de color) + una línea vertical de acento (el mismo color que
    # la etiqueta de categoría) al lado del texto, en vez de encerrarlo.
    fuente_marca = ImageFont.truetype(FUENTE_TAG, 36)
    marca = "jgonzalez.app"
    ancho_marca = draw.textlength(marca, font=fuente_marca)
    pad_x, pad_y = 22, 14
    linea_ancho, linea_gap = 4, 16

    placa_x1 = ANCHO - 40
    placa_y1 = 40
    placa_alto = 36 + pad_y * 2
    placa_ancho = linea_ancho + linea_gap + ancho_marca + pad_x * 2
    placa_x0 = placa_x1 - placa_ancho
    placa_y0 = placa_y1

    draw.rounded_rectangle(
        (placa_x0, placa_y0, placa_x1, placa_y0 + placa_alto),
        radius=10,
        fill=(10, 12, 18, 150),
    )
    linea_x0 = placa_x0 + pad_x
    draw.rectangle(
        (linea_x0, placa_y0 + 10, linea_x0 + linea_ancho, placa_y0 + placa_alto - 10),
        fill=(*acento, 255),
    )
    marca_x = linea_x0 + linea_ancho + linea_gap
    marca_y = placa_y0 + pad_y
    draw.text((marca_x, marca_y), marca, font=fuente_marca, fill=(255, 255, 255, 255))

    base.convert("RGB").save(salida, quality=80, optimize=True)
    print(f"OK: {salida} ({len(lineas)} líneas, fuente {tam_fuente}px)")


if __name__ == "__main__":
    if len(sys.argv) != 5:
        print(__doc__)
        sys.exit(1)
    generar(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
