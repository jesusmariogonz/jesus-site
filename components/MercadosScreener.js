"use client";

import { useEffect, useMemo, useState } from "react";
import Sparkline from "@/components/Sparkline";

const COLORES = ["#4f8cff", "#22c39a", "#a78bfa", "#f2b84a", "#f2814a", "#5fd0f2", "#e05fd8", "#d64545", "#ffd166", "#06d6a0"];
const MAX_COMPARAR = 5;

const RANGOS = [
  { id: "1W", etiqueta: "1W", ruedas: 5 },
  { id: "1M", etiqueta: "1M", ruedas: 21 },
  { id: "3M", etiqueta: "3M", ruedas: 63 },
  { id: "6M", etiqueta: "6M", ruedas: 126 },
  { id: "YTD", etiqueta: "YTD", ytd: true },
  { id: "1A", etiqueta: "1A", ruedas: 252 },
  { id: "3A", etiqueta: "3A", ruedas: 756 },
  { id: "5A", etiqueta: "5A", ruedas: 1260 },
];

/** Ruedas transcurridas en lo que va del año, contando hacia atrás desde el
 *  final del historial (que siempre termina en la rueda más reciente). */
function ruedasYTD(historial) {
  if (!historial?.length) return 252;
  const anioActual = historial[historial.length - 1][0].slice(0, 4);
  let i = historial.length - 1;
  while (i >= 0 && historial[i][0].slice(0, 4) === anioActual) i--;
  return historial.length - 1 - i;
}

// Indicadores del comparador — todos calculados con datos reales de
// precio/volumen (Yahoo Finance + Finnhub), sin ninguna cifra inventada.
const INDICADORES = [
  {
    id: "retorno12m",
    etiqueta: "Rendimiento 12 meses",
    formula: "(Pₜ / Pₜ₋₂₅₂ − 1) × 100",
    uso: "Identifica activos con buen desempeño de largo plazo.",
    modo: "precio",
    ejeTitulo: "Precio normalizado (inicio de la ventana = 100)",
    formato: (v) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`),
  },
  {
    id: "fuerzaRelativa",
    etiqueta: "Fuerza relativa vs. mercado",
    formula: "Rendimiento del activo − rendimiento del S&P 500",
    uso: "Detecta activos que superan al mercado.",
    modo: "precio",
    ejeTitulo: "Precio normalizado (inicio de la ventana = 100)",
    formato: (v) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(1)} pp`),
  },
  {
    id: "tendenciaAlcista",
    etiqueta: "Tendencia de largo plazo",
    formula: "Precio > SMA 200 días",
    uso: "Filtra activos cuya tendencia principal es alcista.",
    modo: "tendencia",
    ejeTitulo: "Precio vs. SMA 200 (100 = sobre la media)",
    formato: (v) => (v == null ? "—" : v ? "Alcista" : "Bajista"),
  },
  {
    id: "sma200Pendiente",
    etiqueta: "Pendiente de SMA 200",
    formula: "SMA 200 actual vs. SMA 200 de hace 20 días",
    uso: "Confirma si la tendencia está mejorando.",
    modo: "tendencia",
    ejeTitulo: "Precio vs. SMA 200 (100 = sobre la media)",
    formato: (v) => (v == null ? "—" : v >= 0 ? "Mejorando" : "Empeorando"),
  },
  {
    id: "volatilidadAnualizada",
    etiqueta: "Volatilidad anualizada",
    formula: "Desv. estándar de retornos diarios × √252",
    uso: "Compara el riesgo histórico de los activos.",
    modo: "volatilidad",
    ejeTitulo: "Volatilidad anualizada móvil (ventana de 20 ruedas)",
    formato: (v) => (v == null ? "—" : `${(v * 100).toFixed(1)}%`),
  },
  {
    id: "liquidezPromedio",
    etiqueta: "Liquidez promedio",
    formula: "Precio × volumen promedio de 20 días",
    uso: "Evita activos difíciles o costosos de operar.",
    modo: "liquidez",
    ejeTitulo: "Precio × volumen, promedio móvil de 20 ruedas",
    formato: (v) =>
      v == null
        ? "—"
        : `$${(v / 1e6).toLocaleString("es-MX", { maximumFractionDigits: 1 })}M`,
  },
];

function fmtPct(v) {
  if (v == null) return "—";
  return `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;
}

function ThConExplicacion({ titulo, explicacion }) {
  return (
    <th>
      <details className="screener-th-info">
        <summary>{titulo}</summary>
        <div className="screener-th-tooltip">{explicacion}</div>
      </details>
    </th>
  );
}

const EXPLICACIONES = {
  retorno:
    "Retorno anualizado: el promedio de los retornos diarios (en log) de los últimos ~180 días, proyectado a un año (×252 días de trading). Es cuánto hubiera rendido el activo en un año si mantuviera ese mismo ritmo — no una predicción, un promedio histórico.",
  volatilidad:
    "Volatilidad anualizada: qué tanto se mueve el precio día a día, medido como la desviación estándar de los retornos diarios y proyectado a un año. Más alta = oscilaciones más bruscas (mayor riesgo), no necesariamente peor desempeño.",
  sharpe:
    "Sharpe: retorno anualizado menos una tasa libre de riesgo (~4.5%, aprox. de un bono del Tesoro), dividido entre la volatilidad anualizada. Mide cuánto retorno dio el activo por cada unidad de riesgo tomado — más alto es mejor; negativo significa que ni siquiera superó la tasa libre de riesgo.",
};

export default function MercadosScreener() {
  const [data, setData] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [seleccion, setSeleccion] = useState([]);
  const [rango, setRango] = useState("6M");
  const [indicador, setIndicador] = useState("retorno12m");

  useEffect(() => {
    fetch("/api/mercados/screener")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ rows: [] }));
  }, []);

  const filas = useMemo(() => {
    if (!data?.rows) return [];
    return data.rows.filter((r) => {
      if (!r.disponible) return false;
      if (!busqueda.trim()) return true;
      const q = busqueda.toLowerCase();
      return r.symbol.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
    });
  }, [data, busqueda]);

  function toggle(symbol) {
    setSeleccion((prev) => {
      if (prev.includes(symbol)) return prev.filter((s) => s !== symbol);
      if (prev.length >= MAX_COMPARAR) return prev;
      return [...prev, symbol];
    });
  }

  if (!data) {
    return <p className="screener-cargando">Cargando precios en vivo…</p>;
  }

  const seleccionadas = (data.rows || []).filter(
    (r) => seleccion.includes(r.symbol) && r.historial?.length > 1
  );

  return (
    <div className="mercados-screener">
      <div className="screener-controles">
        <input
          type="text"
          placeholder="Buscar símbolo o nombre…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <span className="screener-conteo">{filas.length} activos</span>
      </div>

      <div className="screener-tabla-wrap">
        <table className="screener-tabla">
          <thead>
            <tr>
              <th aria-label="Comparar"></th>
              <th>Activo</th>
              <th>Precio</th>
              <th>Tendencia</th>
              <ThConExplicacion titulo="Retorno anual." explicacion={EXPLICACIONES.retorno} />
              <ThConExplicacion titulo="Volatilidad" explicacion={EXPLICACIONES.volatilidad} />
              <ThConExplicacion titulo="Sharpe" explicacion={EXPLICACIONES.sharpe} />
            </tr>
          </thead>
          <tbody>
            {filas.map((r) => (
              <tr key={r.symbol}>
                <td>
                  <input
                    type="checkbox"
                    checked={seleccion.includes(r.symbol)}
                    disabled={!seleccion.includes(r.symbol) && seleccion.length >= MAX_COMPARAR}
                    onChange={() => toggle(r.symbol)}
                    aria-label={`Comparar ${r.symbol}`}
                  />
                </td>
                <td>
                  <strong>{r.symbol}</strong>
                  <span className="screener-nombre">{r.name}</span>
                </td>
                <td>
                  {r.price != null
                    ? r.price.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : "No disponible"}
                  {r.changePct != null && (
                    <span className={r.changePct >= 0 ? "ticker-up" : "ticker-down"}>
                      {" "}
                      {r.changePct >= 0 ? "+" : ""}
                      {r.changePct.toFixed(2)}%
                    </span>
                  )}
                </td>
                <td className="screener-spark">
                  <Sparkline values={r.sparkline} />
                </td>
                <td>{fmtPct(r.retornoAnualizado)}</td>
                <td>{r.volatilidadAnualizada != null ? `${(r.volatilidadAnualizada * 100).toFixed(1)}%` : "—"}</td>
                <td>{r.sharpe != null ? r.sharpe.toFixed(2) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="screener-nota">
        Precio en vivo vía Finnhub; velas diarias reales vía Yahoo Finance. Pasa el cursor (o toca en celular)
        sobre "Retorno anual.", "Volatilidad" o "Sharpe" para ver cómo se calcula cada uno. Marca hasta{" "}
        {MAX_COMPARAR} activos en la columna de la izquierda para compararlos abajo.
      </p>

      {seleccionadas.length > 0 && (
        <Comparador
          seleccionadas={seleccionadas}
          rango={rango}
          setRango={setRango}
          indicador={indicador}
          setIndicador={setIndicador}
        />
      )}
    </div>
  );
}

function Comparador({ seleccionadas, rango, setRango, indicador, setIndicador }) {
  const rangoDef = RANGOS.find((r) => r.id === rango) || RANGOS[3];
  const ruedasRango = rangoDef.ytd ? ruedasYTD(seleccionadas[0]?.historial) : rangoDef.ruedas;
  const rangoActivo = { ...rangoDef, ruedas: ruedasRango };
  const indicadorActivo = INDICADORES.find((i) => i.id === indicador) || INDICADORES[0];
  const esModoPrecio = indicadorActivo.modo === "precio";

  const [tipoGrafica, setTipoGrafica] = useState("lineas");
  const [simboloVelas, setSimboloVelas] = useState(seleccionadas[0]?.symbol);

  // Velas solo tiene sentido para indicadores de precio (no para volatilidad/
  // liquidez/tendencia, que ya grafican otra cosa). Si el indicador cambia a
  // uno que no es de precio, regresa a líneas automáticamente.
  const modoVelasActivo = tipoGrafica === "velas" && esModoPrecio;
  const simboloActivoVelas =
    seleccionadas.find((r) => r.symbol === simboloVelas) || seleccionadas[0];

  return (
    <div className="screener-comparador">
      <div className="screener-comparador-cabecera">
        <span className="screener-grafica-titulo">
          {indicadorActivo.etiqueta} — comparativa ({seleccionadas.length} activo{seleccionadas.length !== 1 ? "s" : ""})
        </span>
        <div className="screener-comparador-controles-derecha">
          {esModoPrecio && (
            <div className="screener-tipo-grafica">
              <button
                type="button"
                className={tipoGrafica === "lineas" ? "screener-rango-btn activo" : "screener-rango-btn"}
                onClick={() => setTipoGrafica("lineas")}
              >
                Líneas
              </button>
              <button
                type="button"
                className={tipoGrafica === "velas" ? "screener-rango-btn activo" : "screener-rango-btn"}
                onClick={() => setTipoGrafica("velas")}
              >
                Velas
              </button>
            </div>
          )}
          <div className="screener-rangos">
            {RANGOS.map((r) => (
              <button
                key={r.id}
                type="button"
                className={r.id === rango ? "screener-rango-btn activo" : "screener-rango-btn"}
                onClick={() => setRango(r.id)}
              >
                {r.etiqueta}
              </button>
            ))}
          </div>
        </div>
      </div>

      {seleccionadas.length > 1 && (
        <div className="screener-velas-selector">
          <span>Activo enfocado (velas y ficha):</span>
          {seleccionadas.map((r) => (
            <button
              key={r.symbol}
              type="button"
              className={r.symbol === simboloActivoVelas?.symbol ? "screener-rango-btn activo" : "screener-rango-btn"}
              onClick={() => setSimboloVelas(r.symbol)}
            >
              {r.symbol}
            </button>
          ))}
        </div>
      )}

      <div className="screener-comparador-cuerpo">
        {modoVelasActivo ? (
          <GraficaVelas fila={simboloActivoVelas} ruedas={rangoActivo.ruedas} />
        ) : (
          <GraficaComparativa filas={seleccionadas} ruedas={rangoActivo.ruedas} indicador={indicadorActivo} />
        )}

        <div className="screener-indicadores">
          <span className="screener-indicadores-titulo">Indicadores</span>
          <div className="screener-indicadores-botones">
            {INDICADORES.map((ind) => (
              <button
                key={ind.id}
                type="button"
                title={ind.uso}
                className={ind.id === indicador ? "screener-indicador-btn activo" : "screener-indicador-btn"}
                onClick={() => setIndicador(ind.id)}
              >
                {ind.etiqueta}
              </button>
            ))}
          </div>

          <div className="screener-indicador-panel">
            <strong>{indicadorActivo.etiqueta}</strong>
            <span className="screener-indicador-formula">{indicadorActivo.formula}</span>
            <ul className="screener-indicador-lista">
              {[...seleccionadas]
                .sort((a, b) => {
                  const va = a.indicadores?.[indicadorActivo.id];
                  const vb = b.indicadores?.[indicadorActivo.id];
                  if (va == null) return 1;
                  if (vb == null) return -1;
                  if (typeof va === "boolean") return Number(vb) - Number(va);
                  return vb - va;
                })
                .map((r) => (
                  <li key={r.symbol}>
                    <span>{r.symbol}</span>
                    <span>{indicadorActivo.formato(r.indicadores?.[indicadorActivo.id])}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {simboloActivoVelas && <FichaActivo symbol={simboloActivoVelas.symbol} name={simboloActivoVelas.name} />}
    </div>
  );
}

/** Panel de estadísticas clave + noticias reales del activo enfocado,
 *  similar a lo que trae la ficha de un activo en Yahoo Finance: rango de
 *  52 semanas, capitalización de mercado, volumen promedio y noticias
 *  reales recientes (Finnhub /company-news, gratis para símbolos de EE.UU.). */
function FichaActivo({ symbol, name }) {
  const [ficha, setFicha] = useState(null);

  useEffect(() => {
    setFicha(null);
    fetch(`/api/mercados/ficha?symbol=${encodeURIComponent(symbol)}`)
      .then((r) => r.json())
      .then(setFicha)
      .catch(() => setFicha({ error: true }));
  }, [symbol]);

  if (!ficha) {
    return <p className="screener-cargando">Cargando ficha de {symbol}…</p>;
  }
  if (ficha.error) {
    return null;
  }

  const fmtUSD = (v, decimales = 2) =>
    v == null ? "—" : v.toLocaleString("en-US", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
  const fmtVolumen = (v) => (v == null ? "—" : `${(v / 1e6).toLocaleString("en-US", { maximumFractionDigits: 1 })}M`);
  const fmtMarketCap = (v) =>
    v == null ? "—" : v >= 1e6 ? `$${(v / 1e6).toFixed(2)}T` : `$${(v / 1e3).toFixed(2)}B`;

  return (
    <div className="screener-ficha">
      <span className="screener-ficha-titulo">
        {ficha.perfil?.name || name} ({symbol})
      </span>

      <div className="screener-ficha-stats">
        <div>
          <span className="screener-ficha-stat-label">Rango 52 semanas</span>
          <span className="screener-ficha-stat-valor">
            {ficha.rango52 ? `${fmtUSD(ficha.rango52.min)} – ${fmtUSD(ficha.rango52.max)}` : "—"}
          </span>
        </div>
        <div>
          <span className="screener-ficha-stat-label">Precio actual</span>
          <span className="screener-ficha-stat-valor">{fmtUSD(ficha.quote?.price)}</span>
        </div>
        <div>
          <span className="screener-ficha-stat-label">Rango del día</span>
          <span className="screener-ficha-stat-valor">
            {ficha.quote?.dayLow != null ? `${fmtUSD(ficha.quote.dayLow)} – ${fmtUSD(ficha.quote.dayHigh)}` : "—"}
          </span>
        </div>
        <div>
          <span className="screener-ficha-stat-label">Capitalización de mercado</span>
          <span className="screener-ficha-stat-valor">{fmtMarketCap(ficha.perfil?.marketCapMillones)}</span>
        </div>
        <div>
          <span className="screener-ficha-stat-label">Volumen promedio (20d)</span>
          <span className="screener-ficha-stat-valor">{fmtVolumen(ficha.volumenPromedio20)}</span>
        </div>
        <div>
          <span className="screener-ficha-stat-label">Industria</span>
          <span className="screener-ficha-stat-valor">{ficha.perfil?.industria || "—"}</span>
        </div>
      </div>

      {ficha.noticias?.length > 0 && (
        <div className="screener-ficha-noticias">
          <span className="screener-ficha-titulo">Noticias recientes</span>
          <ul>
            {ficha.noticias.slice(0, 6).map((n) => (
              <li key={n.url}>
                <a href={n.url} target="_blank" rel="noopener noreferrer">
                  {n.titulo}
                </a>
                <span className="screener-ficha-noticia-meta">
                  {n.fuente}
                  {n.fecha ? ` · ${new Date(n.fecha).toLocaleDateString("es-MX")}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const SMA_PERIODO = 200;
const VENTANA_MOVIL = 20; // para volatilidad/liquidez "móviles"

/** Media móvil simple terminando en el índice `i` (null si no hay suficiente historial antes). */
function smaEn(cierres, periodo, i) {
  if (i - periodo + 1 < 0) return null;
  let suma = 0;
  for (let k = i - periodo + 1; k <= i; k++) suma += cierres[k];
  return suma / periodo;
}

/** Serie completa de un activo según el modo del indicador activo, ya
 *  recortada a los últimos `ruedas` puntos. Cada modo cambia qué se grafica:
 *  - "precio": precio normalizado a 100 al inicio de la ventana.
 *  - "tendencia": precio ÷ SMA200 × 100 (100 = exactamente sobre la media).
 *  - "volatilidad": volatilidad anualizada móvil (ventana de 20 ruedas), en %.
 *  - "liquidez": precio × volumen, promedio móvil de 20 ruedas.
 */
/** Formatea un punto individual de la serie para el tooltip, según el modo
 *  de la gráfica activa (distinto del formato del indicador agregado). */
function formatoPuntoSerie(modo, v) {
  if (modo === "tendencia") return `${v.toFixed(1)}% de la SMA200`;
  if (modo === "volatilidad") return `${v.toFixed(1)}% anualizada`;
  if (modo === "liquidez") return `$${v.toFixed(1)}M`;
  return `índice ${v.toFixed(1)}`; // modo "precio"
}

function serieParaModo(fila, modo, ruedas) {
  const historial = fila.historial; // [[date, open, high, low, close, volume], ...] con colchón de 200 ruedas extra
  const cierres = historial.map((h) => h[4]);
  const volumenes = historial.map((h) => h[5]);
  const n = cierres.length;

  if (modo === "tendencia") {
    const serieCompleta = cierres.map((_, i) => {
      const sma = smaEn(cierres, SMA_PERIODO, i);
      return sma ? (cierres[i] / sma) * 100 : null;
    });
    return serieCompleta.slice(-ruedas);
  }

  if (modo === "volatilidad") {
    const serieCompleta = cierres.map((_, i) => {
      if (i - VENTANA_MOVIL < 0) return null;
      const retornos = [];
      for (let k = i - VENTANA_MOVIL + 1; k <= i; k++) {
        retornos.push(Math.log(cierres[k] / cierres[k - 1]));
      }
      const media = retornos.reduce((a, b) => a + b, 0) / retornos.length;
      const varianza = retornos.reduce((a, r) => a + (r - media) ** 2, 0) / retornos.length;
      return Math.sqrt(varianza) * Math.sqrt(252) * 100;
    });
    return serieCompleta.slice(-ruedas);
  }

  if (modo === "liquidez") {
    const serieCompleta = cierres.map((_, i) => {
      if (i - VENTANA_MOVIL + 1 < 0) return null;
      let suma = 0;
      let dias = 0;
      for (let k = i - VENTANA_MOVIL + 1; k <= i; k++) {
        if (typeof volumenes[k] === "number") {
          suma += volumenes[k] * cierres[k];
          dias++;
        }
      }
      return dias > 0 ? suma / dias / 1e6 : null; // en millones de USD
    });
    return serieCompleta.slice(-ruedas);
  }

  // modo "precio" (default): normalizado a 100 al inicio de la ventana visible.
  const ventana = cierres.slice(-ruedas);
  const base = ventana[0];
  return ventana.map((c) => (base ? (c / base) * 100 : 100));
}

/** Gráfica de líneas que cambia según el indicador activo (ver serieParaModo). */
function GraficaComparativa({ filas, ruedas, indicador }) {
  const width = 760;
  const height = 320;
  const padding = 36;
  const modo = indicador?.modo || "precio";

  const series = filas.map((r) => serieParaModo(r, modo, ruedas));
  const fechas = filas.map((r) => r.historial.slice(-ruedas).map((h) => h[0]));

  const todos = series.flat().filter((v) => v != null);
  const min = todos.length ? Math.min(...todos) : 0;
  const max = todos.length ? Math.max(...todos) : 1;
  const range = max - min || 1;
  const nPuntos = Math.max(...series.map((s) => s.length), 2);
  // Marcadores con tooltip nativo, muestreados para no saturar el SVG en ventanas largas (5A).
  const pasoMarcador = Math.max(1, Math.floor(nPuntos / 80));

  function coord(i, v) {
    const x = padding + (i / (nPuntos - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return [x, y];
  }

  function puntos(serie) {
    return serie
      .map((v, i) => (v == null ? null : [i, v]))
      .filter(Boolean)
      .map(([i, v]) => coord(i, v).map((n) => n.toFixed(1)).join(","))
      .join(" ");
  }

  return (
    <div className="screener-grafica">
      {indicador?.ejeTitulo && <span className="screener-grafica-eje">{indicador.ejeTitulo}</span>}
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="screener-grafica-svg">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--line)" strokeWidth="1" />
        {modo === "tendencia" && min < 100 && max > 100 && (
          <line
            x1={padding}
            x2={width - padding}
            y1={height - padding - ((100 - min) / range) * (height - padding * 2)}
            y2={height - padding - ((100 - min) / range) * (height - padding * 2)}
            stroke="var(--line)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
        )}
        {filas.map((r, i) => (
          <polyline
            key={r.symbol}
            points={puntos(series[i])}
            fill="none"
            stroke={COLORES[i % COLORES.length]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {filas.map((r, i) =>
          series[i].map((v, j) => {
            if (v == null || j % pasoMarcador !== 0) return null;
            const [x, y] = coord(j, v);
            return (
              <circle key={`${r.symbol}-${j}`} cx={x} cy={y} r="7" fill="transparent" stroke="none">
                <title>
                  {r.symbol} · {fechas[i][j]} · {formatoPuntoSerie(modo, v)}
                </title>
              </circle>
            );
          })
        )}
      </svg>
      <div className="screener-grafica-leyenda">
        {filas.map((r, i) => (
          <span key={r.symbol} className="screener-grafica-leyenda-item">
            <span className="screener-grafica-dot" style={{ background: COLORES[i % COLORES.length] }} />
            {r.symbol}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Velas japonesas (OHLC) de un solo activo — un vistazo clásico de precio,
 *  en vez de la línea normalizada del modo comparativo. */
function GraficaVelas({ fila, ruedas }) {
  const width = 760;
  const height = 320;
  const padding = 36;

  if (!fila?.historial?.length) {
    return <p className="screener-cargando">Sin historial suficiente para este activo.</p>;
  }

  const ventana = fila.historial.slice(-ruedas); // [date, open, high, low, close, volume]
  const minimos = ventana.map((v) => v[3]);
  const maximos = ventana.map((v) => v[2]);
  const min = Math.min(...minimos);
  const max = Math.max(...maximos);
  const range = max - min || 1;
  const n = ventana.length;
  const anchoDisponible = width - padding * 2;
  const anchoVela = Math.max(1.5, (anchoDisponible / n) * 0.6);

  function y(valor) {
    return height - padding - ((valor - min) / range) * (height - padding * 2);
  }

  return (
    <div className="screener-grafica">
      <span className="screener-grafica-eje">
        {fila.symbol} — OHLC diario ({n} ruedas)
      </span>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="screener-grafica-svg">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--line)" strokeWidth="1" />
        {ventana.map((v, i) => {
          const [, open, high, low, close] = v;
          const x = padding + ((i + 0.5) / n) * anchoDisponible;
          const alza = close >= open;
          const color = alza ? "#22c39a" : "#ef476f";
          const yAbierto = y(open);
          const yCerrado = y(close);
          const cuerpoY = Math.min(yAbierto, yCerrado);
          const cuerpoAlto = Math.max(1, Math.abs(yCerrado - yAbierto));
          return (
            <g key={v[0]}>
              <line x1={x} x2={x} y1={y(high)} y2={y(low)} stroke={color} strokeWidth="1" />
              <rect x={x - anchoVela / 2} y={cuerpoY} width={anchoVela} height={cuerpoAlto} fill={color}>
                <title>
                  {v[0]} · A: {open.toFixed(2)} · M: {high.toFixed(2)} · m: {low.toFixed(2)} · C: {close.toFixed(2)}
                </title>
              </rect>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
