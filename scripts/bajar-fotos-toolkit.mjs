/* ============================================================
   Baja las fotos de stock de Unsplash para The Toolkit y las deja
   ya en public/images/toolkit/, con el nombre exacto que espera
   lib/toolkit.js.

   Uso:
     node scripts/bajar-fotos-toolkit.mjs

   No necesita API key: usa el endpoint público de descarga directa
   de Unsplash (el mismo que dispara el botón "Download" en su
   sitio). Todas son fotos gratis, licencia Unsplash (uso comercial
   libre, sin atribución obligatoria).

   Si alguna no te gusta, ve a unsplash.com, busca otra, copia su
   ID (el código al final de la URL /photos/algo-<ID>) y cámbialo
   aquí abajo antes de correr el script.
   ============================================================ */

import { writeFile, mkdir } from "fs/promises";
import path from "path";

const FOTOS = [
  { archivo: "power-bi.jpg", id: "vNcSlvLBHak", nota: "Dashboard de BI / KPIs" },
  { archivo: "sql-retail.jpg", id: "ivfp_yxZuYQ", nota: "Pasillo de tienda con anaqueles" },
  { archivo: "retail-analytics-claude.jpg", id: "YmSiFKOecCU", nota: "Laptop con interfaz de chat IA" },
  { archivo: "modelo-punto-venta.jpg", id: "WTOWyep_ErY", nota: "Supermercado iluminado" },
  { archivo: "excel-finanzas.jpg", id: "8wLZi9OhsWU", nota: "Calculadora junto a laptop" },
  { archivo: "prompting-profesional.jpg", id: "adrO5seSbBE", nota: "Persona escribiendo en laptop" },
  { archivo: "plantillas-powerpoint.jpg", id: "l0E0Y1TdzxE", nota: "Sala de juntas, presentación" },
];

const destino = path.join(process.cwd(), "public", "images", "toolkit");

async function descargar({ archivo, id, nota }) {
  const url = `https://unsplash.com/photos/${id}/download?force=true`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    console.error(`✗ ${archivo} (${nota}) — error ${res.status}, revísala a mano en unsplash.com/photos/${id}`);
    return;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(destino, archivo), buffer);
  console.log(`✓ ${archivo} — ${nota}`);
}

async function main() {
  await mkdir(destino, { recursive: true });
  for (const foto of FOTOS) {
    await descargar(foto);
  }
  console.log("\nListo. Revisa public/images/toolkit/ — si alguna no te convence, cámbiala a mano.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
