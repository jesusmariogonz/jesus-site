#!/usr/bin/env node
/* ============================================================
   Ignored Build Step de Vercel — bloquea el deploy si una nota
   NUEVA en content/blog/ no trae el bloque `postura` (ver CLAUDE.md)
   O si su `imagen` apunta a una foto cruda del banco de portadas sin
   el tratamiento de scripts/portada_titulo.py (titular + categoría +
   marca "jgonzalez.app" horneados).
   ------------------------------------------------------------
   Convención de Vercel para este comando (NO es la convención normal
   de shell): exit code 0 = SALTAR este deploy (se queda el anterior
   en vivo); exit code 1 = PROCEDER con el build normal. Por eso este
   script "falla" con código 1 cuando todo está bien, y "tiene éxito"
   con código 0 cuando encuentra el problema que debe bloquear.

   Solo revisa archivos AGREGADOS en el último commit (no ediciones a
   notas viejas, que nunca tuvieron este campo). Si no puede
   determinar con confianza qué se agregó (ej. clon superficial sin
   HEAD~1), deja pasar el build en vez de bloquear por error.

   Por qué se agregó el check de portada: una auditoría (oct-2026)
   encontró que 43 de 162 notas usaban una foto del banco tal cual
   (ej. /blog/portadas/inteligencia-artificial-10.jpg) sin pasar por
   portada_titulo.py — la rutina automática de publicación nunca lo
   corre. Como esa rutina vive fuera de este repo, no se puede
   arreglar en el código; este gate evita que se sigan acumulando
   notas nuevas con portada sin tratar, igual que el gate de postura
   evita notas nuevas sin ese campo.

   Manda un correo de aviso (vía la API REST de Resend directamente —
   este script corre antes de `npm install`, sin node_modules
   disponibles) cuando bloquea un deploy, con enfriamiento para no
   mandar un correo por cada reintento de Vercel.
   ============================================================ */

import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

function proceder(mensaje) {
  console.log(`[check-postura] OK — ${mensaje}. Procediendo con el build.`);
  process.exit(1); // 1 = proceder (ver nota arriba)
}

function bloquear(mensaje) {
  console.log(`[check-postura] BLOQUEADO — ${mensaje}`);
}

function archivosAgregados() {
  try {
    const out = execSync("git diff --name-only --diff-filter=A HEAD~1 HEAD -- 'content/blog/*.md'", {
      encoding: "utf8",
    });
    return out.split("\n").map((l) => l.trim()).filter(Boolean);
  } catch {
    return null; // no se pudo determinar con confianza
  }
}

function extraerFrontmatter(ruta) {
  const raw = readFileSync(ruta, "utf8");
  const lineas = raw.split("\n");
  if (lineas[0].trim() !== "---") return null;
  const fin = lineas.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (fin === -1) return null;
  return lineas.slice(1, fin);
}

function valorDeLinea(lineas, clave) {
  const linea = lineas.find((l) => l.trim().startsWith(`${clave}:`));
  if (!linea) return null;
  return linea.split(":").slice(1).join(":").trim().replace(/^['"]|['"]$/g, "");
}

function esExcepcion(lineas) {
  if (valorDeLinea(lineas, "pulsoTipo")) return "pulsoTipo definido";
  if (valorDeLinea(lineas, "oculta") === "true") return "oculta: true";
  if (valorDeLinea(lineas, "serie") === "tesis-rag") return "serie: tesis-rag";
  return null;
}

function tienePosturaCompleta(lineas) {
  const idx = lineas.findIndex((l) => l.trim() === "postura:");
  if (idx === -1) return false;
  const bloque = lineas.slice(idx + 1, idx + 6); // pregunta/aFavor/enContra caben en 3 líneas
  const campo = (nombre) => {
    const l = bloque.find((x) => x.trim().startsWith(`${nombre}:`));
    if (!l) return "";
    return l.split(":").slice(1).join(":").trim().replace(/^['"]|['"]$/g, "");
  };
  return Boolean(campo("pregunta") && campo("aFavor") && campo("enContra"));
}

// Prefijos del banco de fotos genéricas reutilizables (public/blog/portadas/
// <prefijo>-<N>.jpg) — si `imagen` en el frontmatter apunta directo a uno de
// estos archivos, significa que nunca pasó por portada_titulo.py.
const PREFIJOS_BANCO_GENERICO = [
  "banco-central", "comercio-internacional", "crecimiento-economico",
  "finanzas-personales", "inflacion-precios", "inteligencia-artificial",
  "manufactura-fabrica", "mercado-bursatil", "negocios-reunion",
  "oficina-corporativa", "startup-innovacion", "vivienda-hipotecas",
];
const RE_BANCO_GENERICO = new RegExp(
  `^(${PREFIJOS_BANCO_GENERICO.join("|")})-\\d+$`
);

function tieneImagenSinTratar(lineas) {
  const imagen = valorDeLinea(lineas, "imagen");
  if (!imagen) return false;
  const base = imagen.split("/").pop().replace(/\.(jpg|jpeg|png|webp)$/i, "");
  return RE_BANCO_GENERICO.test(base);
}

async function avisar({ asunto, intro, archivos, instrucciones }) {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_ALERT_EMAIL || "jesusmariogonz@gmail.com";
  if (!fromEmail || !apiKey) {
    console.log("[check-postura] Falta RESEND_API_KEY/RESEND_FROM_EMAIL — no se pudo mandar el aviso por correo.");
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromEmail,
        to,
        subject: asunto,
        html: `
          <p>${intro}</p>
          <p>Archivo(s):</p>
          <ul>${archivos.map((f) => `<li><code>${f}</code></li>`).join("")}</ul>
          <p>El sitio sigue mostrando el deploy anterior (nada se rompió para los
          visitantes). ${instrucciones}</p>
        `,
      }),
    });
    if (!res.ok) console.log("[check-postura] Resend respondió", res.status, await res.text());
  } catch (err) {
    console.log("[check-postura] Error mandando el aviso:", err.message || err);
  }
}

const agregados = archivosAgregados();
if (agregados === null) {
  proceder("no se pudo determinar con confianza qué archivos se agregaron (ej. clon sin historial)");
}
if (agregados.length === 0) {
  proceder("este push no agrega notas nuevas a content/blog/");
}

const faltantes = [];
const portadasSinTratar = [];
for (const ruta of agregados) {
  if (!existsSync(ruta)) continue;
  const fm = extraerFrontmatter(ruta);
  if (!fm) continue;

  if (tieneImagenSinTratar(fm)) {
    portadasSinTratar.push(ruta);
  }

  const excepcion = esExcepcion(fm);
  if (excepcion) {
    console.log(`[check-postura] ${ruta}: excepción válida (${excepcion}), no requiere postura.`);
    continue;
  }
  if (!tienePosturaCompleta(fm)) {
    faltantes.push(ruta);
  }
}

if (faltantes.length > 0) {
  bloquear(`${faltantes.length} nota(s) nueva(s) sin bloque postura completo: ${faltantes.join(", ")}`);
  await avisar({
    asunto: "⚠️ jgonzalez.app — deploy bloqueado: nota sin bloque Postura",
    intro: `Vercel <strong>no desplegó</strong> el último push porque trae una nota
      nueva en <code>content/blog/</code> sin el campo <code>postura</code>
      completo (pregunta + aFavor + enContra), como lo exige <code>CLAUDE.md</code>.`,
    archivos: faltantes,
    instrucciones: `Para desbloquearlo: agrega el bloque <code>postura</code>
      a esas notas (o márcalas como excepción válida: <code>pulsoTipo</code>,
      <code>oculta: true</code> o <code>serie: tesis-rag</code>) y vuelve a hacer push.`,
  });
  process.exit(0); // 0 = saltar este deploy (ver nota arriba)
}

if (portadasSinTratar.length > 0) {
  bloquear(`${portadasSinTratar.length} nota(s) nueva(s) con portada sin tratar: ${portadasSinTratar.join(", ")}`);
  await avisar({
    asunto: "⚠️ jgonzalez.app — deploy bloqueado: nota con portada sin tratar",
    intro: `Vercel <strong>no desplegó</strong> el último push porque trae una nota
      nueva en <code>content/blog/</code> cuyo campo <code>imagen</code> apunta
      directo a una foto del banco de portadas (ej. <code>inteligencia-artificial-10.jpg</code>)
      sin pasar por <code>scripts/portada_titulo.py</code> — le falta el titular,
      la categoría y la marca "jgonzalez.app" horneados que trae el resto del sitio.`,
    archivos: portadasSinTratar,
    instrucciones: `Para desbloquearlo: corre
      <code>python3 scripts/portada_titulo.py &lt;foto-banco&gt; public/blog/portadas/&lt;slug&gt;.jpg "&lt;título&gt;" "&lt;categoría&gt;"</code>
      y actualiza el campo <code>imagen</code> de la nota para que apunte al
      archivo generado, luego vuelve a hacer push.`,
  });
  process.exit(0); // 0 = saltar este deploy (ver nota arriba)
}

proceder("todas las notas nuevas de este push tienen postura y portada tratada");
