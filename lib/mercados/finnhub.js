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

/** Precio actual + rango del día: { c: precio actual, pc: cierre anterior, h: máximo del día, l: mínimo, o: apertura }. */
export async function fetchQuote(symbol) {
  const data = await finnhubFetch("/quote", { symbol });
  if (!data || typeof data.c !== "number" || data.c === 0) return null;
  return {
    price: data.c,
    prevClose: data.pc,
    changePct: data.pc ? ((data.c - data.pc) / data.pc) * 100 : 0,
    dayHigh: typeof data.h === "number" ? data.h : null,
    dayLow: typeof data.l === "number" ? data.l : null,
    dayOpen: typeof data.o === "number" ? data.o : null,
  };
}

/** Ficha básica de la empresa: nombre, market cap, acciones en circulación.
 *  Finnhub /stock/profile2 sí está disponible en el plan gratuito. */
export async function fetchProfile(symbol) {
  const data = await finnhubFetch("/stock/profile2", { symbol });
  if (!data || !data.name) return null;
  return {
    name: data.name,
    marketCapMillones: typeof data.marketCapitalization === "number" ? data.marketCapitalization : null,
    accionesEnCirculacionMillones: typeof data.shareOutstanding === "number" ? data.shareOutstanding : null,
    moneda: data.currency || null,
    logo: data.logo || null,
    industria: data.finnhubIndustry || null,
  };
}

/** Noticias reales recientes de la empresa (Finnhub /company-news, gratis
 *  para símbolos de EE.UU.). `desde`/`hasta` en formato YYYY-MM-DD. */
export async function fetchCompanyNews(symbol, desde, hasta) {
  const data = await finnhubFetch("/company-news", { symbol, from: desde, to: hasta });
  if (!Array.isArray(data)) return null;
  return data
    .filter((n) => n.headline && n.url)
    .slice(0, 12)
    .map((n) => ({
      titulo: n.headline,
      resumen: n.summary || null,
      url: n.url,
      fuente: n.source || null,
      fecha: n.datetime ? new Date(n.datetime * 1000).toISOString() : null,
      imagen: n.image || null,
    }));
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
  const velas = await fetchDailyCandlesRange(symbol, "1y");
  if (!velas) return null;
  return velas.slice(-days);
}

/** Igual que fetchDailyCandles, pero pidiendo un rango más largo a Yahoo
 *  (hasta 5 años) y devolviendo también el volumen diario — lo necesita
 *  el comparador del screener (ventanas de hasta 3A, liquidez promedio).
 *  `range` acepta los valores de Yahoo: "1y", "2y", "5y", etc. */
export async function fetchDailyCandlesRange(symbol, range = "5y") {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=1d`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    const timestamps = result?.timestamp;
    const quote = result?.indicators?.quote?.[0];
    const cierres = quote?.close;
    const aperturas = quote?.open;
    const maximos = quote?.high;
    const minimos = quote?.low;
    const volumenes = quote?.volume;
    if (!timestamps || !cierres) return null;

    const velas = timestamps
      .map((t, i) => {
        const c = cierres[i];
        return typeof c === "number"
          ? {
              date: new Date(t * 1000).toISOString().slice(0, 10),
              open: typeof aperturas?.[i] === "number" ? aperturas[i] : c,
              high: typeof maximos?.[i] === "number" ? maximos[i] : c,
              low: typeof minimos?.[i] === "number" ? minimos[i] : c,
              close: c,
              volume: typeof volumenes?.[i] === "number" ? volumenes[i] : null,
            }
          : null;
      })
      .filter(Boolean);

    if (velas.length < 2) return null;
    return velas;
  } catch {
    return null;
  }
}

/** Media móvil simple de los últimos `periodo` cierres terminando en el
 *  índice `hastaIndice` (por defecto el último). Null si no hay suficientes
 *  datos. */
export function calcularSMA(cierres, periodo, hastaIndice = cierres.length - 1) {
  if (!cierres || hastaIndice - periodo + 1 < 0) return null;
  let suma = 0;
  for (let i = hastaIndice - periodo + 1; i <= hastaIndice; i++) suma += cierres[i];
  return suma / periodo;
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
