/* ============================================================
   Diagrama de arquitectura (SVG estático) de cómo se vería este
   pipeline corriendo en producción — no es la arquitectura de ningún
   cliente real, es el diseño de referencia de este proyecto propio.
   ============================================================ */

const CAJAS = [
  { id: "pos", x: 20, y: 40, w: 150, h: 64, titulo: "Punto de Venta", sub: "transacciones por tienda" },
  { id: "ingesta", x: 210, y: 40, w: 150, h: 64, titulo: "Ingesta", sub: "batch diario / streaming" },
  { id: "dw", x: 400, y: 40, w: 150, h: 64, titulo: "Data Warehouse", sub: "ventas tienda·SKU·semana" },
  { id: "features", x: 590, y: 40, w: 150, h: 64, titulo: "Feature Engineering", sub: "precio, promo, estación" },
  { id: "modelo", x: 590, y: 160, w: 150, h: 64, titulo: "Modelo de Elasticidad", sub: "Python · statsmodels" },
  { id: "simulador", x: 400, y: 160, w: 150, h: 64, titulo: "Simulador de Precio", sub: "grid search + Índice de Lerner" },
  { id: "dashboard", x: 210, y: 160, w: 150, h: 64, titulo: "Tablero comercial", sub: "precio recomendado + IC" },
  { id: "decision", x: 20, y: 160, w: 150, h: 64, titulo: "Decisión y ejecución", sub: "equipo comercial" },
];

const FLECHAS = [
  ["pos", "ingesta"],
  ["ingesta", "dw"],
  ["dw", "features"],
  ["features", "modelo"],
  ["modelo", "simulador"],
  ["simulador", "dashboard"],
  ["dashboard", "decision"],
];

function centro(caja) {
  return { x: caja.x + caja.w / 2, y: caja.y + caja.h / 2 };
}

function bordeDerecho(caja) {
  return { x: caja.x + caja.w, y: caja.y + caja.h / 2 };
}
function bordeIzquierdo(caja) {
  return { x: caja.x, y: caja.y + caja.h / 2 };
}
function bordeInferior(caja) {
  return { x: caja.x + caja.w / 2, y: caja.y + caja.h };
}
function bordeSuperior(caja) {
  return { x: caja.x + caja.w / 2, y: caja.y };
}

export default function PricingCientificoArquitectura() {
  const porId = Object.fromEntries(CAJAS.map((c) => [c.id, c]));

  return (
    <svg viewBox="0 0 770 260" className="pc-svg pc-arquitectura" role="img" aria-label="Diagrama de arquitectura: punto de venta, ingesta, warehouse, feature engineering, modelo de elasticidad, simulador de precio, tablero comercial y decisión, con retroalimentación hacia el punto de venta">
      <defs>
        <marker id="flecha" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--ink-soft)" />
        </marker>
        <marker id="flecha-loop" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#eb6834" />
        </marker>
      </defs>

      {FLECHAS.map(([desde, hasta], i) => {
        const a = porId[desde];
        const b = porId[hasta];
        const horizontal = a.y === b.y;
        const p1 = horizontal ? bordeDerecho(a) : bordeInferior(a);
        const p2 = horizontal ? bordeIzquierdo(b) : bordeSuperior(b);
        return (
          <line
            key={i}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="var(--ink-soft)"
            strokeWidth="1.5"
            markerEnd="url(#flecha)"
          />
        );
      })}

      {/* Retroalimentación: la ejecución de un nuevo precio genera nuevas
          transacciones reales, que vuelven a entrar al pipeline — el
          modelo se reentrena periódicamente con esos datos nuevos. */}
      <path
        d={`M ${porId.decision.x + 20} ${porId.decision.y} C ${porId.decision.x - 10} 90, ${porId.pos.x - 10} 90, ${porId.pos.x + 20} ${porId.pos.y + porId.pos.h}`}
        fill="none"
        stroke="#eb6834"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        markerEnd="url(#flecha-loop)"
      />
      <text x={-10} y={105} fontSize="9.5" fill="#eb6834" transform="rotate(-90 -10 105)">
        reentrenamiento periódico
      </text>

      {CAJAS.map((c) => (
        <g key={c.id}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="10" fill="var(--surface)" stroke="var(--line)" strokeWidth="1.2" />
          <text x={c.x + c.w / 2} y={c.y + 26} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ink)">
            {c.titulo}
          </text>
          <text x={c.x + c.w / 2} y={c.y + 44} textAnchor="middle" fontSize="9.5" fill="var(--meta)">
            {c.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}
