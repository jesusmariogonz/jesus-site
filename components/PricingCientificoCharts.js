/* ============================================================
   Gráficas del proyecto propio "Pricing Científico" — SVG estático,
   sin librerías, igual que el resto del sitio. Los datos vienen de
   lib/pricingCientifico.js (resultados reales de los scripts de Python
   en proyectos-propios/pricing-cientifico/).
   ============================================================ */

const WIDTH = 720;
const HEIGHT = 340;
const PAD = { top: 16, right: 24, bottom: 40, left: 56 };

function escala(dominio, rango) {
  const [d0, d1] = dominio;
  const [r0, r1] = rango;
  return (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

export function GraficaDemanda({ muestraScatter, meta, modelo }) {
  const precios = muestraScatter.map((r) => r.precio);
  const cantidades = muestraScatter.map((r) => r.cantidad);
  const xMin = Math.min(...precios) * 0.97;
  const xMax = Math.max(...precios) * 1.03;
  const yMin = 0;
  const yMax = Math.max(...cantidades) * 1.08;

  const x = escala([xMin, xMax], [PAD.left, WIDTH - PAD.right]);
  const y = escala([yMin, yMax], [HEIGHT - PAD.bottom, PAD.top]);

  // Curva ajustada: cantidad_base * (precio/precio_base)^elasticidad_estimada
  const nPuntosCurva = 60;
  const curva = Array.from({ length: nPuntosCurva }, (_, i) => {
    const precio = xMin + (i / (nPuntosCurva - 1)) * (xMax - xMin);
    const cantidad =
      meta.cantidad_promedio_semanal * (precio / meta.precio_base_mxn) ** modelo.elasticidad_estimada;
    return [precio, cantidad];
  });
  const pathCurva = curva.map(([p, q], i) => `${i === 0 ? "M" : "L"}${x(p).toFixed(1)},${y(q).toFixed(1)}`).join(" ");

  const ticksY = [0, 0.25, 0.5, 0.75, 1].map((f) => yMin + f * (yMax - yMin));
  const ticksX = [xMin, (xMin + xMax) / 2, xMax];

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="pc-svg" role="img" aria-label="Precio vs. cantidad vendida, con la curva de demanda ajustada">
      {ticksY.map((v, i) => (
        <g key={i}>
          <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth="1" opacity={i === 0 ? 1 : 0.5} />
          <text x={PAD.left - 8} y={y(v) + 4} textAnchor="end" fontSize="10" fill="var(--meta)">
            {Math.round(v)}
          </text>
        </g>
      ))}
      {ticksX.map((v, i) => (
        <text key={i} x={x(v)} y={HEIGHT - PAD.bottom + 20} textAnchor="middle" fontSize="10" fill="var(--meta)">
          ${v.toFixed(1)}
        </text>
      ))}
      <text x={WIDTH / 2} y={HEIGHT - 4} textAnchor="middle" fontSize="10.5" fill="var(--ink-soft)">
        Precio (MXN)
      </text>
      <text x={14} y={PAD.top - 2} fontSize="10.5" fill="var(--ink-soft)">
        Unidades/semana
      </text>

      {muestraScatter.map((r, i) => (
        <circle key={i} cx={x(r.precio)} cy={y(r.cantidad)} r="2.6" fill="var(--accent)" opacity="0.35">
          <title>
            ${r.precio.toFixed(2)} · {r.cantidad} unidades {r.promo ? "(semana con promoción)" : ""}
          </title>
        </circle>
      ))}
      <path d={pathCurva} fill="none" stroke="#eb6834" strokeWidth="2.5" />
    </svg>
  );
}

export function GraficaUtilidad({ curvaUtilidad, meta, optimizacion }) {
  const precios = curvaUtilidad.map((r) => r.precio);
  const xMin = Math.min(...precios);
  const xMax = Math.max(...precios);
  const yMin = 0;
  const yMax = Math.max(...curvaUtilidad.map((r) => r.utilidad_esperada)) * 1.08;

  const x = escala([xMin, xMax], [PAD.left, WIDTH - PAD.right]);
  const y = escala([yMin, yMax], [HEIGHT - PAD.bottom, PAD.top]);

  const pathUtilidad = curvaUtilidad
    .map((r, i) => `${i === 0 ? "M" : "L"}${x(r.precio).toFixed(1)},${y(r.utilidad_esperada).toFixed(1)}`)
    .join(" ");

  const xOptimo = x(optimizacion.precio_optimo_grid_search_mxn);
  const yOptimo = y(optimizacion.utilidad_semanal_en_precio_optimo_mxn);
  const xObservadoMin = x(meta.precio_min_observado);
  const xObservadoMax = x(meta.precio_max_observado);

  const ticksY = [0, 0.25, 0.5, 0.75, 1].map((f) => yMin + f * (yMax - yMin));

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="pc-svg" role="img" aria-label="Utilidad esperada según el precio, con el rango de precios observado y el precio óptimo">
      {ticksY.map((v, i) => (
        <g key={i}>
          <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth="1" opacity={i === 0 ? 1 : 0.5} />
          <text x={PAD.left - 8} y={y(v) + 4} textAnchor="end" fontSize="10" fill="var(--meta)">
            ${Math.round(v)}
          </text>
        </g>
      ))}

      {/* Zona de precios realmente observados en los datos — fuera de esta
          franja, la curva es extrapolación del modelo, no evidencia directa. */}
      <rect x={xObservadoMin} y={PAD.top} width={xObservadoMax - xObservadoMin} height={HEIGHT - PAD.top - PAD.bottom} fill="var(--accent)" opacity="0.07" />
      <text x={(xObservadoMin + xObservadoMax) / 2} y={PAD.top + 14} textAnchor="middle" fontSize="9.5" fill="var(--accent)">
        rango observado
      </text>

      <path d={pathUtilidad} fill="none" stroke="var(--accent)" strokeWidth="2.5" />

      <line x1={xOptimo} x2={xOptimo} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke="#eb6834" strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx={xOptimo} cy={yOptimo} r="5" fill="#eb6834" />
      <text x={xOptimo} y={HEIGHT - PAD.bottom + 20} textAnchor="middle" fontSize="10" fill="#eb6834" fontWeight="700">
        ${optimizacion.precio_optimo_grid_search_mxn}
      </text>

      <text x={WIDTH / 2} y={HEIGHT - 4} textAnchor="middle" fontSize="10.5" fill="var(--ink-soft)">
        Precio (MXN)
      </text>
      <text x={14} y={PAD.top - 2} fontSize="10.5" fill="var(--ink-soft)">
        Utilidad esperada/semana (MXN)
      </text>
    </svg>
  );
}
