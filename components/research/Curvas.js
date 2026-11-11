/* Gráficas SVG del reporte técnico (server component, sin dependencias).
   Los datos son las curvas semanales calculadas por el apéndice del experimento. */

const W = 900;
const H = 340;
const M = { l: 56, r: 16, t: 14, b: 30 };

export const COLORES = {
  model: "#2563eb",
  buy_hold: "#6b7280",
  sma200: "#16a34a",
  sixty_forty: "#d97706",
};

export const NOMBRES = {
  model: "Modelo de emergencia (walk-forward)",
  buy_hold: "Comprar y mantener SPY",
  sma200: "Regla SMA200",
  sixty_forty: "60/40",
};

function escalaX(fechas) {
  const t0 = new Date(fechas[0]).getTime();
  const t1 = new Date(fechas[fechas.length - 1]).getTime();
  return (f) => M.l + ((new Date(f).getTime() - t0) / (t1 - t0)) * (W - M.l - M.r);
}

function ejeAnios(fechas, x) {
  const y0 = Number(fechas[0].slice(0, 4));
  const y1 = Number(fechas[fechas.length - 1].slice(0, 4));
  const marcas = [];
  for (let y = Math.ceil(y0 / 4) * 4; y <= y1; y += 4) marcas.push(y);
  return marcas.map((y) => (
    <g key={y}>
      <line x1={x(`${y}-01-01`)} x2={x(`${y}-01-01`)} y1={M.t} y2={H - M.b} stroke="var(--line)" strokeWidth="1" />
      <text x={x(`${y}-01-01`)} y={H - 10} textAnchor="middle" fontSize="11" fill="var(--ink-soft)">{y}</text>
    </g>
  ));
}

function trazo(fechas, valores, x, y) {
  return valores.map((v, i) => `${i === 0 ? "M" : "L"}${x(fechas[i]).toFixed(1)},${y(v).toFixed(1)}`).join("");
}

export function CurvaEquity({ curvas, claves }) {
  const fechas = curvas.model.dates;
  const x = escalaX(fechas);
  const todos = claves.flatMap((k) => curvas[k].equity);
  const lo = Math.log(Math.min(...todos));
  const hi = Math.log(Math.max(...todos));
  const y = (v) => M.t + (1 - (Math.log(v) - lo) / (hi - lo)) * (H - M.t - M.b);
  const ticks = [1, 2, 4, 8, 16, 32].filter((v) => Math.log(v) >= lo - 1e-9 && Math.log(v) <= hi + 1e-9);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="exp-chart" role="img" aria-label="Curvas de capital en escala logarítmica">
      {ticks.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth="1" />
          <text x={M.l - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--ink-soft)">{v}×</text>
        </g>
      ))}
      {ejeAnios(fechas, x)}
      {claves.map((k) => (
        <path key={k} d={trazo(curvas[k].dates, curvas[k].equity, x, y)} fill="none" stroke={COLORES[k]} strokeWidth={k === "model" ? 2.4 : 1.6} />
      ))}
    </svg>
  );
}

export function CurvaUnderwater({ curvas, claves }) {
  const fechas = curvas.model.dates;
  const x = escalaX(fechas);
  const minimo = Math.min(...claves.flatMap((k) => curvas[k].underwater));
  const y = (v) => M.t + (v / minimo) * (H - M.t - M.b);
  const ticks = [0, -0.1, -0.2, -0.3, -0.4, -0.5].filter((v) => v >= minimo - 0.02);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="exp-chart" role="img" aria-label="Caída desde el máximo previo (underwater)">
      {ticks.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth="1" />
          <text x={M.l - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--ink-soft)">{(v * 100).toFixed(0)}%</text>
        </g>
      ))}
      {ejeAnios(fechas, x)}
      {claves.map((k) => (
        <path key={k} d={trazo(curvas[k].dates, curvas[k].underwater, x, y)} fill="none" stroke={COLORES[k]} strokeWidth={k === "model" ? 2.2 : 1.5} />
      ))}
    </svg>
  );
}

export function Leyenda({ claves }) {
  return (
    <div className="exp-leyenda">
      {claves.map((k) => (
        <span key={k}>
          <i style={{ background: COLORES[k] }} /> {NOMBRES[k]}
        </span>
      ))}
    </div>
  );
}

/* SPY (retorno total, escala log) con franjas rojas donde la exposición aplicada del modelo fue < 100 %.
   Intensidad de la franja = 1 − exposición. Debajo, la exposición semanal promedio. */
export function CurvaEventos({ curvas, expo }) {
  const fechas = curvas.buy_hold.dates;
  const x = escalaX(fechas);
  const eq = curvas.buy_hold.equity;
  const lo = Math.log(Math.min(...eq));
  const hi = Math.log(Math.max(...eq));
  const HP = 250; // alto del panel de precio
  const HE = 70; // alto del panel de exposición
  const yP = (v) => M.t + (1 - (Math.log(v) - lo) / (hi - lo)) * (HP - M.t);
  const yE = (e) => HP + 22 + (1 - e) * HE;
  const ancho = (W - M.l - M.r) / fechas.length + 0.6;
  const ticks = [1, 2, 4, 8, 16].filter((v) => Math.log(v) >= lo - 1e-9 && Math.log(v) <= hi + 1e-9);
  return (
    <svg viewBox={`0 0 ${W} ${HP + HE + 56}`} className="exp-chart" role="img" aria-label="SPY con los períodos en que el modelo estuvo defensivo">
      {ticks.map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={yP(v)} y2={yP(v)} stroke="var(--line)" strokeWidth="1" />
          <text x={M.l - 8} y={yP(v) + 4} textAnchor="end" fontSize="11" fill="var(--ink-soft)">{v}×</text>
        </g>
      ))}
      {fechas.map((f, i) =>
        expo.exposure[i] < 0.999 ? (
          <rect key={f} x={x(f) - ancho / 2} y={M.t} width={ancho} height={HP - M.t} fill="#dc2626" opacity={Math.min(0.75, 0.15 + (1 - expo.exposure[i]) * 0.75)} />
        ) : null
      )}
      <path d={trazo(fechas, eq, x, yP)} fill="none" stroke="var(--ink)" strokeWidth="1.6" />
      <text x={M.l} y={HP + 14} fontSize="11" fill="var(--ink-soft)">Exposición accionaria aplicada del modelo (semanal)</text>
      {[1, 0.5, 0].map((e) => (
        <g key={e}>
          <line x1={M.l} x2={W - M.r} y1={yE(e)} y2={yE(e)} stroke="var(--line)" strokeWidth="1" />
          <text x={M.l - 8} y={yE(e) + 4} textAnchor="end" fontSize="11" fill="var(--ink-soft)">{e * 100}%</text>
        </g>
      ))}
      <path d={trazo(fechas, expo.exposure, x, yE)} fill="none" stroke={COLORES.model} strokeWidth="1.8" />
      {(() => {
        const y0 = Number(fechas[0].slice(0, 4));
        const y1 = Number(fechas[fechas.length - 1].slice(0, 4));
        const marcas = [];
        for (let y = Math.ceil(y0 / 4) * 4; y <= y1; y += 4) marcas.push(y);
        return marcas.map((y) => (
          <text key={y} x={x(`${y}-01-01`)} y={HP + HE + 48} textAnchor="middle" fontSize="11" fill="var(--ink-soft)">{y}</text>
        ));
      })()}
    </svg>
  );
}
