#!/usr/bin/env node
/* ============================================================
   Se corre en CADA build (ver next.config.js) — ANTES de que Next
   compile las páginas. Revisa TODAS las notas en content/blog/ y, si
   alguna tiene `imagen` apuntando directo a una foto cruda del banco
   de portadas (sin pasar por el generador de titular+marca), la
   genera automáticamente con scripts/portada-titulo.mjs y reescribe
   el frontmatter para que apunte al archivo tratado — sin bloquear
   el deploy ni depender de que una sesión se acuerde de hacerlo.

   Por qué existe: la rutina automática que publica notas (fuera de
   este repo) elige la foto del banco pero nunca corre el generador
   de portadas. Antes esto se corregía a mano nota por nota; ahora se
   arregla solo, en cada build, como parte normal del pipeline.

   Es seguro correrlo muchas veces: una nota cuya `imagen` ya NO
   coincide con el patrón del banco genérico (porque ya se trató antes)
   simplemente se salta, no se vuelve a procesar.
   ============================================================ */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generarPortada } from "./portada-titulo.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "content/blog");

const PREFIJOS_BANCO_GENERICO = [
  "banco-central", "comercio-internacional", "crecimiento-economico",
  "finanzas-personales", "inflacion-precios", "inteligencia-artificial",
  "manufactura-fabrica", "mercado-bursatil", "negocios-reunion",
  "oficina-corporativa", "startup-innovacion", "vivienda-hipotecas",
];
const RE_BANCO_GENERICO = new RegExp(
  `^(${PREFIJOS_BANCO_GENERICO.join("|")})-\\d+$`
);

const CATEGORIA_LABEL = {
  "ingenieria-de-datos": "Data Engineering",
  snowflake: "Snowflake",
  arquitectura: "Data Architecture",
  ia: "IA & GenAI",
  cloud: "Cloud",
  "data-model": "Data Model",
  "business-analytics": "Business Analytics",
  business: "Business",
  leadership: "Leadership",
  geopolitics: "Geopolitics",
  fintech: "Fintech",
  opinion: "Opinión",
};

function valorDeLinea(lineas, clave) {
  const linea = lineas.find((l) => l.trim().startsWith(`${clave}:`));
  if (!linea) return null;
  return linea.split(":").slice(1).join(":").trim().replace(/^['"]|['"]$/g, "");
}

function extraerFrontmatter(texto) {
  const lineas = texto.split("\n");
  if (lineas[0]?.trim() !== "---") return null;
  const fin = lineas.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (fin === -1) return null;
  return lineas.slice(1, fin);
}

function esGenerica(imagen) {
  if (!imagen) return false;
  const base = imagen.split("/").pop().replace(/\.(jpg|jpeg|png|webp)$/i, "");
  return RE_BANCO_GENERICO.test(base);
}

export async function arreglarPortadasAutomaticamente() {
  if (!existsSync(BLOG_DIR)) return { revisadas: 0, arregladas: [] };

  const archivos = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const arregladas = [];

  for (const nombre of archivos) {
    const ruta = path.join(BLOG_DIR, nombre);
    const texto = readFileSync(ruta, "utf8");
    const fm = extraerFrontmatter(texto);
    if (!fm) continue;

    const imagen = valorDeLinea(fm, "imagen");
    if (!esGenerica(imagen)) continue;

    const titulo = valorDeLinea(fm, "titulo");
    const categoriaValor = valorDeLinea(fm, "categoria") || "opinion";
    if (!titulo) continue;

    const entrada = path.join(ROOT, "public", imagen.replace(/^\//, ""));
    if (!existsSync(entrada)) continue;

    const slug = nombre.replace(/\.md$/, "");
    const salidaRel = `/blog/portadas/${slug}.jpg`;
    const salidaAbs = path.join(ROOT, "public", salidaRel.replace(/^\//, ""));
    const label = CATEGORIA_LABEL[categoriaValor] || categoriaValor.toUpperCase();

    try {
      await generarPortada(entrada, salidaAbs, titulo, label);
    } catch (err) {
      console.log(`[fix-portadas-auto] ERROR generando portada para ${slug}: ${err.message || err}`);
      continue;
    }

    let nuevoTexto = texto.replace(
      /^imagen:.*$/m,
      `imagen: ${salidaRel}`
    );

    // Si socialImagen también usaba la misma foto genérica, la actualiza igual.
    const socialVieja = valorDeLinea(fm, "socialImagen");
    if (socialVieja && path.basename(socialVieja, path.extname(socialVieja)) ===
        path.basename(imagen, path.extname(imagen))) {
      const socialRel = `/blog/social/${slug}.jpg`;
      const socialAbs = path.join(ROOT, "public", socialRel.replace(/^\//, ""));
      writeFileSync(socialAbs, readFileSync(salidaAbs));
      nuevoTexto = nuevoTexto.replace(/^socialImagen:.*$/m, `socialImagen: ${socialRel}`);
    }

    writeFileSync(ruta, nuevoTexto);
    arregladas.push(slug);
    console.log(`[fix-portadas-auto] Portada generada para ${slug}`);
  }

  return { revisadas: archivos.length, arregladas };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = await arreglarPortadasAutomaticamente();
  console.log(
    `[fix-portadas-auto] Revisadas ${r.revisadas} notas, ${r.arregladas.length} portada(s) generada(s) automáticamente.`
  );
}
