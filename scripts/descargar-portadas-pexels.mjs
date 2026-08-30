/* ============================================================
   Descarga ~60 fotos de portada desde Pexels y arma un banco local
   en public/blog/portadas/, con un manifiesto en lib/portadas.js
   que las rutinas automáticas del blog usan para elegir imagen
   por tema — sin depender de llamadas a Pexels en cada corrida
   (el entorno donde corren esas rutinas bloquea la API de Pexels
   por política de red; este script se corre UNA VEZ, desde tu
   compu, donde sí hay salida a internet).

   Uso (PowerShell):
     $env:PEXELS_API_KEY = "tu_api_key_de_pexels"
     node scripts/descargar-portadas-pexels.mjs

   Uso (bash/mac/linux):
     PEXELS_API_KEY=tu_api_key node scripts/descargar-portadas-pexels.mjs

   Después de correrlo:
     - Revisa public/blog/portadas/ (deberías ver ~60 archivos .jpg)
     - Revisa lib/portadas.js (el manifiesto con tags por foto)
     - git add public/blog/portadas lib/portadas.js
     - git commit -m "Agrega banco local de portadas (Pexels)"
     - git push
   ============================================================ */

import { writeFile, mkdir } from "fs/promises";
import path from "path";

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error("Falta PEXELS_API_KEY. Ejemplo:\n  $env:PEXELS_API_KEY = \"tu_key\"\n  node scripts/descargar-portadas-pexels.mjs");
  process.exit(1);
}

// Cada tema baja ~5 fotos. Ajusta queries o cantidad si quieres más/menos de 60.
const TEMAS = [
  { slug: "banco-central", query: "central bank building", tags: ["banxico", "fed", "tasas de interés", "política monetaria"] },
  { slug: "mercado-bursatil", query: "stock market trading screen", tags: ["mercados", "bolsa", "wall street", "inversiones"] },
  { slug: "inflacion-precios", query: "grocery prices receipt", tags: ["inflación", "precios", "consumo", "canasta básica"] },
  { slug: "negocios-reunion", query: "business meeting negotiation", tags: ["negocios", "acuerdos", "negociación", "comercio"] },
  { slug: "inteligencia-artificial", query: "artificial intelligence technology", tags: ["ia", "inteligencia artificial", "tecnología", "innovación"] },
  { slug: "oficina-corporativa", query: "modern corporate office", tags: ["empresas", "oficina", "corporativo", "genérico"] },
  { slug: "vivienda-hipotecas", query: "real estate house keys", tags: ["vivienda", "hipotecas", "crédito", "bienes raíces"] },
  { slug: "comercio-internacional", query: "international trade shipping port", tags: ["comercio exterior", "t-mec", "aranceles", "exportaciones"] },
  { slug: "finanzas-personales", query: "personal finance money savings", tags: ["dinero", "ahorro", "finanzas personales", "gasto de los hogares"] },
  { slug: "manufactura-fabrica", query: "manufacturing factory industry", tags: ["manufactura", "industria", "imef", "producción"] },
  { slug: "startup-innovacion", query: "startup team innovation", tags: ["startups", "innovación", "emprendimiento", "fintech"] },
  { slug: "crecimiento-economico", query: "economy growth chart graph", tags: ["pib", "crecimiento económico", "gráficas", "datos"] },
];

const FOTOS_POR_TEMA = 5;
const OUT_DIR = path.join(process.cwd(), "public", "blog", "portadas");
const MANIFEST_PATH = path.join(process.cwd(), "lib", "portadas.js");

async function buscarFotos(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${FOTOS_POR_TEMA}&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: API_KEY } });
  if (!res.ok) {
    throw new Error(`Pexels respondió ${res.status} para "${query}"`);
  }
  const data = await res.json();
  return data.photos || [];
}

async function descargarFoto(url, destino) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar ${url} (HTTP ${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destino, buffer);
  return buffer.length;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const manifest = [];
  const vistos = new Set();

  for (const tema of TEMAS) {
    console.log(`\nBuscando "${tema.query}"...`);
    let fotos;
    try {
      fotos = await buscarFotos(tema.query);
    } catch (err) {
      console.error(`  Error buscando "${tema.query}": ${err.message}`);
      continue;
    }

    let i = 0;
    for (const foto of fotos) {
      if (vistos.has(foto.id)) continue;
      vistos.add(foto.id);
      i++;

      const filename = `${tema.slug}-${i}.jpg`;
      const destino = path.join(OUT_DIR, filename);
      const srcUrl = foto.src?.large2x || foto.src?.large || foto.src?.original;
      if (!srcUrl) continue;

      try {
        const bytes = await descargarFoto(srcUrl, destino);
        console.log(`  Descargado: ${filename} (${Math.round(bytes / 1024)} KB)`);
        manifest.push({
          file: `/blog/portadas/${filename}`,
          tags: tema.tags,
          fotografo: foto.photographer,
          pexelsUrl: foto.url,
        });
      } catch (err) {
        console.error(`  Error descargando foto de "${tema.query}": ${err.message}`);
      }
    }
  }

  const contenido = `// Banco local de portadas descargadas de Pexels (uso editorial, ver pexelsUrl/fotografo por foto).
// Generado por scripts/descargar-portadas-pexels.mjs — no editar a mano, volver a correr el script para regenerar.
// Las rutinas automáticas del blog eligen de aquí según el tema de cada nota (no llaman a Pexels en vivo).

export const PORTADAS = ${JSON.stringify(manifest, null, 2)};
`;
  await writeFile(MANIFEST_PATH, contenido, "utf8");

  console.log(`\n${manifest.length} fotos descargadas en public/blog/portadas/.`);
  console.log(`Manifiesto escrito en lib/portadas.js.`);
  console.log(`\nSiguiente paso:\n  git add public/blog/portadas lib/portadas.js\n  git commit -m "Agrega banco local de portadas (Pexels)"\n  git push`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
