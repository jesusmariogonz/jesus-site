import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { getPost } from "@/lib/posts";
import { ensurePosturasSchema, votar, getConteoVotos } from "@/lib/db";

const COOKIE_VOTANTE = "jx_vid";
const UN_ANIO = 60 * 60 * 24 * 365;

export async function POST(request) {
  const { slug, voto } = await request.json().catch(() => ({}));
  if (!slug || !["a_favor", "en_contra"].includes(voto)) {
    return NextResponse.json({ error: "Falta slug o el voto no es válido." }, { status: 400 });
  }

  const post = getPost(slug);
  if (!post?.postura) {
    return NextResponse.json({ error: "Esta nota no tiene postura de debate." }, { status: 404 });
  }

  await ensurePosturasSchema();

  const cookieStore = await cookies();
  let votante = cookieStore.get(COOKIE_VOTANTE)?.value;
  const esNuevo = !votante;
  if (!votante) votante = randomUUID();

  await votar(slug, votante, voto);
  const conteo = await getConteoVotos(slug);

  const res = NextResponse.json({ ok: true, votos: conteo, miVoto: voto });
  if (esNuevo) {
    res.cookies.set(COOKIE_VOTANTE, votante, {
      maxAge: UN_ANIO,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
  }
  return res;
}
