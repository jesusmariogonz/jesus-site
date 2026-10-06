import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPost } from "@/lib/posts";
import {
  ensurePosturasSchema,
  getConteoVotos,
  getVotoDe,
  listarComentariosAprobados,
} from "@/lib/db";

const COOKIE_VOTANTE = "jx_vid";

export async function GET(request, { params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post?.postura) {
    return NextResponse.json({ error: "Esta nota no tiene postura de debate." }, { status: 404 });
  }

  await ensurePosturasSchema();

  const cookieStore = await cookies();
  const votante = cookieStore.get(COOKIE_VOTANTE)?.value || null;

  const [conteo, miVoto, comentarios] = await Promise.all([
    getConteoVotos(slug),
    votante ? getVotoDe(slug, votante) : null,
    listarComentariosAprobados(slug),
  ]);

  return NextResponse.json({
    pregunta: post.postura.pregunta,
    aFavor: post.postura.aFavor,
    enContra: post.postura.enContra,
    votos: conteo,
    miVoto,
    comentarios,
  });
}
