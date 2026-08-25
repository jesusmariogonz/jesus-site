/* ============================================================
   Sube los 7 PDFs de "El Cerebro Organizacional" a Vercel Blob
   (store PRIVADO) y actualiza automáticamente los `blobPath: ""`
   de esa colección en lib/recursos.js.

   Uso:
     BLOB_READ_WRITE_TOKEN=vercel_blob_rw_... \
       node scripts/subir-cerebro-organizacional.mjs ./ruta/a/los/7-pdfs

   La carpeta debe contener los 7 archivos con estos nombres
   exactos (los del .zip original de la colección):
     1-el-cerebro-que-decide.pdf
     2-vision-de-tunel.pdf
     3-el-precio-del-sesgo.pdf
     4-memoria-de-corto-plazo.pdf
     5-piloto-automatico.pdf
     6-instinto-de-manada.pdf
     7-mas-alla-del-ci.pdf

   Mismo patrón que scripts/subir-carpeta-toolkit.mjs, pero apuntando
   a lib/recursos.js y con el prefijo "cerebro/" en Blob.
   ============================================================ */

import { put } from "@vercel/blob";
import { readFile, readdir, writeFile } from "fs/promises";
import path from "path";

const folder = process.argv[2];
if (!folder) {
  console.error("Uso: node scripts/subir-cerebro-organizacional.mjs <carpeta>");
  process.exit(1);
}
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("Falta BLOB_READ_WRITE_TOKEN (Vercel → Storage → tu Blob store → .env.local tab).");
  process.exit(1);
}

const recursosPath = path.join(process.cwd(), "lib", "recursos.js");

async function main() {
  const files = await readdir(folder);
  let src = await readFile(recursosPath, "utf8");
  let actualizados = 0;
  let sinCoincidencia = [];

  for (const filename of files) {
    const filePath = path.join(folder, filename);
    const buffer = await readFile(filePath);
    const blob = await put(`cerebro/${filename}`, buffer, { access: "private" });
    console.log(`Subido: ${filename} → ${blob.pathname}`);

    const buscar = `nombre: "${filename}", blobPath: ""`;
    if (src.includes(buscar)) {
      src = src.replace(buscar, `nombre: "${filename}", blobPath: "${blob.pathname}"`);
      actualizados++;
    } else {
      sinCoincidencia.push(filename);
    }
  }

  await writeFile(recursosPath, src, "utf8");

  console.log(`\n${actualizados} archivo(s) actualizados en lib/recursos.js.`);
  if (sinCoincidencia.length) {
    console.log("\nEstos se subieron pero NO encontré su lugar en lib/recursos.js (revísalos a mano):");
    sinCoincidencia.forEach((f) => console.log(" -", f));
  }
  console.log("\nListo. Revisa el diff de lib/recursos.js, y si se ve bien: git add, commit y push.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
