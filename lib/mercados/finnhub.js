/* ============================================================
   Precios en vivo (Finnhub) y velas diarias reales (Yahoo Finance).
   ------------------------------------------------------------
   Precio actual: Finnhub /quote (necesita FINNHUB_API_KEY en Vercel).
   Históricos: endpoint público de gráficas de Yahoo Finance — el
   /stock/candle de Finnhub ya no es gratis, y Stooq bloquea con 403
   cualquier IP de datacenter/nube (Vercel incluida). Si falta la
   clave, si la fuente no cubre el símbolo (ej. BMV en el plan
   gratuito de Finnhub), o si hay cualquier error de red, devuelve
   null — el llamador decide cómo mostrar "no disponible" sin
   inventar cifras.
   ============================================================ */

const FINNHUB_BASE = "https://finnhub.io/api/v1";

function getApiKey() {
  return process.env.FINNHUB_API_KEY?.trim() || null;
}

async function finnhubFetch(path, params) {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const url = new URL(FINNHUB_BASE + path);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("token", apiKey);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Precio actual: { c: precio actual, pc: cierre anterior }. */
export async function fetchQuote(symbol) {
  const data = await finnhubFetch("/quote", { symbol });
  if (!data || typeof data.c !== "number" || data.c === 0) return null;
  return { price: data.c, prevClose: data.pc, changePct: data.pc ? ((data.c - data.pc) / data.pc) * 100 : 0 };
}

/** Velas diarias de los últimos `days` días, como [{ date, close }].
 *  El endpoint /stock/candle de Finnhub ya no está disponible en el
 *  plan gratuito (requiere plan premium). Stooq (stooq.com) también
 *  se probó, pero bloquea con 403 cualquier IP de datacenter/nube
 *  (incluye Vercel), sin importar el User-Agent — no es viable desde
 *  funciones serverless. Los históricos se traen en su lugar del
 *  endpoint público de gráficas de Yahoo Finance (chart API), que sí
 *  responde con datos reales desde Vercel, sin clave ni costo.
 *  Finnhub se usa solo para el precio en vivo (/quote). */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function fetchDailyCandles(symbol, days) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1d`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    const timestamps = result?.timestamp;
    const cierres = result?.indicators?.quote?.[0]?.close;
    if (!timestamps || !cierres) return null;

    const velas = timestamps
      .map((t, i) => {
        const c = cierres[i];
        return typeof c === "number"
          ? { date: new Date(t * 1000).toISOString().slice(0, 10), close: c }
          : null;
      })
      .filter(Boolean);

    if (velas.length < 2) return null;
    return velas.slice(-days);
  } catch {
    return null;
  }
}

/** Retorno anualizado y volatilidad anualizada reales, calculados a
 *  partir de cierres diarios reales (no sintéticos) — simple y
 *  estándar: retornos logarítmicos diarios, anualizados ×252. */
export function calcularRetornoYVolatilidad(cierres) {
  if (!cierres || cierres.length < 10) return null;
  const retornosDiarios = [];
  for (let i = 1; i < cierres.length; i++) {
    retornosDiarios.push(Math.log(cierres[i] / cierres[i - 1]));
  }
  const media = retornosDiarios.reduce((a, b) => a + b, 0) / retornosDiarios.length;
  const varianza =
    retornosDiarios.reduce((a, r) => a + (r - media) ** 2, 0) / retornosDiarios.length;
  const volatilidadDiaria = Math.sqrt(varianza);

  const retornoAnualizado = Math.exp(media * 252) - 1;
  const volatilidadAnualizada = volatilidadDiaria * Math.sqrt(252);

  return { retornoAnualizado, volatilidadAnualizada };
}
