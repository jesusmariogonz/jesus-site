import { NextResponse } from "next/server";
import { handleUpload } from "@vercel/blob/client";

/* Ruta temporal de un solo uso — implementa el protocolo oficial de
   subida de cliente de Vercel Blob (handleUpload) para subir archivos
   grandes directo a Blob, evitando el límite de ~4.5MB de body de las
   funciones serverless de Next.js. Protegida con TEMP_ADMIN_UPLOAD_SECRET,
   se borra después de usarla para subir los libros de "Cómo leer el
   mercado". */

function autorizado(request) {
  const secret = new URL(request.url).searchParams.get("secret");
  const expected = process.env.TEMP_ADMIN_UPLOAD_SECRET;
  return Boolean(expected) && secret === expected;
}

export async function POST(request) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json();

  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async (pathname) => ({
      allowedContentTypes: ["application/pdf"],
      addRandomSuffix: false,
      access: "private",
    }),
    onUploadCompleted: async () => {},
  });

  return NextResponse.json(jsonResponse);
}
