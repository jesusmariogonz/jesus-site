/* ============================================================
   Stripe — helper de servidor
   ------------------------------------------------------------
   Necesita estas variables de entorno en Vercel:

   STRIPE_SECRET_KEY       → sk_test_... (o sk_live_... en producción)
   STRIPE_WEBHOOK_SECRET   → whsec_..., lo da Stripe al crear el
                              endpoint de webhook (Developers → Webhooks)
   NEXT_PUBLIC_SITE_URL    → ej. "https://jgonzalez.app" (para las
                              URLs de success/cancel del checkout)
   ============================================================ */

import Stripe from "stripe";

let _stripe = null;

export function stripe() {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Falta configurar STRIPE_SECRET_KEY en Vercel.");
  _stripe = new Stripe(key, { apiVersion: "2026-07-29.dahlia" });
  return _stripe;
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://jgonzalez.app";
}
