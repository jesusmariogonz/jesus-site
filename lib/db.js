/* ============================================================
   Base de datos — Neon Postgres (vía Vercel Storage)
   ------------------------------------------------------------
   Necesita esta variable de entorno en Vercel (queda configurada
   sola al crear la base desde Storage → Create Database → Postgres
   y conectarla al proyecto):

   DATABASE_URL   → cadena de conexión de Neon/Postgres

   Guarda las órdenes pagadas de The Toolkit: qué se compró, con
   qué correo, y el token que permite volver a descargar el/los
   archivo(s) sin tener que pagar de nuevo.
   ============================================================ */

import { neon } from "@neondatabase/serverless";

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Falta configurar DATABASE_URL en Vercel.");
  return neon(url);
}

/** Crea la tabla de órdenes si no existe. Se puede llamar de forma
 *  segura en cada request: CREATE TABLE IF NOT EXISTS es idempotente. */
export async function ensureSchema() {
  const db = sql();
  await db`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      stripe_session_id TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      product_ids TEXT[] NOT NULL,
      amount_total INTEGER NOT NULL,
      currency TEXT NOT NULL,
      download_token TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

/** Inserta una orden nueva. Si el stripe_session_id ya existe (el
 *  webhook de Stripe puede reintentar la misma entrega), no hace
 *  nada y devuelve la orden ya existente — así el correo y el
 *  registro nunca se duplican. */
export async function createOrder({
  stripeSessionId,
  email,
  productIds,
  amountTotal,
  currency,
  downloadToken,
}) {
  const db = sql();
  const rows = await db`
    INSERT INTO orders (stripe_session_id, email, product_ids, amount_total, currency, download_token)
    VALUES (${stripeSessionId}, ${email}, ${productIds}, ${amountTotal}, ${currency}, ${downloadToken})
    ON CONFLICT (stripe_session_id) DO NOTHING
    RETURNING *
  `;
  if (rows.length > 0) return { order: rows[0], created: true };

  const existing = await db`
    SELECT * FROM orders WHERE stripe_session_id = ${stripeSessionId}
  `;
  return { order: existing[0] || null, created: false };
}

/** Busca una orden por su token de descarga (el que va en el link
 *  del correo de confirmación). */
export async function getOrderByToken(token) {
  const db = sql();
  const rows = await db`
    SELECT * FROM orders WHERE download_token = ${token}
  `;
  return rows[0] || null;
}
