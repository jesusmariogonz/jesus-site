// Estudio DESCRIPTIVO del medidor de riesgo: puntaje en episodios conocidos y retornos posteriores de SPY por nivel.
// Uso: node scripts/risk-meter-backtest.mjs   (descarga precios de Yahoo Finance; no usa llaves)
import { descargar, SIMBOLOS, calcularSerie, nivelDe, NIVELES } from "../lib/risk/riskMeter.js";
const series = {};
await Promise.all(Object.entries(SIMBOLOS).map(async ([k, s]) => { series[k] = await descargar(s); }));
const { filas, fechas } = calcularSerie(series);
const validas = filas.map((f, i) => ({ ...f, i })).filter((f) => f.score != null);
console.log("sesiones con score:", validas.length, "desde", validas[0].fecha, "hasta", validas.at(-1).fecha);

const ver = ["2020-03-16","2020-03-23","2020-06-11","2021-06-30","2022-06-16","2022-10-12","2023-03-13","2023-07-31","2024-08-05","2025-04-08","2026-11-17"];
for (const d of ver) { const f = filas.find((x) => x.fecha === d); if (f) console.log(d, f.score == null ? "—" : f.score.toFixed(0)); }

// distribución por nivel
const cnt = [0,0,0,0,0];
validas.forEach((f) => cnt[nivelDe(f.score)]++);
console.log("distribución por nivel:", NIVELES.map((n, k) => `${n.nombre} ${(100*cnt[k]/validas.length).toFixed(0)}%`).join(" | "));

// retornos posteriores de SPY por nivel (precio ajustado)
const spy = filas.map((f) => series.spy.get(f.fecha));
const H = [1, 5, 10, 20];
const acum = NIVELES.map(() => Object.fromEntries(H.map((h) => [h, []])));
const ddFwd = NIVELES.map(() => []);
for (const f of validas) {
  const k = nivelDe(f.score);
  for (const h of H) {
    if (f.i + h < spy.length && spy[f.i] && spy[f.i + h]) acum[k][h].push(spy[f.i + h] / spy[f.i] - 1);
  }
  if (f.i + 20 < spy.length) { let mn = 0; for (let j = 1; j <= 20; j++) mn = Math.min(mn, spy[f.i + j] / spy[f.i] - 1); ddFwd[k].push(mn); }
}
const m = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const med = (a) => { const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };
const pct = (x) => (x * 100).toFixed(2) + "%";
console.log("\nnivel | n | ret 1d | ret 5d | ret 10d | ret 20d (media / mediana) | peor caída 20d (media)");
NIVELES.forEach((n, k) => {
  const a = acum[k];
  console.log(`${n.nombre.padEnd(9)}| ${a[1].length} | ${pct(m(a[1]))} | ${pct(m(a[5]))} | ${pct(m(a[10]))} | ${pct(m(a[20]))} / ${pct(med(a[20]))} | ${pct(m(ddFwd[k]))}`);
});
