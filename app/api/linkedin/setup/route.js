import { NextResponse } from "next/server";
import { absUrl } from "@/lib/site";

/* ============================================================
   Setup manual de LinkedIn OAuth
   ------------------------------------------------------------
   Los tokens de LinkedIn duran ~60 días y esta app nunca tuvo
   aprobado el refresh token automático, así que hay que repetir
   este flujo de 3 pasos cada vez que el token esté por expirar
   (o ya haya expirado, como pasó en nov-2026).

   Cómo usarlo:
   1. Visita en el navegador:
      https://TU-SITIO/api/linkedin/setup?secret=TU_CLAVE
      (TU_CLAVE = NEWSLETTER_NOTIFY_SECRET en Vercel — se reusa la
      misma clave para no tener que crear una variable nueva).
   2. Te redirige a LinkedIn, inicia sesión y autoriza la app.
   3. LinkedIn te regresa a esta misma ruta con un `code`, que esta
      ruta intercambia por un access_token y te lo muestra junto
      con tu person URN.
   4. Copia ambos valores y pégalos a mano en Vercel → Environment
      Variables → LINKEDIN_ACCESS_TOKEN y LINKEDIN_PERSON_URN.
      Esta ruta nunca guarda el token por sí misma.

   Necesita LINKEDIN_CLIENT_ID y LINKEDIN_CLIENT_SECRET ya
   configurados en Vercel (siguen ahí desde el setup original).
   ============================================================ */

const SCOPES = "openid profile w_member_social";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const expected = process.env.NEWSLETTER_NOTIFY_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: "Falta configurar NEWSLETTER_NOTIFY_SECRET en Vercel." },
      { status: 500 }
    );
  }
  if (secret !== expected) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Faltan LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET en Vercel." },
      { status: 500 }
    );
  }

  const redirectUri = absUrl("/api/linkedin/setup");
  const code = searchParams.get("code");

  // Paso 1: sin `code` todavía — redirige a LinkedIn a autorizar.
  if (!code) {
    const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", SCOPES);
    authUrl.searchParams.set("state", secret);
    return NextResponse.redirect(authUrl.toString());
  }

  // Paso 2: LinkedIn regresó con `code` — lo cambiamos por un token.
  const state = searchParams.get("state");
  if (state !== expected) {
    return NextResponse.json({ error: "State inválido." }, { status: 401 });
  }

  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const tokenData = await tokenRes.json().catch(() => ({}));
  if (!tokenRes.ok) {
    return NextResponse.json(
      { error: "No se pudo intercambiar el code por un token.", detalle: tokenData },
      { status: 400 }
    );
  }

  const accessToken = tokenData.access_token;
  const expiresInDias = tokenData.expires_in
    ? Math.round(tokenData.expires_in / 86400)
    : null;

  // Paso 3: resolver el person URN con el token recién obtenido.
  const meRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const meData = await meRes.json().catch(() => ({}));
  const personUrn = meData.sub ? `urn:li:person:${meData.sub}` : null;

  return new NextResponse(
    `<!doctype html><html><body style="font-family:monospace;white-space:pre-wrap;padding:24px">
LINKEDIN_ACCESS_TOKEN=${accessToken}

LINKEDIN_PERSON_URN=${personUrn || "(no se pudo resolver — revisa manualmente)"}

Expira en ~${expiresInDias ?? "?"} días.

Copia estos dos valores a Vercel -> Environment Variables y vuelve a
desplegar (o espera al siguiente deploy). Esta pagina no guarda nada.
</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
