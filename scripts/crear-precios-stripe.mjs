/* ============================================================
   Crea en Stripe un Product + Price por cada producto/bundle de
   The Toolkit que todavía no tenga `stripePriceId`, y te imprime
   los IDs para que los pegues en lib/toolkit.js.

   Uso:
     STRIPE_SECRET_KEY=sk_test_... node scripts/crear-precios-stripe.mjs

   Es seguro correrlo varias veces: solo crea precios para los
   productos que en lib/toolkit.js todavía tengan stripePriceId: "".
   No los pega automáticamente en el archivo — los tienes que copiar
   tú a mano, para que siempre revises qué se creó antes de que quede
   en el código.
   ============================================================ */

import Stripe from "stripe";
import { TOOLKIT_PRODUCTOS, TOOLKIT_BUNDLES } from "../lib/toolkit.js";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("Falta STRIPE_SECRET_KEY. Uso: STRIPE_SECRET_KEY=sk_test_... node scripts/crear-precios-stripe.mjs");
  process.exit(1);
}

const stripe = new Stripe(key, { apiVersion: "2025-08-27.basil" });

async function crear(nombre, precioUSD) {
  const product = await stripe.products.create({ name: nombre });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(precioUSD * 100),
    currency: "usd",
  });
  return price.id;
}

async function main() {
  console.log("Creando precios en Stripe para productos/bundles sin stripePriceId...\n");

  for (const p of TOOLKIT_PRODUCTOS) {
    if (p.stripePriceId || p.precio === 0 || !p.checkoutUrl?.startsWith("/api/checkout")) continue;
    const priceId = await crear(p.nombre, p.precio);
    console.log(`${p.id.padEnd(24)} → stripePriceId: "${priceId}"`);
  }

  for (const b of TOOLKIT_BUNDLES) {
    if (b.stripePriceId) continue;
    const priceId = await crear(b.nombre, b.precio);
    console.log(`${b.id.padEnd(24)} → stripePriceId: "${priceId}"`);
  }

  console.log("\nListo. Copia cada stripePriceId al producto/bundle correspondiente en lib/toolkit.js.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
