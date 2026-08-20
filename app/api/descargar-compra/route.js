import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { ensureSchema, getOrderByToken } from "@/lib/db";
import { getArchivoBlobPath } from "@/lib/toolkit";

/* Descarga de un archivo ya comprado.
   GET /api/descargar-compra?token=<download_token>&archivo=<nombre>
   El token viaja en el link del correo de confirmación (ver
   app/api/stripe/webhook/route.js). El archivo real vive en un
   store PRIVADO de Vercel Blob: se pide aquí con el SDK (que se
   autentica con BLOB_READ_WRITE_TOKEN) y nunca se expone una URL
   descargable directamente al navegador. */

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

  const blobPath = getArchivoBlobPath(order.product_ids, archivo);
  if (!blobPath) {
    return NextResponse.json({ error: "Archivo no encontrado." }, { status: 404 });
  }

  let blob;
  try {
    blob = await get(blobPath, { access: "private" });
  } catch (err) {
    console.error("descargar-compra: error leyendo de Blob:", err);
    return NextResponse.json({ error: "Archivo no disponible por ahora." }, { status: 502 });
  }
  if (!blob?.body) {
    return NextResponse.json({ error: "Archivo no disponible por ahora." }, { status: 502 });
  }

  const contentType = blob.contentType || "application/octet-stream";
  return new NextResponse(blob.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${archivo}"`,
      "Cache-Control": "no-store",
    },
  });
}
