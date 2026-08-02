import { NextResponse } from "next/server";
import { subscribeContact } from "@/lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const email = String(body?.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Escribe un correo válido." },
      { status: 400 }
    );
  }

  try {
    await subscribeContact(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("newsletter/subscribe:", err);
    return NextResponse.json(
      { error: "No se pudo completar el registro. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
