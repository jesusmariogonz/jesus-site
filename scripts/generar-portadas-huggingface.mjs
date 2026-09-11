/* ============================================================
   Genera portadas por IA usando la Hugging Face Inference API
   (gratuita, con límites de uso) y las agrega al banco local en
   public/blog/portadas-ia/, con un manifiesto en lib/portadas-ia.js
   que las rutinas del blog pueden usar igual que el banco de Pexels.

   Por qué corre localmente y no en las rutinas automáticas: el
   entorno donde corren esas rutinas bloquea la salida de red hacia
   casi cualquier dominio externo (ya lo confirmamos con Pexels,
   Pixabay, Unsplash y Perchance). Este script se corre UNA VEZ,
   desde tu compu, donde sí hay internet sin restricciones.

   Uso (PowerShell):
     $env:HF_TOKEN = "tu_token_de_huggingface"
     node scripts/generar-portadas-huggingface.mjs

   Uso (bash/mac/linux):
     HF_TOKEN=tu_token node scripts/generar-portadas-huggingface.mjs

   Cómo conseguir el token (gratis):
     1. Crea una cuenta en https://huggingface.co
     2. Ve a Settings → Access Tokens → New token (tipo "Read" basta)
     3. Copia el token y úsalo como HF_TOKEN arriba

   Después de correrlo:
     - Revisa public/blog/portadas-ia/ (deberías ver los .png generados)
     - Revisa lib/portadas-ia.js (el manifiesto con tags por imagen)
     - git add public/blog/portadas-ia lib/portadas-ia.js
     - git commit -m "Agrega banco de portadas generadas por IA"
     - git push

   Nota sobre el modelo: usamos FLUX.1-schnell (rápido, buena calidad,
   friendly para la capa gratuita). La API gratuita de Hugging Face
   tiene límites de uso y a veces el modelo tarda en "despertar" (da
   error 503 con estimated_time) — el script reintenta automáticamente.
   ============================================================ */

import { writeFile, mkdir } from "fs/promises";
import path from "path";

const HF_TOKEN = process.env.HF_TOKEN;
if (!HF_TOKEN) {
  console.error("Falta HF_TOKEN. Ejemplo:\n  $env:HF_TOKEN = \"tu_token\"\n  node scripts/generar-portadas-huggingface.mjs");
  process.exit(1);
}

const MODEL = process.env.HF_MODEL || "black-forest-labs/FLUX.1-schnell";
const API_URL = `https://api-inference.huggingface.co/models/${MODEL}`;

// Mismo set de temas que el banco de Pexels, pero con prompts en inglés
// (los modelos de imagen dan mejor resultado con prompts en inglés).
const TEMAS = [
  {
    slug: "banco-central-ia",
    tags: ["banxico", "fed", "tasas de interés", "política monetaria"],
    prompts: [
      "a grand neoclassical central bank building facade, golden hour lighting, photorealistic, architectural photography",
      "a modern glass central bank tower against a blue sky, corporate photography style",
      "close-up of a gavel and interest rate chart on a wooden desk, financial photography",
    ],
  },
  {
    slug: "mercados-ia",
    tags: ["mercados", "bolsa", "wall street", "inversiones"],
    prompts: [
      "a stock market trading floor with digital screens showing charts, cinematic lighting, photorealistic",
      "a wall street street sign with financial district skyscrapers behind, photorealistic",
      "an abstract visualization of rising stock market candlestick charts, blue and green tones, professional photography",
    ],
  },
  {
    slug: "inflacion-ia",
    tags: ["inflación", "precios", "consumo", "canasta básica"],
    prompts: [
      "a grocery store aisle with price tags, shallow depth of field, photorealistic",
      "a shopping cart with groceries and a receipt, natural lighting, photorealistic",
      "close-up of coins and banknotes next to a supermarket receipt, macro photography",
    ],
  },
  {
    slug: "negocios-ia",
    tags: ["negocios", "acuerdos", "negociación", "comercio"],
    prompts: [
      "two business people shaking hands in a modern office, natural light, photorealistic corporate photography",
      "a boardroom meeting with executives reviewing documents, professional photography",
      "a handshake close-up in front of a city skyline window, corporate photography",
    ],
  },
  {
    slug: "ia-tecnologia-ia",
    tags: ["ia", "inteligencia artificial", "tecnología", "innovación"],
    prompts: [
      "an abstract visualization of a neural network with glowing blue nodes, digital art, high detail",
      "a robotic hand touching a holographic data interface, futuristic, cinematic lighting",
      "a data center server room with blue ambient lighting, photorealistic",
    ],
  },
  {
    slug: "oficina-corporativa-ia",
    tags: ["empresas", "oficina", "corporativo", "genérico"],
    prompts: [
      "a modern corporate office building glass facade, architectural photography, blue sky",
      "an open-plan modern office with employees working, natural light, photorealistic",
      "a minimalist executive office with a city view, professional photography",
    ],
  },
  {
    slug: "vivienda-ia",
    tags: ["vivienda", "hipotecas", "crédito", "bienes raíces"],
    prompts: [
      "a row of modern suburban houses under a blue sky, real estate photography",
      "a hand holding house keys in front of a blurred home, photorealistic",
      "a calculator, house model, and mortgage documents on a desk, photorealistic",
    ],
  },
  {
    slug: "comercio-exterior-ia",
    tags: ["comercio exterior", "t-mec", "aranceles", "exportaciones"],
    prompts: [
      "a container ship at a busy commercial port, aerial view, photorealistic",
      "shipping containers stacked at an industrial port, golden hour, photorealistic",
      "a cargo plane being loaded with freight containers, photorealistic",
    ],
  },
  {
    slug: "dinero-ia",
    tags: ["dinero", "ahorro", "finanzas personales", "gasto de los hogares"],
    prompts: [
      "a piggy bank next to stacks of coins, soft natural light, photorealistic",
      "a family budgeting at a kitchen table with a laptop and papers, photorealistic",
      "close-up of paper currency and a savings jar, macro photography",
    ],
  },
  {
    slug: "manufactura-ia",
    tags: ["manufactura", "industria", "imef", "producción"],
    prompts: [
      "an industrial factory floor with machinery and workers, photorealistic, dramatic lighting",
      "a steel manufacturing plant with molten metal, industrial photography",
      "an automated assembly line in a modern factory, photorealistic",
    ],
  },
  {
    slug: "startups-ia",
    tags: ["startups", "innovación", "emprendimiento", "fintech"],
    prompts: [
      "a small team of entrepreneurs brainstorming around a whiteboard, natural light, photorealistic",
      "a modern coworking space with young professionals working on laptops, photorealistic",
      "a smartphone showing a fintech app interface on a desk, product photography",
    ],
  },
  {
    slug: "pib-ia",
    tags: ["pib", "crecimiento económico", "gráficas", "datos"],
    prompts: [
      "an abstract upward trending bar chart in blue and gold, professional data visualization style",
      "a world map with glowing economic growth indicators, digital art",
      "a business analyst pointing at a growth chart on a screen, photorealistic",
    ],
  },
];

const OUT_DIR = path.join(process.cwd(), "public", "blog", "portadas-ia");
const MANIFEST_PATH = path.join(process.cwd(), "lib", "portadas-ia.js");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generarImagen(prompt, intentos = 4) {
  for (let i = 0; i < intentos; i++) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      return buffer;
    }

    if (res.status === 503) {
      const data = await res.json().catch(() => ({}));
      const espera = Math.min(Math.ceil((data.estimated_time || 20) * 1000), 60000);
      console.log(`  Modelo cargando, esperando ${Math.round(espera / 1000)}s... (intento ${i + 1}/${intentos})`);
      await sleep(espera);
      continue;
    }

    const errorText = await res.text().catch(() => "");
    throw new Error(`HF respondió ${res.status}: ${errorText.slice(0, 200)}`);
  }
  throw new Error("Se agotaron los reintentos esperando a que el modelo cargara.");
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const manifest = [];

  for (const tema of TEMAS) {
    console.log(`\nGenerando tema "${tema.slug}"...`);

    for (let i = 0; i < tema.prompts.length; i++) {
      const prompt = tema.prompts[i];
      const filename = `${tema.slug}-${i + 1}.png`;
      const destino = path.join(OUT_DIR, filename);

      try {
        console.log(`  [${i + 1}/${tema.prompts.length}] "${prompt.slice(0, 60)}..."`);
        const buffer = await generarImagen(prompt);
        await writeFile(destino, buffer);
        console.log(`    Guardado: ${filename} (${Math.round(buffer.length / 1024)} KB)`);
        manifest.push({
          file: `/blog/portadas-ia/${filename}`,
          tags: tema.tags,
          prompt,
          modelo: MODEL,
        });
      } catch (err) {
        console.error(`    Error generando "${filename}": ${err.message}`);
      }
    }
  }

  const contenido = `// Banco de portadas generadas por IA (Hugging Face Inference API, modelo ${MODEL}).
// Generado por scripts/generar-portadas-huggingface.mjs — no editar a mano, volver a correr el script para regenerar.
// Las rutinas automáticas del blog eligen de aquí según el tema de cada nota.

export const PORTADAS_IA = ${JSON.stringify(manifest, null, 2)};
`;
  await writeFile(MANIFEST_PATH, contenido, "utf8");

  console.log(`\n${manifest.length} imágenes generadas en public/blog/portadas-ia/.`);
  console.log(`Manifiesto escrito en lib/portadas-ia.js.`);
  console.log(`\nSiguiente paso:\n  git add public/blog/portadas-ia lib/portadas-ia.js\n  git commit -m "Agrega banco de portadas generadas por IA"\n  git push`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
