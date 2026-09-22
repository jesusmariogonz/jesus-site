import { NextResponse } from "next/server";

/* ============================================================
   Ruta temporal para completar el OAuth de LinkedIn una sola vez.
   ------------------------------------------------------------
   El sandbox de desarrollo no tiene salida a linkedin.com, así que
   este intercambio se hace desde el propio sitio ya desplegado.

   Uso (una sola vez): visita en el navegador
   https://jgonzalez.app/api/linkedin/setup?secret=TU_CLAVE&code=EL_CODE

   Devuelve { refresh_token, person_urn } — cópialos a
   LINKEDIN_REFRESH_TOKEN y LINKEDIN_PERSON_URN en Vercel y borra
   esta ruta.
   ============================================================ */

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const code = searchParams.get("code");
  const expected = process.env.NEWSLETTER_NOTIFY_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  if (!code) {
    return NextResponse.json({ error: "Falta el parámetro code." }, { status: 400 });
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Falta configurar LINKEDIN_CLIENT_ID/LINKEDIN_CLIENT_SECRET." },
      { status: 500 }
    );
  }

  try {
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://jgonzalez.app",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    const tokenData = await tokenRes.json().catch(() => ({}));
    if (!tokenRes.ok) {
      return NextResponse.json(
        { error: tokenData?.error_description || "No se pudo intercambiar el code.", detalle: tokenData },
        { status: 400 }
      );
    }

    const userRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json().catch(() => ({}));
    if (!userRes.ok) {
      return NextResponse.json(
        { error: "No se pudo obtener el perfil.", detalle: userData },
        { status: 400 }
      );
    }

    return NextResponse.json({
      refresh_token: tokenData.refresh_token,
      person_urn: `urn:li:person:${userData.sub}`,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}
