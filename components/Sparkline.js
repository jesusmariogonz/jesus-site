/* SVG puro, sin librerías — mismo patrón que usa el screener de Alfia. */
export default function Sparkline({ values, width = 140, height = 36, up }) {
  if (!values || values.length < 2) return <span className="sparkline-vacio">—</span>;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const subiendo = up ?? values[values.length - 1] >= values[0];

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="sparkline-svg">
      <polyline
        points={points}
        fill="none"
        stroke={subiendo ? "#1fa45c" : "#d64545"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
