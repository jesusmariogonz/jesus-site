import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { LIBROS } from "@/lib/recursos";

/* Ruta temporal de un solo uso — crea en Stripe un Product + Price
   para cada libro de pago de lib/recursos.js que todavía no tenga
   stripePriceId. Solo imprime los IDs para pegarlos a mano en el
   código (no los escribe, para que siempre se revisen antes de
   quedar en el repo). Se borra después de usarla. */

function autorizado(request) {
  const secret = request.headers.get("x-admin-secret");
  const expected = process.env.ADMIN_MODERATION_SECRET;
  return Boolean(expected) && secret === expected;
}

export async function POST(request) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const s = stripe();
  const resultados = [];
  for (const l of LIBROS) {
    // Solo libros con archivo real listo para entregar — nunca crea un
    // precio para un libro "Próximamente" (eso lo volvería comprable).
    if (l.stripePriceId || !l.precio || !l.archivos?.length || !l.checkoutUrl?.startsWith("/api/checkout")) continue;
    const product = await s.products.create({ name: l.titulo });
    const price = await s.prices.create({
      product: product.id,
      unit_amount: Math.round(l.precio * 100),
      currency: "mxn",
    });
    resultados.push({ id: l.id, titulo: l.titulo, stripePriceId: price.id });
  }

  return NextResponse.json({ resultados });
}
