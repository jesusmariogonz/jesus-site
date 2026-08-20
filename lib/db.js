/* ============================================================
   Base de datos — Neon Postgres (vía Vercel Storage)
   ------------------------------------------------------------
   Necesita la cadena de conexión de Postgres en Vercel, ya sea
   como DATABASE_URL o con el prefijo que le hayas puesto al
   conectar la base (ej. STORAGE_URL, STORAGE_DATABASE_URL,
   STORAGE_POSTGRES_URL) — probamos varios nombres comunes porque
   el nombre exacto depende de cómo Vercel/Neon lo generó.

   Guarda las órdenes pagadas de The Toolkit: qué se compró, con
   qué correo, y el token que permite volver a descargar el/los
   archivo(s) sin tener que pagar de nuevo.
   ============================================================ */

import { neon } from "@neondatabase/serverless";

const NOMBRES_POSIBLES = [
  "DATABASE_URL",
  "STORAGE_URL",
  "STORAGE_DATABASE_URL",
  "STORAGE_POSTGRES_URL",
  "POSTGRES_URL",
];

function sql() {
  const url = NOMBRES_POSIBLES.map((n) => process.env[n]).find(Boolean);
  if (!url) {
    throw new Error(
      `Falta la variable de conexión a Postgres en Vercel (probé: ${NOMBRES_POSIBLES.join(", ")}).`
    );
  }
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
