"use client";

/* Explorador público de Trading Algorítmico (/pulso-mercado/trading).
   Consume el agregado ya sanitizado de lib/trading/public-snapshot.js
   — no lee los JSON del motor directamente ni hace fetch a nada
   privado. Primera fase de 3 módulos (Dashboard, Portafolios,
   Operaciones); Investigación/Código/Bitácora quedan para una
   siguiente fase, una vez revisado qué del otro repo es seguro
   publicar tal cual. */

import { useMemo, useState } from "react";
import Link from "next/link";

function LinkSimbolo({ symbol }) {
  return (
    <Link href={`/pulso-mercado/trading/simbolo/${symbol}`} className="trading-symbol-link">
      {symbol}
    </Link>
  );
}

function formatFecha(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
}

function formatSoloFecha(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
}

function pct(n, { signo = true } = {}) {
  if (n === null || n === undefined) return "—";
  const s = signo && n > 0 ? "+" : "";
  return `${s}${n}%`;
}

function tonoDe(n) {
  if (n === null || n === undefined) return undefined;
  return n > 0 ? "up" : n < 0 ? "down" : undefined;
}

function toneColor(tono) {
  return tono === "up" ? "#16a34a" : tono === "down" ? "#dc2626" : undefined;
}

/* ---------- Dashboard: tarjetas de métrica estilo terminal ---------- */

function StatCard({ etiqueta, valor, tono, sub }) {
  return (
    <div className="trading-stat-card">
      <span className="trading-stat-etiqueta">{etiqueta}</span>
      <span className="trading-stat-valor" style={{ color: toneColor(tono) }}>
        {valor}
      </span>
      {sub && <span className="trading-stat-sub">{sub}</span>}
    </div>
  );
}

function EquityChart({ history, startingCapital, height = 220 }) {
  const width = 900;
  const pad = { top: 16, right: 16, bottom: 24, left: 16 };

  if (!history?.length) {
    return <p className="pulsodash-vacio">Sin historial todavía — el sistema abrió hoy.</p>;
  }

  const values = history.map((h) => h.equity);
  const min = Math.min(startingCapital, ...values);
  const max = Math.max(startingCapital, ...values);
  const range = max - min || 1;

  const x = (i) =>
    history.length === 1 ? width / 2 : pad.left + (i / (history.length - 1)) * (width - pad.left - pad.right);
  const y = (v) => height - pad.bottom - ((v - min) / range) * (height - pad.top - pad.bottom);

  const linePath = history.map((h, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(h.equity).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${x(history.length - 1).toFixed(1)},${height - pad.bottom} L${x(0).toFixed(1)},${height - pad.bottom} Z`;
  const baselineY = y(startingCapital);
  const ultimo = history[history.length - 1];
  const subio = ultimo.equity >= startingCapital;
  const color = subio ? "#16a34a" : "#dc2626";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="trading-equity-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={pad.left} x2={width - pad.right} y1={baselineY} y2={baselineY} stroke="var(--line-soft)" strokeWidth="1" strokeDasharray="4 4" />
      <path d={areaPath} fill="url(#trading-equity-fill)" stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" />
      {history.map((h, i) => (
        <circle key={h.date} cx={x(i)} cy={y(h.equity)} r="3.5" fill={color} />
      ))}
      <text x={pad.left} y={height - 4} fontSize="11" fill="var(--ink-soft)">{history[0].date}</text>
      <text x={width - pad.right} y={height - 4} fontSize="11" fill="var(--ink-soft)" textAnchor="end">{ultimo.date}</text>
    </svg>
  );
}

const BUCKET_COLORS = {
  largo_plazo: "#1348d6",
  mediano_plazo: "#0f766e",
  riesgo_alto: "#c2410c",
  blend_spy_gld: "#b8860b",
};

function DonutAsignacion({ distribucion, asignacionReal }) {
  const total = distribucion.reduce((acc, a) => acc + (a.pct || 0), 0) || 100;
  let acumulado = 0;
  const stops = distribucion.map((a) => {
    const inicio = (acumulado / total) * 360;
    acumulado += a.pct || 0;
    const fin = (acumulado / total) * 360;
    return `${BUCKET_COLORS[a.key] || "#999"} ${inicio}deg ${fin}deg`;
  });

  return (
    <div>
      <div className="trading-donut-row">
        <div className="trading-donut" style={{ background: `conic-gradient(${stops.join(", ")})` }}>
          <div className="trading-donut-centro">
            <span>100%</span>
            <span className="trading-donut-centro-label">capital</span>
          </div>
        </div>
        <ul className="trading-donut-legend">
          {distribucion.map((a) => (
            <li key={a.key}>
              <span className="trading-donut-swatch" style={{ background: BUCKET_COLORS[a.key] || "#999" }} />
              <span className="trading-donut-legend-label">{a.etiqueta}</span>
              <span className="trading-donut-legend-valor">
                ${a.monto}
                <span className="trading-donut-legend-objetivo"> · {a.pct !== null ? `${a.pct}%` : "—"}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="pulsodash-vacio" style={{ marginTop: 16, marginBottom: 6 }}>
        Por bucket (cada uno con su cash ocioso incluido) vs. objetivo:
      </p>
      <ul className="trading-donut-legend">
        {asignacionReal.map((a) => (
          <li key={a.key}>
            <span className="trading-donut-swatch" style={{ background: BUCKET_COLORS[a.key] || "#999" }} />
            <span className="trading-donut-legend-label">{a.etiqueta}</span>
            <span className="trading-donut-legend-valor">
              {a.pct !== null ? `${a.pct}%` : "—"}
              <span className="trading-donut-legend-objetivo"> (objetivo {a.objetivoPct}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AvisoMoneda({ resumen }) {
  if (resumen.monedaUSD) {
    return (
      <p className="pulsodash-vacio" style={{ marginBottom: 16 }}>
        No se pudo obtener el tipo de cambio de hoy — las cifras se muestran en USD (dólares),
        no en pesos.
      </p>
    );
  }
  return (
    <p className="pulsodash-vacio" style={{ marginBottom: 16 }}>
      Cifras en pesos mexicanos (MXN), convertidas de USD al tipo de cambio del{" "}
      {resumen.usdMxnRateFecha || "día"}: ${resumen.usdMxnRate} MXN por USD.
    </p>
  );
}

const ESTADO_ICONO = { ok: "🟢", revision: "🟡", alerta: "🔴", falta: "🔴" };

function EstadoSistemaChips({ resumen }) {
  const chips = [
    {
      ok: resumen.datosAlDia,
      textoOk: "Datos al día",
      textoMal: "Datos desactualizados (>30h)",
    },
    {
      ok: !resumen.algunBucketSuspendido,
      textoOk: "Sin buckets suspendidos",
      textoMal: "Al menos un bucket suspendido",
    },
    {
      ok: !resumen.algunCircuitBreakerHoy,
      textoOk: "Sin circuit breaker activo",
      textoMal: "Circuit breaker activado hoy",
    },
  ];
  return (
    <div className="trading-estado-row">
      {chips.map((c, i) => (
        <span key={i} className={`trading-estado-chip ${c.ok ? "ok" : "mal"}`}>
          {c.ok ? "🟢" : "🔴"} {c.ok ? c.textoOk : c.textoMal}
        </span>
      ))}
    </div>
  );
}

function ScorecardSistema({ scorecard }) {
  return (
    <div className="pulsodash-panel" style={{ marginBottom: 24 }}>
      <div className="pulsodash-panel-head">
        <span className="pulsodash-panel-title">Salud del sistema</span>
      </div>
      <div className="trading-scorecard" style={{ marginTop: 12 }}>
        {scorecard.map((s) => (
          <div key={s.dimension} className="trading-scorecard-row">
            <span className="trading-scorecard-icono">{ESTADO_ICONO[s.estado]}</span>
            <span className="trading-scorecard-dim">{s.dimension}</span>
            <span className="trading-scorecard-detalle">{s.detalle}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContribucionRetorno({ contribucionRetorno }) {
  const max = Math.max(1, ...contribucionRetorno.map((c) => Math.abs(c.contribucionPct || 0)));
  return (
    <div className="pulsodash-panel" style={{ marginBottom: 24 }}>
      <div className="pulsodash-panel-head">
        <span className="pulsodash-panel-title">Contribución al retorno total por portafolio</span>
      </div>
      <p className="pulsodash-vacio" style={{ marginTop: 8, marginBottom: 16 }}>
        Cuánto aportó (o restó) cada bucket al retorno TOTAL del portafolio — no es el retorno
        individual de cada bucket, es su peso real dentro del resultado conjunto. Las posiciones de
        cada bucket y el cash ocioso (blend SPY/GLD) se muestran por separado y suman el total.
      </p>
      <div className="trading-contrib-list">
        {contribucionRetorno.map((c) => {
          const valor = c.contribucionPct ?? 0;
          const ancho = Math.min(100, (Math.abs(valor) / max) * 100);
          const positivo = valor >= 0;
          return (
            <div key={c.key} className="trading-contrib-row">
              <span className="trading-contrib-label">{c.etiqueta}</span>
              <div className="trading-contrib-bar-track">
                <div
                  className={`trading-contrib-bar ${positivo ? "pos" : "neg"}`}
                  style={{ width: `${ancho}%` }}
                />
              </div>
              <span className="trading-contrib-valor" style={{ color: toneColor(tonoDe(valor)) }}>
                {pct(valor)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModuloDashboard({ data }) {
  const { resumen } = data;
  return (
    <div>
      <AvisoMoneda resumen={resumen} />

      <div className="trading-cockpit">
        <div className="trading-cockpit-principal">
          <span className="trading-cockpit-etiqueta">Equity actual · {data.fuente === "ibkr" ? "Motor IBKR" : "Paper Trading"}</span>
          <span className="trading-cockpit-valor">${resumen.equityActualTotal}</span>
          <span className="trading-cockpit-sub">de ${resumen.capitalInicialTotal} iniciales</span>
        </div>
        <div className="trading-cockpit-secundarios">
          <StatCard etiqueta="Retorno acumulado" valor={pct(resumen.retornoTotalPct)} tono={tonoDe(resumen.retornoTotalPct)} />
          <StatCard etiqueta="Posiciones abiertas" valor={resumen.totalAbiertas} />
          <StatCard etiqueta="Operaciones cerradas" valor={resumen.totalCerradas} />
        </div>
      </div>
      <EstadoSistemaChips resumen={resumen} />

      <div className="trading-stat-grid" style={{ marginTop: 20 }}>
        <StatCard
          etiqueta="Drawdown máximo"
          valor={pct(resumen.drawdownMaximoPct, { signo: false })}
          sub={resumen.drawdownInconsistente ? "⚠ dato inconsistente, ver abajo" : "peor bucket"}
        />
        <StatCard
          etiqueta="Win rate global"
          valor={resumen.historialSuficienteWinRate ? `${resumen.winRateGlobalPct}%` : "—"}
          sub={resumen.historialSuficienteWinRate ? undefined : "historial insuficiente"}
        />
      </div>

      <div className="pulsodash-panel" style={{ marginTop: 24, marginBottom: 24 }}>
        <div className="pulsodash-panel-head">
          <span className="pulsodash-panel-title">Curva de equity combinada · {data.fuente === "ibkr" ? "Motor IBKR" : "Paper Trading"}</span>
          <span className="pulsodash-panel-sub">Última actualización: {formatFecha(data.generatedAt)}</span>
        </div>
        <div style={{ marginTop: 12 }}>
          <EquityChart history={data.historialCombinado} startingCapital={resumen.capitalInicialTotal} />
        </div>
        <p className="pulsodash-vacio" style={{ marginTop: 12 }}>
          Comparación contra SPY (buy &amp; hold): pendiente — el motor todavía no exporta una
          serie diaria de benchmark para el paper trading (sí existe a nivel de backtest, ver
          Investigación).
        </p>
      </div>

      <div className="pulsodash-panel" style={{ marginBottom: 24 }}>
        <div className="pulsodash-panel-head">
          <span className="pulsodash-panel-title">Distribución de capital — objetivo vs. real</span>
        </div>
        <div style={{ marginTop: 16 }}>
          <DonutAsignacion distribucion={data.distribucionCapital} asignacionReal={data.asignacionReal} />
        </div>
        {data.avisosEfectivoNegativo?.length > 0 && (
          <div className="motor-aviso">
            <strong>⚠ Efectivo negativo en el motor IBKR.</strong> Estos portafolios tienen posiciones por más
            de su capital, porque varias compras se financiaron con un cash ocioso que ya no existe tras la
            reconciliación del 9-nov-2026. La gráfica muestra el capital neto (posiciones + efectivo):
            <ul>
              {data.avisosEfectivoNegativo.map((a) => (
                <li key={a.key}>
                  <strong>{a.etiqueta}</strong>: posiciones por ${a.valorPosiciones}, efectivo ${a.efectivo}, capital neto ${a.capital}
                  {a.veces ? ` (posiciones ≈ ${a.veces}× su capital)` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ContribucionRetorno contribucionRetorno={data.contribucionRetorno} />

      <ScorecardSistema scorecard={data.scorecard} />

      <div className="pulsodash-panel" style={{ marginBottom: 24 }}>
        <div className="pulsodash-panel-head">
          <span className="pulsodash-panel-title">¿Qué haría cambiar el sistema?</span>
        </div>
        <div className="trading-criterios" style={{ marginTop: 12 }}>
          <div>
            <span className="trading-criterios-titulo trading-criterios-no">El sistema NO cambia por</span>
            <ul>
              <li>una operación perdedora individual</li>
              <li>un mal mes aislado</li>
              <li>un desempeño peor al esperado en el corto plazo</li>
            </ul>
          </div>
          <div>
            <span className="trading-criterios-titulo trading-criterios-si">El sistema SÍ se reconsidera si</span>
            <ul>
              <li>el desempeño en vivo diverge de forma sostenida del backtest</li>
              <li>los costos reales de operar superan lo asumido en el modelo</li>
              <li>el drawdown supera la tolerancia histórica documentada</li>
              <li>el comportamiento de las señales cambia de forma estructural</li>
              <li>se detecta un problema de calidad de datos</li>
            </ul>
          </div>
        </div>
      </div>

      {data.pendientesDelMotor?.length > 0 && (
        <div className="pulsodash-panel">
          <div className="pulsodash-panel-head">
            <span className="pulsodash-panel-title">Pendientes del motor</span>
          </div>
          <ul style={{ marginTop: 12, paddingLeft: 20, color: "var(--ink-soft)" }}>
            {data.pendientesDelMotor.map((p) => (
              <li key={p} style={{ marginBottom: 6 }}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------- Portafolios ---------- */

function TablaAbiertasBucket({ posiciones }) {
  if (!posiciones.length) return <p className="pulsodash-vacio">Ninguna posición abierta en este bucket ahora mismo.</p>;
  return (
    <div className="prose" style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Símbolo</th>
            <th>Estrategia</th>
            <th>Entrada</th>
            <th>Precio entrada</th>
            <th>Precio cierre hoy</th>
            <th>Stop</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {posiciones.map((p, i) => (
            <tr key={`${p.symbol}-${p.entry_date}-${i}`}>
              <td><LinkSimbolo symbol={p.symbol} /></td>
              <td>{p.strategy}</td>
              <td>{p.entry_date}</td>
              <td>${p.entry_price}</td>
              <td>{p.current_price != null ? `$${p.current_price}` : "—"}</td>
              <td>${typeof p.stop_price === "number" ? p.stop_price.toFixed(2) : p.stop_price}</td>
              <td>{p.shares}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ModuloPortafolios({ data }) {
  const opciones = data.bucketsConBlend || data.buckets;
  const [seleccion, setSeleccion] = useState(opciones[0]?.key || null);
  const bucket = opciones.find((b) => b.key === seleccion) || opciones[0];

  return (
    <div>
      <div className="trading-tabs" style={{ marginBottom: 24 }}>
        {opciones.map((b) => (
          <button
            key={b.key}
            type="button"
            className={`trading-tab${seleccion === b.key ? " activo" : ""}`}
            onClick={() => setSeleccion(b.key)}
          >
            {b.etiqueta}
          </button>
        ))}
      </div>

      {bucket && (
        <div className="pulsodash-panel">
          <div className="pulsodash-panel-head">
            <span className="pulsodash-panel-title">{bucket.etiqueta}</span>
            <span className="pulsodash-panel-sub">Desde {bucket.startDate}</span>
          </div>

          {bucket.suspendido && (
            <div className="postura-aviso error" style={{ margin: "12px 0", padding: 16, borderRadius: 8 }}>
              <strong>Bucket suspendido</strong> desde {bucket.suspendidoDesde}: {bucket.suspendidoRazon}.
              No se liquidó nada — solo se bloquearon nuevas compras hasta reautorizar.
            </div>
          )}
          {!bucket.suspendido && bucket.circuitBreakerHoy && (
            <div className="postura-aviso error" style={{ margin: "12px 0", padding: 16, borderRadius: 8 }}>
              <strong>Límite de pérdida diaria alcanzado hoy</strong> — sin nuevas compras hasta la próxima sesión.
            </div>
          )}

          <div className="highlights-grid" style={{ margin: "16px 0 20px" }}>
            <div className="highlight-item">
              <span className="highlight-valor">${bucket.startingCapital}</span>
              <span className="highlight-etiqueta">capital asignado</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor">${bucket.equityActual}</span>
              <span className="highlight-etiqueta">equity actual</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor" style={{ color: toneColor(tonoDe(bucket.retornoAcumuladoPct)) }}>
                {pct(bucket.retornoAcumuladoPct)}
              </span>
              <span className="highlight-etiqueta">retorno acumulado</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor">{pct(bucket.drawdownPct, { signo: false })}</span>
              <span className="highlight-etiqueta">
                drawdown{bucket.drawdownInconsistente ? " ⚠" : ""}
              </span>
            </div>
            {!bucket.esInformativo && (
              <div className="highlight-item">
                <span className="highlight-valor">{bucket.posicionesAbiertas.length} / {bucket.totalCerradas}</span>
                <span className="highlight-etiqueta">abiertas / cerradas</span>
              </div>
            )}
            {bucket.totalCerradas >= 5 && bucket.winRatePct !== null && (
              <div className="highlight-item">
                <span className="highlight-valor">{bucket.winRatePct}%</span>
                <span className="highlight-etiqueta">win rate</span>
              </div>
            )}
          </div>

          {bucket.meta && (
            <p className="pulsodash-vacio" style={{ marginBottom: bucket.drawdownInconsistente ? 8 : 20 }}>
              Estrategia: {bucket.meta.estrategia} · riesgo por operación: {bucket.meta.riesgoPorOperacion} ·
              límite de pérdida diaria: {bucket.meta.limitePerdidaDiaria} · drawdown de revisión: {bucket.meta.drawdownRevision}.
            </p>
          )}
          {bucket.drawdownInconsistente && (
            <p className="pulsodash-vacio" style={{ marginBottom: 20, color: "#d97706" }}>
              ⚠ El equity de este bucket está por debajo de su capital inicial, pero el motor
              reportó 0% de drawdown — es una inconsistencia conocida en el cálculo del motor
              (ver Investigación), no un error de esta página.
            </p>
          )}

          <h3 style={{ fontSize: "0.95rem", marginBottom: 8 }}>Curva de equity</h3>
          <EquityChart history={bucket.historialDiario} startingCapital={bucket.startingCapital} height={160} />

          {bucket.esInformativo ? (
            <p className="pulsodash-vacio" style={{ marginTop: 20 }}>
              No se muestra un detalle de compras/ventas individuales aquí: a diferencia de los
              buckets de arriba, el registro histórico de movimientos del blend en este motor
              quedó incompleto, así que listar operaciones específicas sería fabricar datos. La
              curva de equity de arriba sí es real, día por día, desde que arrancó.
            </p>
          ) : (
            <>
              <h3 style={{ fontSize: "0.95rem", margin: "24px 0 8px" }}>
                Posiciones abiertas en {bucket.etiqueta} ({bucket.posicionesAbiertas.length})
              </h3>
              <TablaAbiertasBucket posiciones={bucket.posicionesAbiertas} />
            </>
          )}
        </div>
      )}

      <div className="pulsodash-panel" style={{ marginTop: 24 }}>
        <div className="pulsodash-panel-head">
          <span className="pulsodash-panel-title">Comparación entre buckets</span>
        </div>
        <div className="prose" style={{ overflowX: "auto", marginTop: 12 }}>
          <table>
            <thead>
              <tr>
                <th>Bucket</th>
                <th>Equity</th>
                <th>Retorno</th>
                <th>Drawdown</th>
                <th>Abiertas</th>
                <th>Cerradas</th>
                <th>Win rate</th>
              </tr>
            </thead>
            <tbody>
              {(data.bucketsConBlend || data.buckets).map((b) => (
                <tr key={b.key} style={b.esInformativo ? { opacity: 0.85 } : undefined}>
                  <td>{b.etiqueta}</td>
                  <td>${b.equityActual}</td>
                  <td style={{ color: toneColor(tonoDe(b.retornoAcumuladoPct)) }}>{pct(b.retornoAcumuladoPct)}</td>
                  <td>{pct(b.drawdownPct, { signo: false })}{b.drawdownInconsistente ? " ⚠" : ""}</td>
                  <td>{b.posicionesAbiertas.length}</td>
                  <td>{b.esInformativo ? "—" : b.totalCerradas}</td>
                  <td>{!b.esInformativo && b.totalCerradas >= 5 && b.winRatePct !== null ? `${b.winRatePct}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.blend && (
          <p className="pulsodash-vacio" style={{ marginTop: 8 }}>
            "{data.blend.etiqueta}" no es un bucket de trading (no abre ni cierra posiciones) —
            es el cash ocioso de los buckets de arriba, invertido en 50% SPY / 50% GLD en vez de
            quedarse parado. Su equity ya está incluido dentro del de cada bucket real, así que no
            se suma al total del portafolio arriba — solo se muestra para ver su desempeño por
            separado.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Operaciones: historial unificado abiertas + cerradas ---------- */

function ModuloOperaciones({ data }) {
  const [filtroBucket, setFiltroBucket] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todas");

  const filas = useMemo(() => {
    return data.historialOperaciones.filter((p) => {
      if (filtroBucket !== "todos" && p.bucketEtiqueta !== filtroBucket) return false;
      if (filtroEstado !== "todas" && p.estado !== filtroEstado) return false;
      return true;
    });
  }, [data.historialOperaciones, filtroBucket, filtroEstado]);

  if (!data.historialOperaciones.length) {
    return <p className="pulsodash-vacio">Todavía no hay movimientos registrados.</p>;
  }

  return (
    <div>
      <div className="trading-export-row">
        <a href="/api/trading/exportar" className="trading-export-btn" download>
          ⬇ Descargar historial completo (Excel)
        </a>
        <span className="pulsodash-vacio" style={{ marginTop: 0 }}>
          Incluye historial diario por bucket, todas las operaciones cerradas y las posiciones
          abiertas de hoy — cifras en USD, la moneda nativa del motor.
        </span>
      </div>

      <div className="trading-tabs" style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <button type="button" className={`trading-tab${filtroEstado === "todas" ? " activo" : ""}`} onClick={() => setFiltroEstado("todas")}>
          Todas ({data.historialOperaciones.length})
        </button>
        <button type="button" className={`trading-tab${filtroEstado === "abierta" ? " activo" : ""}`} onClick={() => setFiltroEstado("abierta")}>
          Abiertas ({data.historialOperaciones.filter((p) => p.estado === "abierta").length})
        </button>
        <button type="button" className={`trading-tab${filtroEstado === "cerrada" ? " activo" : ""}`} onClick={() => setFiltroEstado("cerrada")}>
          Cerradas ({data.historialOperaciones.filter((p) => p.estado === "cerrada").length})
        </button>
      </div>

      <div className="trading-tabs" style={{ marginBottom: 24, flexWrap: "wrap" }}>
        <button type="button" className={`trading-tab${filtroBucket === "todos" ? " activo" : ""}`} onClick={() => setFiltroBucket("todos")}>
          Todos los buckets
        </button>
        {data.buckets.map((b) => (
          <button
            key={b.key}
            type="button"
            className={`trading-tab${filtroBucket === b.etiqueta ? " activo" : ""}`}
            onClick={() => setFiltroBucket(b.etiqueta)}
          >
            {b.etiqueta}
          </button>
        ))}
      </div>

      <div className="pulsodash-panel">
        <div className="prose" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Estado</th>
                <th>Símbolo</th>
                <th>Tipo</th>
                <th>Bucket</th>
                <th>Entrada</th>
                <th>Precio entrada</th>
                <th>Stop inicial</th>
                <th>Salida</th>
                <th>Precio salida</th>
                <th>Precio cierre hoy</th>
                <th>Trailing stop actual</th>
                <th>P&amp;L</th>
                <th>Rendimiento</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((p, i) => (
                <tr key={`${p.symbol}-${p.entry_date}-${p.estado}-${i}`}>
                  <td>
                    <span className={`trading-badge ${p.estado === "abierta" ? "trading-badge-abierta" : "trading-badge-cerrada"}`}>
                      {p.estado === "abierta" ? "Abierta" : "Cerrada"}
                    </span>
                  </td>
                  <td><LinkSimbolo symbol={p.symbol} /></td>
                  <td>{p.asset_type ?? "—"}</td>
                  <td>{p.bucketEtiqueta}</td>
                  <td>{p.entry_date}</td>
                  <td>{p.entry_price != null ? `$${p.entry_price}` : "—"}</td>
                  <td>{p.initial_stop_price != null ? `$${p.initial_stop_price}` : "—"}</td>
                  <td>{p.estado === "cerrada" ? p.exit_date || "—" : "—"}</td>
                  <td>{p.estado === "cerrada" && p.exit_price != null ? `$${p.exit_price}` : "—"}</td>
                  <td>{p.estado === "abierta" && p.current_price != null ? `$${p.current_price}` : "—"}</td>
                  <td>{p.stop_price != null ? `$${p.stop_price}` : "—"}</td>
                  <td style={{ color: toneColor(tonoDe(p.estado === "cerrada" ? p.pnl : p.unrealized_pnl)) }}>
                    {p.estado === "cerrada"
                      ? `$${p.pnl}`
                      : p.unrealized_pnl != null
                        ? `$${p.unrealized_pnl}`
                        : "— (precio en vivo pendiente)"}
                  </td>
                  <td style={{ color: toneColor(tonoDe(p.estado === "cerrada" ? p.pnl_pct : p.unrealized_pnl_pct)) }}>
                    {p.estado === "cerrada"
                      ? `${p.pnl_pct}%`
                      : p.unrealized_pnl_pct != null
                        ? `${p.unrealized_pnl_pct}%`
                        : "—"}
                  </td>
                  <td>{p.estado === "cerrada" ? (p.reason === "stop_hit" ? "Stop" : "Señal") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="pulsodash-vacio" style={{ marginTop: 16 }}>
        El historial conserva todas las operaciones, abiertas y cerradas, ganadoras y perdedoras —
        nunca se ocultan las pérdidas ni se recalculan resultados ya cerrados. El P&amp;L de las
        posiciones abiertas es no realizado (marcado al precio del último cierre procesado, no en
        tiempo real intradía) — se confirma solo cuando la posición cierra.
      </p>

      {data.blendMovimientos?.length > 0 && (
        <div className="pulsodash-panel" style={{ marginTop: 32 }}>
          <div className="pulsodash-panel-head">
            <span className="pulsodash-panel-title">Cash ocioso (blend SPY/GLD) — compras y ventas</span>
          </div>
          <p className="pulsodash-vacio" style={{ marginTop: 8 }}>
            Cada vez que un bucket abre una posición, vende blend para financiarla; cuando la
            cierra, compra blend con el producto. &quot;Registrado&quot; viene del libro de
            movimientos del motor (existe desde el 6-nov-2026); &quot;reconstruido&quot; se deriva
            de la entrada/salida de la posición correspondiente, con su mismo monto, para
            completar lo anterior. No incluye la inversión inicial del capital.
          </p>
          <div className="prose" style={{ overflowX: "auto", marginTop: 12 }}>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Bucket</th>
                  <th>Movimiento</th>
                  <th>Monto</th>
                  <th>Motivo</th>
                  <th>Origen</th>
                </tr>
              </thead>
              <tbody>
                {data.blendMovimientos.map((m, i) => (
                  <tr key={`${m.fecha}-${m.bucket}-${m.motivo}-${i}`}>
                    <td>{m.fecha}</td>
                    <td>{m.bucket}</td>
                    <td>{m.tipo === "compra" ? "Compra de blend" : "Venta de blend"}</td>
                    <td>${m.monto}</td>
                    <td>{m.motivo}</td>
                    <td>{m.origen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Shell ---------- */

function TabsNav({ tab, setTab }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "portafolios", label: "Portafolios" },
    { id: "operaciones", label: "Operaciones" },
  ];
  return (
    <nav className="trading-tabs trading-tabs-principal">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`trading-tab${tab === t.id ? " activo" : ""}`}
          onClick={() => setTab(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}

const RAZON_CIERRE_LABEL = {
  stop_hit: "tocó el stop",
  signal_exit: "señal de salida de la estrategia",
};

const RAZON_DESCARTE_LABEL = {
  cross_sectional_filter: "no pasó el filtro de fuerza relativa",
  stop_invalido: "dato de stop inconsistente ese día",
  capital_insuficiente: "señal real, pero el capital no alcanza para 1 acción con el riesgo máximo permitido",
  efectivo_insuficiente: "señal real, pero no había efectivo disponible para financiar la compra",
  simbolo_reservado_blend: "SPY/GLD están reservados para el cash ocioso: el motor IBKR no los compra como estrategia",
  mercado_cerrado: "la corrida fue fuera del horario de mercado: las entradas nuevas no se mandan",
  entradas_bloqueadas_riesgo: "entradas bloqueadas por un control de riesgo (límite diario o suspensión)",
};

/* "¿Qué decidió hoy el motor?" — lo primero que se ve al abrir un motor.
   Solo usa lo que el motor realmente exporta: compras (posiciones con
   fecha de entrada de hoy), ventas (cierres del día) y lo que mantiene.
   NO muestra "confianza" ni "score": el motor no los calcula y esta
   capa no los inventa. Los candidatos con señal que no entraron solo
   existen en el motor paper y desde el 10-nov-2026. */
function DecisionHoy({ data }) {
  const filas = [];
  let mantiene = 0;
  let descartadosTotal = null;
  let ordenesFallidas = 0;
  let breakers = 0;
  let fecha = null;

  data.buckets.forEach((b) => {
    const d = b.decisionHoy;
    if (!d) return;
    fecha = fecha && fecha > d.fecha ? fecha : d.fecha;
    mantiene += d.mantiene;
    ordenesFallidas += (d.ordenesFallidas || []).length;
    if (d.circuitBreaker) breakers += 1;
    if (Array.isArray(d.descartados)) descartadosTotal = (descartadosTotal || 0) + d.descartados.length;
    d.compras.forEach((p) =>
      filas.push({ tipo: "COMPRAR", bucket: b.etiqueta, symbol: p.symbol, estrategia: p.strategy, precio: p.entry_price, detalle: `${p.shares} acc. · stop ${p.stop_price}` })
    );
    d.ventas.forEach((p) =>
      filas.push({ tipo: "VENDER", bucket: b.etiqueta, symbol: p.symbol, estrategia: p.strategy, precio: p.exit_price, detalle: `${pct(p.pnl_pct)} · ${RAZON_CIERRE_LABEL[p.reason] || p.reason}` })
    );
    (d.descartados || []).forEach((c) =>
      filas.push({ tipo: "SIN ENTRADA", bucket: b.etiqueta, symbol: c.symbol, estrategia: c.strategy, precio: null, detalle: RAZON_DESCARTE_LABEL[c.reason] || c.reason })
    );
  });

  if (!fecha) return null;
  const compras = filas.filter((f) => f.tipo === "COMPRAR").length;
  const ventas = filas.filter((f) => f.tipo === "VENDER").length;
  const icono = { COMPRAR: "🟢", VENDER: "🔴", "SIN ENTRADA": "⚪" };

  return (
    <div className="motor-decision">
      <div className="motor-decision-head">
        <span className="motor-decision-kicker">Decisión del motor · {formatSoloFecha(fecha)}</span>
        <div className="motor-decision-conteo">
          <span>🟢 COMPRAR <strong>{compras}</strong></span>
          <span>🔴 VENDER <strong>{ventas}</strong></span>
          <span>🟡 MANTENER <strong>{mantiene}</strong></span>
          {descartadosTotal !== null ? (
            <span>⚪ SEÑAL SIN ENTRADA <strong>{descartadosTotal}</strong></span>
          ) : (
            <span title="Este motor empezó a registrar las señales sin entrada después de esta corrida.">⚪ SEÑAL SIN ENTRADA <strong>aún no registrado</strong></span>
          )}
        </div>
      </div>
      {filas.length === 0 ? (
        <p className="motor-decision-vacio">
          El motor corrió y no encontró señal de entrada ni de salida: sin movimientos. Mantiene {mantiene} posiciones abiertas.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="motor-decision-tabla">
            <thead>
              <tr><th>Acción</th><th>Símbolo</th><th>Portafolio</th><th>Estrategia</th><th>Precio</th><th>Detalle</th></tr>
            </thead>
            <tbody>
              {filas.map((f, i) => (
                <tr key={`${f.tipo}-${f.symbol}-${i}`}>
                  <td><strong>{icono[f.tipo]} {f.tipo}</strong></td>
                  <td><LinkSimbolo symbol={f.symbol} /></td>
                  <td>{f.bucket}</td>
                  <td>{f.estrategia || "—"}</td>
                  <td>{f.precio != null ? `$${f.precio}` : "—"}</td>
                  <td>{f.detalle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="motor-decision-riesgo">
        <span>{breakers > 0 ? "🔴" : "🟢"} Límite de pérdida diaria: {breakers > 0 ? `activado en ${breakers} portafolio(s)` : "sin activar"}</span>
        <span>{data.resumen.algunBucketSuspendido ? "🔴 Hay portafolios suspendidos" : "🟢 Sin portafolios suspendidos"}</span>
        {data.fuente === "ibkr" && (
          <span>{ordenesFallidas > 0 ? `🔴 ${ordenesFallidas} orden(es) fallida(s)` : "🟢 Sin órdenes fallidas"}</span>
        )}
      </div>
    </div>
  );
}

function PanelMotor({ data, nota }) {
  const [tab, setTab] = useState("dashboard");
  return (
    <div className="motor-panel">
      {nota && <p className="motor-nota">{nota}</p>}
      <DecisionHoy data={data} />
      <TabsNav tab={tab} setTab={setTab} />
      <div style={{ marginTop: 24 }}>
        {tab === "dashboard" && <ModuloDashboard data={data} />}
        {tab === "portafolios" && <ModuloPortafolios data={data} />}
        {tab === "operaciones" && <ModuloOperaciones data={data} />}
      </div>
    </div>
  );
}

const MOTORES = [
  {
    id: "paper",
    titulo: "Motor Paper",
    sub: "Simulación diaria sobre precios de cierre",
    nota: "Motor simulado: no coloca órdenes. Es el experimento original, con todo el historial.",
  },
  {
    id: "ibkr",
    titulo: "Motor IBKR",
    sub: "Órdenes reales en una cuenta paper de Interactive Brokers",
    nota:
      "Mismas estrategias, pero ejecutadas con órdenes reales en una cuenta paper (simulada) de Interactive Brokers: " +
      "los precios de llenado, el efectivo y las posiciones pueden diferir del motor paper. Empezó el 4-nov-2026, " +
      "así que el historial todavía es muy corto.",
  },
];

export default function TradingPublicoExplorer({ data, dataIbkr }) {
  const [motor, setMotor] = useState("paper");
  const datos = { paper: data, ibkr: dataIbkr };

  return (
    <div>
      <div className="motor-switch" role="tablist" aria-label="Motor de trading">
        {MOTORES.map((m) => {
          const d = datos[m.id];
          const activo = motor === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={activo}
              className={`motor-boton${activo ? " activo" : ""}`}
              onClick={() => setMotor(activo ? null : m.id)}
            >
              <span className="motor-boton-titulo">{m.titulo}</span>
              <span className="motor-boton-sub">{m.sub}</span>
              {d && (
                <span className="motor-boton-cifras">
                  <strong>${d.resumen.equityActualTotal}</strong>
                  <span className={`motor-boton-ret ${tonoDe(d.resumen.retornoTotalPct)}`}>{pct(d.resumen.retornoTotalPct)}</span>
                </span>
              )}
              <span className="motor-boton-flecha">{activo ? "▲ Ocultar" : "▼ Ver dashboard"}</span>
            </button>
          );
        })}
      </div>
      {motor && datos[motor] && (
        <PanelMotor key={motor} data={datos[motor]} nota={MOTORES.find((m) => m.id === motor).nota} />
      )}
    </div>
  );
}
