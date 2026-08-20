import { NextResponse } from "next/server";
import crypto from "crypto";
import { stripe, siteUrl } from "@/lib/stripe";
import { ensureSchema, createOrder } from "@/lib/db";
import { getArchivosEntrega, getProductIdsCubiertos, getCheckoutItem } from "@/lib/toolkit";
import { sendPurchaseEmail } from "@/lib/resend";

/* Webhook de Stripe. Configúralo en Stripe Dashboard → Developers →
   Webhooks → Add endpoint:
     URL:    https://jgonzalez.app/api/stripe/webhook
     Evento: checkout.session.completed
   El "Signing secret" que te dé va en STRIPE_WEBHOOK_SECRET (Vercel). */

export async function POST(request) {
  const sig = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event;
  try {
    event = stripe().webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("stripe/webhook: firma inválida:", err.message);
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;
  const type = session.metadata?.toolkit_type;
  const id = session.metadata?.toolkit_id;
  const email = session.customer_details?.email;

  if (!type || !id || !email) {
    console.error("stripe/webhook: falta metadata o email en la sesión", session.id);
    return NextResponse.json({ received: true });
  }

  const item = getCheckoutItem(type, id);
  const productIds = getProductIdsCubiertos(type, id);
  const archivos = getArchivosEntrega(type, id);
  const downloadToken = crypto.randomBytes(24).toString("hex");

  try {
    await ensureSchema();
    const { order, created } = await createOrder({
      stripeSessionId: session.id,
      email,
      productIds,
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      downloadToken,
    });

    // Si la orden ya existía (Stripe reintentó el webhook), no reenviamos
    // el correo — usamos el token que ya se generó la primera vez.
    if (created) {
      const finalToken = order?.download_token || downloadToken;
      const links = archivos.map((a) => ({
        nombre: a.nombre,
        url: `${siteUrl()}/api/descargar-compra?token=${finalToken}&archivo=${encodeURIComponent(a.nombre)}`,
      }));
      await sendPurchaseEmail({
        to: email,
        nombreProducto: item?.nombre || "tu compra en The Toolkit",
        links,
      });
    }
  } catch (err) {
    console.error("stripe/webhook: error guardando orden o enviando correo:", err);
    // Devolvemos 500 para que Stripe reintente el webhook más tarde.
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
