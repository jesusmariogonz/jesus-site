/* ============================================================
   Sube un archivo local a Vercel Blob (privado, no al repo — el
   repo es público) y te imprime la URL para pegar en el campo
   `blobUrl` correspondiente en lib/toolkit.js.

   Uso:
     BLOB_READ_WRITE_TOKEN=vercel_blob_rw_... \
       node scripts/subir-archivo-toolkit.mjs ./power-bi-de-cero-a-hero.pdf

   El nombre del archivo en Blob es el mismo que el nombre local, así
   que súbelo ya con el nombre exacto que pusiste en `archivos` en
   lib/toolkit.js (ej. "power-bi-de-cero-a-hero.pdf").
   ============================================================ */

import { put } from "@vercel/blob";
import { readFile } from "fs/promises";
import path from "path";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Uso: node scripts/subir-archivo-toolkit.mjs <ruta-al-archivo>");
  process.exit(1);
}
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("Falta BLOB_READ_WRITE_TOKEN (Vercel → Storage → tu Blob store → .env.local tab).");
  process.exit(1);
}

async function main() {
  const buffer = await readFile(filePath);
  const filename = path.basename(filePath);
  const blob = await put(`toolkit/${filename}`, buffer, {
    access: "public",
    addRandomSuffix: true, // hace la URL impredecible — es la parte "privada"
  });
  console.log(`\nSubido: ${filename}`);
  console.log(`blobUrl: "${blob.url}"`);
  console.log("\nPégalo en el archivo correspondiente dentro de `archivos` en lib/toolkit.js.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
