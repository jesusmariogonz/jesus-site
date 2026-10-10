#!/usr/bin/env node
/* ============================================================
   Equivalente en Node de scripts/portada_titulo.py — compone el
   título de la nota sobre una foto del banco de portadas, con
   degradado oscuro + etiqueta de categoría + marca "jgonzalez.app".

   Por qué existe una versión en Node además de la de Python: este
   script lo corre scripts/fix-portadas-auto.mjs como parte del build
   en Vercel (ver next.config.js), y el build de Vercel no garantiza
   python3 + Pillow disponibles. Usa @napi-rs/canvas (igual que un
   <canvas> de navegador, con su propio motor de texto) y la fuente
   Inter empaquetada vía @fontsource/inter, así que no depende de
   ninguna fuente del sistema ni de red en build time.

   Uso:
     node scripts/portada-titulo.mjs <entrada.jpg> <salida.jpg> "<título>" "<categoría>"
   ============================================================ */

import { createCanvas, GlobalFonts, Image, loadImage } from "@napi-rs/canvas";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const ANCHO = 1200; // antes 1600 — ver nota de tamaño en scripts/portada_titulo.py
const ALTO = 675;

let fuentesRegistradas = false;
function registrarFuentes() {
  if (fuentesRegistradas) return;
  const base = path.join(ROOT, "node_modules/@fontsource/inter/files");
  GlobalFonts.registerFromPath(path.join(base, "inter-latin-800-normal.woff2"), "InterPortada800");
  GlobalFonts.registerFromPath(path.join(base, "inter-latin-700-normal.woff2"), "InterPortada700");
  fuentesRegistradas = true;
}

function recortarCubrir(img, ancho, alto) {
  const ratioObjetivo = ancho / alto;
  const w = img.width;
  const h = img.height;
  const ratio = w / h;
  let sx, sy, sw, sh;
  if (ratio > ratioObjetivo) {
    sh = h;
    sw = h * ratioObjetivo;
    sx = (w - sw) / 2;
    sy = 0;
  } else {
    sw = w;
    sh = w / ratioObjetivo;
    sx = 0;
    sy = (h - sh) / 2;
  }
  return { sx, sy, sw, sh };
}

function envolverTitulo(ctx, texto, anchoMax) {
  const palabras = texto.split(" ");
  const lineas = [];
  let actual = "";
  for (const palabra of palabras) {
    const prueba = actual ? `${actual} ${palabra}` : palabra;
    if (ctx.measureText(prueba).width <= anchoMax) {
      actual = prueba;
    } else {
      if (actual) lineas.push(actual);
      actual = palabra;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

export async function generarPortada(entrada, salida, titulo, categoria) {
  registrarFuentes();

  const img = await loadImage(readFileSync(entrada));
  const canvas = createCanvas(ANCHO, ALTO);
  const ctx = canvas.getContext("2d");

  const { sx, sy, sw, sh } = recortarCubrir(img, ANCHO, ALTO);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, ANCHO, ALTO);

  // Degradado oscuro de abajo hacia arriba para que el texto blanco
  // siempre sea legible, sin importar qué tan clara sea la foto.
  const degradado = ctx.createLinearGradient(0, ALTO * 0.35, 0, ALTO);
  degradado.addColorStop(0, "rgba(10,12,18,0)");
  degradado.addColorStop(1, "rgba(10,12,18,0.92)");
  ctx.fillStyle = degradado;
  ctx.fillRect(0, 0, ANCHO, ALTO);

  // Margen "title-safe": el sitio recorta esta imagen 16:9 a
  // proporciones más angostas en distintos lugares (el carrusel la
  // muestra en 4:3), lo que recorta ~12.5% de cada lado. 230px
  // asegura que el texto sobreviva incluso ese recorte.
  const margen = 230;
  const anchoTexto = ANCHO - margen * 2;

  let tamFuente = 64;
  let lineas;
  for (;;) {
    ctx.font = `800 ${tamFuente}px InterPortada800`;
    lineas = envolverTitulo(ctx, titulo, anchoTexto);
    if (lineas.length <= 4 || tamFuente <= 36) break;
    tamFuente -= 4;
  }

  const altoLinea = Math.round(tamFuente * 1.22);
  const bloqueTitulo = altoLinea * lineas.length;
  const yTitulo = ALTO - 80 - bloqueTitulo;

  // Etiqueta de categoría, siempre arriba del bloque de título.
  ctx.font = "700 30px InterPortada700";
  ctx.fillStyle = "#ffc85a";
  ctx.textBaseline = "top";
  ctx.fillText(categoria.toUpperCase(), margen, yTitulo - 56);

  ctx.font = `800 ${tamFuente}px InterPortada800`;
  ctx.fillStyle = "#ffffff";
  let y = yTitulo;
  for (const linea of lineas) {
    ctx.fillText(linea, margen, y);
    y += altoLinea;
  }

  // Marca "jgonzalez.app" en la esquina superior derecha, con una
  // placa semi-opaca detrás para que sea legible sobre cualquier foto.
  ctx.font = "800 44px InterPortada800";
  const marca = "jgonzalez.app";
  const anchoMarca = ctx.measureText(marca).width;
  const padX = 24;
  const padY = 16;
  const placaX1 = ANCHO - 40;
  const placaY0 = 40;
  const placaAlto = 44 + padY * 2;
  const placaX0 = placaX1 - anchoMarca - padX * 2;

  ctx.fillStyle = "rgba(255,200,90,0.92)";
  const r = 12;
  ctx.beginPath();
  ctx.moveTo(placaX0 + r, placaY0);
  ctx.lineTo(placaX1 - r, placaY0);
  ctx.quadraticCurveTo(placaX1, placaY0, placaX1, placaY0 + r);
  ctx.lineTo(placaX1, placaY0 + placaAlto - r);
  ctx.quadraticCurveTo(placaX1, placaY0 + placaAlto, placaX1 - r, placaY0 + placaAlto);
  ctx.lineTo(placaX0 + r, placaY0 + placaAlto);
  ctx.quadraticCurveTo(placaX0, placaY0 + placaAlto, placaX0, placaY0 + placaAlto - r);
  ctx.lineTo(placaX0, placaY0 + r);
  ctx.quadraticCurveTo(placaX0, placaY0, placaX0 + r, placaY0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#0a0c12";
  ctx.fillText(marca, placaX0 + padX, placaY0 + padY);

  const buf = canvas.toBuffer("image/jpeg", 0.8);
  writeFileSync(salida, buf);
  return { lineas: lineas.length, tamFuente };
}

// Permite correrlo también como CLI, igual que la versión de Python.
if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , entrada, salida, titulo, categoria] = process.argv;
  if (!entrada || !salida || !titulo || !categoria) {
    console.log(
      'Uso: node scripts/portada-titulo.mjs <entrada.jpg> <salida.jpg> "<título>" "<categoría>"'
    );
    process.exit(1);
  }
  const r = await generarPortada(entrada, salida, titulo, categoria);
  console.log(`OK: ${salida} (${r.lineas} líneas, fuente ${r.tamFuente}px)`);
}
