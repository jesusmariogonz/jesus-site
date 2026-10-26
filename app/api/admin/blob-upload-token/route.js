import { NextResponse } from "next/server";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";

/* Ruta temporal de un solo uso — mintea un token de cliente para subir
   UN archivo grande directo a Vercel Blob desde fuera de una función
   serverless (evita el límite de ~4.5MB de body en rutas de Next.js).
   Se borra después de usarla para subir los libros de "Cómo leer el
   mercado". Protegida con el mismo secreto admin que ya usa el sitio. */

function autorizado(request) {
  const secret = request.headers.get("x-admin-secret");
  const expected = process.env.ADMIN_MODERATION_SECRET;
  return Boolean(expected) && secret === expected;
}

export async function POST(request) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { pathname } = await request.json();
  if (!pathname) {
    return NextResponse.json({ error: "Falta pathname." }, { status: 400 });
  }

  const clientToken = await generateClientTokenFromReadWriteToken({
    token: process.env.BLOB_READ_WRITE_TOKEN,
    pathname,
    allowedContentTypes: ["application/pdf"],
    addRandomSuffix: false,
    access: "private",
    validUntil: Date.now() + 10 * 60 * 1000,
  });

  return NextResponse.json({ clientToken });
}
