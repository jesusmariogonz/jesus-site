import { NextResponse } from "next/server";
import { ensureSchema, getOrderByToken } from "@/lib/db";
import { getArchivoBlobUrl } from "@/lib/toolkit";

/* Descarga de un archivo ya comprado.
   GET /api/descargar-compra?token=<download_token>&archivo=<nombre>
   El token viaja en el link del correo de confirmación (ver
   app/api/stripe/webhook/route.js). El archivo real vive en Vercel
   Blob (privado); aquí lo pedimos en el servidor y lo devolvemos al
   navegador sin exponer nunca la URL de Blob directamente. */

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const archivo = searchParams.get("archivo");

  if (!token || !archivo) {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }

  await ensureSchema();
  const order = await getOrderByToken(token);
  if (!order) {
    return NextResponse.json({ error: "Link de descarga inválido." }, { status: 404 });
  }

  const blobUrl = getArchivoBlobUrl(order.product_ids, archivo);
  if (!blobUrl) {
    return NextResponse.json({ error: "Archivo no encontrado." }, { status: 404 });
  }

  const upstream = await fetch(blobUrl);
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Archivo no disponible por ahora." }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") || "application/octet-stream";
  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${archivo}"`,
      "Cache-Control": "no-store",
    },
  });
}
