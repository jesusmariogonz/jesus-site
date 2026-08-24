/* ============================================================
   Crea en Stripe un Product + Price por cada producto/bundle de
   The Toolkit y por cada libro de pago de Biblioteca que todavía
   no tenga `stripePriceId`, y te imprime los IDs para que los
   pegues en lib/toolkit.js / lib/recursos.js.

   Uso:
     STRIPE_SECRET_KEY=sk_test_... node scripts/crear-precios-stripe.mjs

   Por defecto solo crea precios para los productos/libros que
   todavía tengan stripePriceId: "" (no toca los que ya tienen uno).

   Si cambias de modo test a modo live (o viceversa), los
   stripePriceId del otro modo NO existen del lado nuevo — hay que
   recrearlos todos. Para eso, agrega FORZAR=1:

     STRIPE_SECRET_KEY=sk_live_... FORZAR=1 node scripts/crear-precios-stripe.mjs

   No los pega automáticamente en el archivo — los tienes que copiar
   tú a mano, para que siempre revises qué se creó antes de que quede
   en el código.
   ============================================================ */

import Stripe from "stripe";
import { TOOLKIT_PRODUCTOS, TOOLKIT_BUNDLES } from "../lib/toolkit.js";
import { LIBROS } from "../lib/recursos.js";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("Falta STRIPE_SECRET_KEY. Uso: STRIPE_SECRET_KEY=sk_test_... node scripts/crear-precios-stripe.mjs");
  process.exit(1);
}

const forzar = process.env.FORZAR === "1";

const stripe = new Stripe(key, { apiVersion: "2026-07-29.dahlia" });

async function crear(nombre, precioMXN) {
  const product = await stripe.products.create({ name: nombre });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(precioMXN * 100),
    currency: "mxn",
  });
  return price.id;
}

async function main() {
  console.log(
    forzar
      ? "FORZAR=1: recreando precios para TODOS los productos/libros de pago...\n"
      : "Creando precios en Stripe solo para productos/libros sin stripePriceId...\n"
  );

  for (const p of TOOLKIT_PRODUCTOS) {
    if ((!forzar && p.stripePriceId) || p.precio === 0 || !p.checkoutUrl?.startsWith("/api/checkout")) continue;
    const priceId = await crear(p.nombre, p.precio);
    console.log(`${p.id.padEnd(24)} → stripePriceId: "${priceId}"`);
  }

  for (const b of TOOLKIT_BUNDLES) {
    if (!forzar && b.stripePriceId) continue;
    const priceId = await crear(b.nombre, b.precio);
    console.log(`${b.id.padEnd(24)} → stripePriceId: "${priceId}"`);
  }

  for (const l of LIBROS) {
    if ((!forzar && l.stripePriceId) || !l.precio || !l.checkoutUrl?.startsWith("/api/checkout")) continue;
    const priceId = await crear(l.titulo, l.precio);
    console.log(`${l.id.padEnd(24)} → stripePriceId: "${priceId}"`);
  }

  console.log("\nListo. Copia cada stripePriceId al producto/bundle/libro correspondiente en lib/toolkit.js o lib/recursos.js.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
