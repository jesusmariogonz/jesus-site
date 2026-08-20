/* ============================================================
   Sube TODOS los archivos de una carpeta a Vercel Blob (store
   PRIVADO) y actualiza automáticamente los `blobPath: ""` de
   lib/toolkit.js que coincidan por nombre de archivo.

   Uso:
     BLOB_READ_WRITE_TOKEN=vercel_blob_rw_... \
       node scripts/subir-carpeta-toolkit.mjs ./Recursos/staging

   Cómo funciona:
   - Sube cada archivo de la carpeta a Blob bajo "toolkit/<nombre>".
   - Busca en lib/toolkit.js una línea como:
       { nombre: "<nombre-del-archivo>", blobPath: "" }
     y la reemplaza con el blobPath real que devolvió Blob.
   - Si un archivo de la carpeta no aparece en lib/toolkit.js, solo
     te avisa (no falla) — puede ser un archivo que agregues después.
   - Al final te dice qué productos quedaron con archivos.
   ============================================================ */

import { put } from "@vercel/blob";
import { readFile, readdir, writeFile } from "fs/promises";
import path from "path";

const folder = process.argv[2];
if (!folder) {
  console.error("Uso: node scripts/subir-carpeta-toolkit.mjs <carpeta>");
  process.exit(1);
}
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("Falta BLOB_READ_WRITE_TOKEN (Vercel → Storage → tu Blob store → .env.local tab).");
  process.exit(1);
}

const toolkitPath = path.join(process.cwd(), "lib", "toolkit.js");

async function main() {
  const files = await readdir(folder);
  let toolkitSrc = await readFile(toolkitPath, "utf8");
  let actualizados = 0;
  let sinCoincidencia = [];

  for (const filename of files) {
    const filePath = path.join(folder, filename);
    const buffer = await readFile(filePath);
    const blob = await put(`toolkit/${filename}`, buffer, { access: "private" });
    console.log(`Subido: ${filename} → ${blob.pathname}`);

    const buscar = `nombre: "${filename}", blobPath: ""`;
    if (toolkitSrc.includes(buscar)) {
      toolkitSrc = toolkitSrc.replace(buscar, `nombre: "${filename}", blobPath: "${blob.pathname}"`);
      actualizados++;
    } else {
      sinCoincidencia.push(filename);
    }
  }

  await writeFile(toolkitPath, toolkitSrc, "utf8");

  console.log(`\n${actualizados} archivo(s) actualizados en lib/toolkit.js.`);
  if (sinCoincidencia.length) {
    console.log("\nEstos se subieron pero NO encontré su lugar en lib/toolkit.js (revísalos a mano):");
    sinCoincidencia.forEach((f) => console.log(" -", f));
  }
  console.log("\nListo. Revisa el diff de lib/toolkit.js, y si se ve bien: git add, commit y push.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
