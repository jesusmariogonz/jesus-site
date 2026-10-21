/* ============================================================
   Gráfica reutilizable del "Analizador de Pareto" — un solo componente
   que renderiza el diagrama de Pareto para CUALQUIER resultado que
   produzca analizador_pareto.py (no está atado a un dataset en
   particular), igual que la herramienta real es genérica.
   ============================================================ */

const WIDTH = 720;
const HEIGHT = 380;
const PAD = { top: 50, right: 24, bottom: 92, left: 56 };

function escala(dominio, rango) {
  const [d0, d1] = dominio;
  const [r0, r1] = rango;
  return (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

export default function ParetoAnalizadorChart({ resultado }) {
  const { categorias, valores, pct, acumulado, n_categorias_corte, umbral_pct, etiqueta_valor } = resultado;
  const n = categorias.length;

  const xMin = 0;
  const xMax = n - 1;
  const yMin = 0;
  const yMax = Math.max(...valores) * 1.15;

  const x = escala([xMin, xMax], [PAD.left, WIDTH - PAD.right]);
  const y = escala([yMin, yMax], [HEIGHT - PAD.bottom, PAD.top]);
  const yAcum = escala([0, 108], [HEIGHT - PAD.bottom, PAD.top]);

  const anchoBarra = ((WIDTH - PAD.left - PAD.right) / n) * 0.62;
  const paso = (WIDTH - PAD.left - PAD.right) / n;

  const pathAcumulado = acumulado
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${yAcum(v).toFixed(1)}`)
    .join(" ");

  const yUmbral = yAcum(umbral_pct);
  const xCorte0 = PAD.left;
  const xCorte1 = x(n_categorias_corte - 1) + paso / 2;

  const ticksY = [0, 0.25, 0.5, 0.75, 1].map((f) => yMin + f * (yMax - yMin));

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="pc-svg"
      role="img"
      aria-label={`Diagrama de Pareto: ${resultado.titulo}. Las primeras ${n_categorias_corte} categorías concentran ${resultado.pct_valor_cubierto_en_corte}% del total.`}
    >
      {/* Zona de "pocos vitales" */}
      <rect x={xCorte0} y={PAD.top} width={xCorte1 - xCorte0} height={HEIGHT - PAD.top - PAD.bottom} fill="var(--accent)" opacity="0.07" />
      <text x={(xCorte0 + xCorte1) / 2} y={18} textAnchor="middle" fontSize="10.5" fill="var(--accent)" fontWeight="700">
        Pocos vitales ({n_categorias_corte} de {n} = {resultado.pct_valor_cubierto_en_corte}%)
      </text>

      {ticksY.map((v, i) => (
        <g key={i}>
          <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth="1" opacity={i === 0 ? 1 : 0.5} />
          <text x={PAD.left - 8} y={y(v) + 4} textAnchor="end" fontSize="9.5" fill="var(--meta)">
            {Math.round(v).toLocaleString("es-MX")}
          </text>
        </g>
      ))}
      <text x={14} y={34} fontSize="10" fill="var(--ink-soft)">
        {etiqueta_valor}
      </text>

      {/* Barras */}
      {categorias.map((cat, i) => (
        <rect
          key={cat}
          x={x(i) - anchoBarra / 2}
          y={y(valores[i])}
          width={anchoBarra}
          height={HEIGHT - PAD.bottom - y(valores[i])}
          fill="var(--accent)"
          opacity={i < n_categorias_corte ? 1 : 0.55}
        >
          <title>
            {cat}: {valores[i].toLocaleString("es-MX")} {etiqueta_valor} ({pct[i]}%)
          </title>
        </rect>
      ))}

      {/* Línea de % acumulado */}
      <path d={pathAcumulado} fill="none" stroke="#eb6834" strokeWidth="2.2" />
      {acumulado.map((v, i) => (
        <circle key={i} cx={x(i)} cy={yAcum(v)} r="3" fill="#eb6834" />
      ))}
      <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yUmbral} y2={yUmbral} stroke="var(--ink-soft)" strokeDasharray="4 3" strokeWidth="1" />
      <text x={WIDTH - PAD.right} y={yUmbral - 6} textAnchor="end" fontSize="9.5" fill="var(--ink-soft)">
        {umbral_pct}%
      </text>

      {/* Etiquetas de categoría, rotadas para caber */}
      {categorias.map((cat, i) => (
        <text
          key={cat}
          x={x(i)}
          y={HEIGHT - PAD.bottom + 14}
          fontSize="8.5"
          fill="var(--meta)"
          textAnchor="end"
          transform={`rotate(-38 ${x(i)} ${HEIGHT - PAD.bottom + 14})`}
        >
          {cat.length > 26 ? `${cat.slice(0, 24)}…` : cat}
        </text>
      ))}
    </svg>
  );
}
