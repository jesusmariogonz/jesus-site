#!/usr/bin/env node
/* ============================================================
   Ignored Build Step de Vercel — bloquea el deploy si una nota
   NUEVA en content/blog/ no trae el bloque `postura` (ver CLAUDE.md).
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

   Manda un correo de aviso (vía la API REST de Resend directamente —
   este script corre antes de `npm install`, sin node_modules
   disponibles) cuando bloquea un deploy, con enfriamiento para no
   mandar un correo por cada reintento de Vercel.

   Nota sobre portadas: el problema de notas con foto del banco sin
   tratar (titular+marca) ya NO se bloquea aquí — se arregla solo en
   cada build, ver scripts/fix-portadas-auto.mjs (enganchado desde
   next.config.mjs).
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

function agregadosContra(padre) {
  const out = execSync(`git diff --name-only --diff-filter=A ${padre} HEAD -- 'content/blog/*.md'`, {
    encoding: "utf8",
  });
  return out.split("\n").map((l) => l.trim()).filter(Boolean);
}

function archivosAgregados() {
  try {
    const padres = execSync("git rev-list --parents -n 1 HEAD", { encoding: "utf8" })
      .trim()
      .split(" ")
      .slice(1);
    if (padres.length < 2) return agregadosContra("HEAD~1");
    // Commit de MERGE: contra el primer padre solo, cualquier nota que ya
    // estaba en la otra rama (ej. publicada antes y ya revisada en SU push)
    // aparece como "nueva" y bloquea el deploy por error. Solo cuenta lo que
    // es nuevo respecto a TODOS los padres (la intersección).
    const porPadre = padres.map(agregadosContra);
    return porPadre[0].filter((f) => porPadre.every((lista) => lista.includes(f)));
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
  // Notas de calendario/agenda ("Lo que se espera esta semana"): no son
  // opinión, así que no tienen un debate natural que armar. Campo propio y
  // NO pulsoTipo, porque pulsoTipo además las saca del listado del blog y
  // del aviso por newsletter (lib/posts.js, notify/route.js); este solo lo
  // lee el gate y no cambia cómo se muestra la nota.
  if (valorDeLinea(lineas, "tipoNota") === "calendario") return "tipoNota: calendario";
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

async function avisar(archivosFaltantes) {
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
        subject: "⚠️ jgonzalez.app — deploy bloqueado: nota sin bloque Postura",
        html: `
          <p>Vercel <strong>no desplegó</strong> el último push porque trae una nota
          nueva en <code>content/blog/</code> sin el campo <code>postura</code>
          completo (pregunta + aFavor + enContra), como lo exige
          <code>CLAUDE.md</code>.</p>
          <p>Archivo(s):</p>
          <ul>${archivosFaltantes.map((f) => `<li><code>${f}</code></li>`).join("")}</ul>
          <p>El sitio sigue mostrando el deploy anterior (nada se rompió para los
          visitantes). Para desbloquearlo: agrega el bloque <code>postura</code>
          a esas notas (o márcalas como excepción válida: <code>pulsoTipo</code>,
          <code>oculta: true</code>, <code>serie: tesis-rag</code> o, para notas
          de calendario/agenda, <code>tipoNota: calendario</code>) y vuelve a
          hacer push.</p>
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
for (const ruta of agregados) {
  if (!existsSync(ruta)) continue;
  const fm = extraerFrontmatter(ruta);
  if (!fm) continue;
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
  await avisar(faltantes);
  process.exit(0); // 0 = saltar este deploy (ver nota arriba)
}

proceder("todas las notas nuevas de este push tienen postura o son excepción válida");
