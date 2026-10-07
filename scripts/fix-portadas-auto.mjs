#!/usr/bin/env node
/* ============================================================
   Se corre en CADA build de producción (ver next.config.mjs) — ANTES
   de que Next compile las páginas. Revisa SOLO las notas NUEVAS del
   último commit (igual que scripts/check-postura.mjs — mismo criterio
   de "archivos agregados" vía git diff, no ediciones a notas viejas) y,
   si alguna tiene `imagen` apuntando directo a una foto cruda del
   banco de portadas (sin pasar por el generador de titular+marca), la
   genera automáticamente con scripts/portada-titulo.mjs y reescribe
   el frontmatter para que apunte al archivo tratado — sin bloquear el
   deploy ni depender de que una sesión se acuerde de hacerlo, y sin
   reprocesar las ~160 notas viejas en cada build.

   Por qué existe: la rutina automática que publica notas (fuera de
   este repo) elige la foto del banco pero nunca corre el generador
   de portadas. Antes esto se corregía a mano nota por nota; ahora se
   arregla solo, antes de publicarse, como parte normal del pipeline.

   Si no se puede determinar con confianza qué se agregó en el último
   commit (ej. clon superficial sin HEAD~1), no revisa nada — se queda
   como estaba, no bloquea ni falla el build.
   ============================================================ */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generarPortada } from "./portada-titulo.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function notasNuevas() {
  try {
    const out = execSync(
      "git diff --name-only --diff-filter=A HEAD~1 HEAD -- 'content/blog/*.md'",
      { encoding: "utf8", cwd: ROOT }
    );
    return out.split("\n").map((l) => l.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

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
  const archivos = notasNuevas();
  const arregladas = [];

  for (const rutaRelativa of archivos) {
    const ruta = path.join(ROOT, rutaRelativa);
    if (!existsSync(ruta)) continue;
    const nombre = path.basename(ruta);
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
