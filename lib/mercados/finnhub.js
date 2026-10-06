/* ============================================================
   Cliente de Finnhub — precios y velas diarias reales.
   ------------------------------------------------------------
   Mismo patrón que usa el repo de Alfia (finnhub.io/api/v1):
   /quote para precio actual, /stock/candle para históricos.
   Necesita FINNHUB_API_KEY en Vercel. Si falta la clave, si
   Finnhub no cubre el símbolo (ej. BMV en el plan gratuito), o si
   hay cualquier error de red, devuelve null — el llamador decide
   cómo mostrar "no disponible" sin inventar cifras.
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

/** Velas diarias de los últimos `days` días, como [{ date, close }]. */
export async function fetchDailyCandles(symbol, days) {
  const to = Math.floor(Date.now() / 1000);
  const from = to - days * 24 * 60 * 60;

  const data = await finnhubFetch("/stock/candle", {
    symbol,
    resolution: "D",
    from: String(from),
    to: String(to),
  });
  if (!data || data.s !== "ok" || !Array.isArray(data.c)) return null;

  return data.t.map((t, i) => ({
    date: new Date(t * 1000).toISOString().slice(0, 10),
    close: data.c[i],
  }));
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
