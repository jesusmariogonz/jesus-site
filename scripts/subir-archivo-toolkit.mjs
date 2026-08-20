/* ============================================================
   Sube un archivo local a Vercel Blob (store PRIVADO — requiere
   autenticación para leerlo, ni con la URL directa se puede bajar
   sin pasar por /api/descargar-compra) y te imprime el pathname
   para pegar en el campo `blobPath` correspondiente en lib/toolkit.js.

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
    access: "private",
  });
  console.log(`\nSubido (privado): ${filename}`);
  console.log(`blobPath: "${blob.pathname}"`);
  console.log("\nPégalo en el archivo correspondiente dentro de `archivos` en lib/toolkit.js.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
