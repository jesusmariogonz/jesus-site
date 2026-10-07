import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { TOOLKIT_PRODUCTOS, TOOLKIT_BUNDLES } from "@/lib/toolkit";
import { LIBROS } from "@/lib/recursos";

/* Ruta temporal de diagnóstico — confirma en qué moneda está
   configurado cada Price de Stripe vs. lo que mostramos en el sitio
   (siempre MXN). Se borra después de usarla una vez. */

function autorizado(request) {
  const secret = request.headers.get("x-admin-secret");
  const expected = process.env.ADMIN_MODERATION_SECRET;
  return Boolean(expected) && secret === expected;
}

export async function GET(request) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const items = [
    ...TOOLKIT_PRODUCTOS.map((p) => ({ id: p.id, nombre: p.nombre, priceId: p.stripePriceId })),
    ...(TOOLKIT_BUNDLES || []).map((b) => ({ id: b.id, nombre: b.nombre, priceId: b.stripePriceId })),
    ...(LIBROS || []).map((l) => ({ id: l.id, nombre: l.nombre, priceId: l.stripePriceId })),
  ].filter((i) => i.priceId);

  const s = stripe();
  const resultados = await Promise.all(
    items.map(async (i) => {
      try {
        const price = await s.prices.retrieve(i.priceId);
        return {
          id: i.id,
          nombre: i.nombre,
          priceId: i.priceId,
          currency: price.currency,
          unitAmount: price.unit_amount,
        };
      } catch (e) {
        return { id: i.id, nombre: i.nombre, priceId: i.priceId, error: e.message };
      }
    })
  );

  return NextResponse.json({ resultados });
}
