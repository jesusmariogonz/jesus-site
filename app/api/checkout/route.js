import { NextResponse } from "next/server";
import { stripe, siteUrl } from "@/lib/stripe";
import { getCheckoutItem } from "@/lib/toolkit";

/* Crea una sesión de Stripe Checkout y redirige ahí.
   GET /api/checkout?type=product|bundle|libro&id=<id-del-catálogo>
   El botón "Comprar" del sitio apunta directo aquí (ver BuyButton.js
   + rutaCheckout() en lib/toolkit.js), así que esto reemplaza los
   links hosteados de Lemon Squeezy. "libro" son los libros de pago
   de la Biblioteca (lib/recursos.js); "product"/"bundle" son The
   Toolkit (lib/toolkit.js). */

const TIPOS_VALIDOS = ["product", "bundle", "libro"];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!TIPOS_VALIDOS.includes(type)) {
    return NextResponse.json({ error: "Tipo inválido." }, { status: 400 });
  }

  const item = getCheckoutItem(type, id);
  if (!item) {
    return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
  }
  if (!item.stripePriceId) {
    return NextResponse.json(
      { error: "Este producto todavía no está disponible para compra." },
      { status: 409 }
    );
  }

  const base = siteUrl();
  const returnTo = type === "libro" ? "/recursos/gracias" : "/the-toolkit/gracias";
  const cancelTo = type === "libro" ? "/recursos" : "/the-toolkit";

  let session;
  try {
    session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: item.stripePriceId, quantity: 1 }],
      success_url: `${base}${returnTo}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}${cancelTo}`,
      customer_creation: "if_required",
      metadata: { toolkit_type: type, toolkit_id: id },
    });
  } catch (err) {
    console.error("checkout: error creando la sesión de Stripe:", err.message);
    return NextResponse.json(
      { error: "No se pudo iniciar la compra. Intenta de nuevo en un momento." },
      { status: 502 }
    );
  }

  return NextResponse.redirect(session.url, { status: 303 });
}
