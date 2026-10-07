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

/** Crea la tabla que evita avisos duplicados (newsletter/notify) si
 *  no existe. Se puede llamar de forma segura en cada request. */
export async function ensureNotifySchema() {
  const db = sql();
  await db`
    CREATE TABLE IF NOT EXISTS post_notifications (
      slug TEXT NOT NULL,
      canal TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (slug, canal)
    )
  `;
}

/** Marca un (slug, canal) como avisado. Si ya existía (un rerun del
 *  Action, una carrera de despliegues, una llamada manual repetida),
 *  no hace nada y devuelve false — así el llamador sabe que debe
 *  omitir el envío en vez de duplicarlo. Devuelve true solo la
 *  primera vez que se reclama ese par. */
export async function reclamarAviso(slug, canal) {
  const db = sql();
  const rows = await db`
    INSERT INTO post_notifications (slug, canal)
    VALUES (${slug}, ${canal})
    ON CONFLICT (slug, canal) DO NOTHING
    RETURNING *
  `;
  return rows.length > 0;
}

/* ============================================================
   Posturas — voto + comentarios por nota (ver components/PosturaBlock.js)
   ------------------------------------------------------------
   Moderación en 3 vías (ver lib/moderacion.js): un comentario
   clasificado "limpio" se aprueba solo; "toxico" se rechaza solo;
   "ambiguo" queda pendiente para revisión manual en /admin/moderacion.
   ============================================================ */

export async function ensurePosturasSchema() {
  const db = sql();
  await db`
    CREATE TABLE IF NOT EXISTS postura_votos (
      slug TEXT NOT NULL,
      votante TEXT NOT NULL,
      voto TEXT NOT NULL CHECK (voto IN ('a_favor', 'en_contra')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (slug, votante)
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS postura_comentarios (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL,
      nombre TEXT NOT NULL,
      texto TEXT NOT NULL,
      estado TEXT NOT NULL CHECK (estado IN ('aprobado', 'pendiente', 'rechazado')),
      clasificacion TEXT,
      justificacion TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

/** Registra el voto de un visitante. `votante` es un identificador
 *  anónimo (cookie) — un mismo votante no puede votar dos veces la
 *  misma nota, pero sí puede cambiar su voto (ON CONFLICT actualiza). */
export async function votar(slug, votante, voto) {
  const db = sql();
  await db`
    INSERT INTO postura_votos (slug, votante, voto)
    VALUES (${slug}, ${votante}, ${voto})
    ON CONFLICT (slug, votante) DO UPDATE SET voto = ${voto}
  `;
}

export async function getConteoVotos(slug) {
  const db = sql();
  const rows = await db`
    SELECT voto, COUNT(*)::int AS n FROM postura_votos
    WHERE slug = ${slug} GROUP BY voto
  `;
  const conteo = { a_favor: 0, en_contra: 0 };
  for (const r of rows) conteo[r.voto] = r.n;
  return conteo;
}

export async function getVotoDe(slug, votante) {
  const db = sql();
  const rows = await db`
    SELECT voto FROM postura_votos WHERE slug = ${slug} AND votante = ${votante}
  `;
  return rows[0]?.voto || null;
}

export async function crearComentario({ slug, nombre, texto, estado, clasificacion, justificacion }) {
  const db = sql();
  const rows = await db`
    INSERT INTO postura_comentarios (slug, nombre, texto, estado, clasificacion, justificacion)
    VALUES (${slug}, ${nombre}, ${texto}, ${estado}, ${clasificacion}, ${justificacion})
    RETURNING *
  `;
  return rows[0];
}

export async function listarComentariosAprobados(slug) {
  const db = sql();
  return db`
    SELECT id, nombre, texto, created_at FROM postura_comentarios
    WHERE slug = ${slug} AND estado = 'aprobado'
    ORDER BY created_at ASC
  `;
}

/** Cola de moderación manual (comentarios "ambiguos"), para el panel
 *  en /admin/moderacion. Más recientes primero. */
export async function listarComentariosPendientes() {
  const db = sql();
  return db`
    SELECT id, slug, nombre, texto, clasificacion, justificacion, created_at
    FROM postura_comentarios
    WHERE estado = 'pendiente'
    ORDER BY created_at DESC
  `;
}

export async function moderarComentario(id, decision) {
  const db = sql();
  const estado = decision === "aceptar" ? "aprobado" : "rechazado";
  const rows = await db`
    UPDATE postura_comentarios SET estado = ${estado}
    WHERE id = ${id} AND estado = 'pendiente'
    RETURNING *
  `;
  return rows[0] || null;
}

/* ============================================================
   Alertas operativas (ej. "se agotó el crédito de Anthropic")
   ------------------------------------------------------------
   Evita mandar un correo por cada comentario que falle — solo
   avisa una vez por "tipo" de alerta dentro de un periodo de
   enfriamiento (cooldown), aunque el error siga ocurriendo.
   ============================================================ */

export async function ensureAlertasSchema() {
  const db = sql();
  await db`
    CREATE TABLE IF NOT EXISTS alertas (
      tipo TEXT PRIMARY KEY,
      enviado_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

/** Devuelve true (y registra el envío) solo si no se mandó esta misma
 *  alerta en las últimas `horasCooldown` horas. Si ya se mandó
 *  recientemente, devuelve false y no hace nada — así el llamador sabe
 *  si debe mandar el correo o quedarse callado. */
export async function puedeAlertar(tipo, horasCooldown = 24) {
  const db = sql();
  const rows = await db`
    INSERT INTO alertas (tipo, enviado_at)
    VALUES (${tipo}, now())
    ON CONFLICT (tipo) DO UPDATE SET enviado_at = now()
    WHERE alertas.enviado_at < now() - (${horasCooldown} || ' hours')::interval
    RETURNING *
  `;
  return rows.length > 0;
}

/* ============================================================
   Reseñas de productos — estrellas + comentario, por producto de
   The Toolkit/Biblioteca (ver components/ProductReviews.js). Misma
   moderación en 3 vías que las posturas (lib/moderacion.js).
   ============================================================ */

export async function ensureResenasSchema() {
  const db = sql();
  await db`
    CREATE TABLE IF NOT EXISTS producto_resenas (
      id SERIAL PRIMARY KEY,
      producto_id TEXT NOT NULL,
      nombre TEXT NOT NULL,
      estrellas INTEGER NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
      texto TEXT NOT NULL,
      estado TEXT NOT NULL CHECK (estado IN ('aprobado', 'pendiente', 'rechazado')),
      clasificacion TEXT,
      justificacion TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

export async function crearResena({ productoId, nombre, estrellas, texto, estado, clasificacion, justificacion }) {
  const db = sql();
  const rows = await db`
    INSERT INTO producto_resenas (producto_id, nombre, estrellas, texto, estado, clasificacion, justificacion)
    VALUES (${productoId}, ${nombre}, ${estrellas}, ${texto}, ${estado}, ${clasificacion}, ${justificacion})
    RETURNING *
  `;
  return rows[0];
}

export async function listarResenasAprobadas(productoId) {
  const db = sql();
  return db`
    SELECT id, nombre, estrellas, texto, created_at FROM producto_resenas
    WHERE producto_id = ${productoId} AND estado = 'aprobado'
    ORDER BY created_at DESC
  `;
}

export async function getPromedioEstrellas(productoId) {
  const db = sql();
  const rows = await db`
    SELECT COUNT(*)::int AS n, COALESCE(AVG(estrellas), 0)::float AS promedio
    FROM producto_resenas
    WHERE producto_id = ${productoId} AND estado = 'aprobado'
  `;
  return { n: rows[0]?.n || 0, promedio: rows[0]?.promedio || 0 };
}

export async function listarResenasPendientes() {
  const db = sql();
  return db`
    SELECT id, producto_id, nombre, estrellas, texto, clasificacion, justificacion, created_at
    FROM producto_resenas
    WHERE estado = 'pendiente'
    ORDER BY created_at DESC
  `;
}

export async function moderarResena(id, decision) {
  const db = sql();
  const estado = decision === "aceptar" ? "aprobado" : "rechazado";
  const rows = await db`
    UPDATE producto_resenas SET estado = ${estado}
    WHERE id = ${id} AND estado = 'pendiente'
    RETURNING *
  `;
  return rows[0] || null;
}
