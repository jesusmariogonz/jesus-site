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

/** Velas diarias de los últimos `days` días, como [{ date, close }].
 *  El endpoint /stock/candle de Finnhub ya no está disponible en el
 *  plan gratuito (requiere plan premium) — los históricos se traen
 *  de Stooq (stooq.com), que da CSV diario real sin necesidad de
 *  clave ni límite de requests. Finnhub se usa solo para el precio
 *  en vivo (/quote), que sí sigue disponible gratis. */
function simboloStooq(symbol) {
  // Finnhub usa sufijo ".MX" para BMV; Stooq usa minúsculas y ".mx"
  // también. Para EE.UU. sin sufijo, Stooq espera ".us".
  if (symbol.endsWith(".MX")) return symbol.toLowerCase();
  return `${symbol.toLowerCase()}.us`;
}

export async function fetchDailyCandles(symbol, days) {
  const stooqSymbol = simboloStooq(symbol);
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(stooqSymbol)}&i=d`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const csv = await res.text();
    if (!csv || csv.startsWith("No data") || csv.trim().length === 0) return null;

    const lineas = csv.trim().split("\n").slice(1); // sin encabezado
    const velas = lineas
      .map((l) => {
        const [date, , , , close] = l.split(",");
        const c = parseFloat(close);
        return date && !Number.isNaN(c) ? { date, close: c } : null;
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
