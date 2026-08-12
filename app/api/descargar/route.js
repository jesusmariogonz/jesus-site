import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { LIBROS } from "@/lib/recursos";

/* Descarga protegida de los libros de la Biblioteca.
   1. BotID verifica (invisible, sin captcha) que la petición venga
      de un navegador real, no de un script/bot.
   2. Solo se sirven archivos que ya están en la whitelist de
      LIBROS (nada de rutas arbitrarias del filesystem). */

export async function POST(request) {
  const verification = await checkBotId();
  if (verification.isBot) {
    return NextResponse.json(
      { error: "No pudimos verificar que la descarga la esté pidiendo una persona." },
      { status: 403 }
    );
  }

  let id;
  try {
    ({ id } = await request.json());
  } catch {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }

  const libro = LIBROS.find((l) => l.id === id);
  if (!libro) {
    return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", libro.archivo);
  let buffer;
  try {
    buffer = await readFile(filePath);
  } catch {
    return NextResponse.json({ error: "Archivo no disponible" }, { status: 404 });
  }

  const filename = libro.archivo.split("/").pop();
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
