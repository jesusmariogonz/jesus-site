/* ============================================================
   Diagrama de arquitectura (SVG estático) de cómo se integraría el
   Analizador de Pareto en un flujo real de operación continua — no es
   la arquitectura de ningún cliente real, es el diseño de referencia
   de este proyecto propio.
   ============================================================ */

const CAJAS = [
  { id: "fuente", x: 20, y: 70, w: 148, h: 68, titulo: "Fuente de datos", sub: "ERP, ticket de calidad, POS", color: "#5fa8ff" },
  { id: "export", x: 208, y: 70, w: 148, h: 68, titulo: "Exportación periódica", sub: "CSV: categoria, valor", color: "#22c39a" },
  { id: "analizador", x: 396, y: 70, w: 148, h: 68, titulo: "Analizador de Pareto", sub: "clasifica, ordena, acumula, corta", color: "#eb6834" },
  { id: "salida", x: 584, y: 70, w: 148, h: 68, titulo: "Gráfica + JSON", sub: "diagrama y corte de pocos vitales", color: "#eb6834" },
  { id: "decision", x: 772, y: 70, w: 148, h: 68, titulo: "Decisión de prioridad", sub: "dueño del proceso revisa y actúa", color: "#a78bfa" },
];

const FLECHAS = [
  { de: "fuente", a: "export", dato: "registros crudos" },
  { de: "export", a: "analizador", dato: "CSV categoria,valor" },
  { de: "analizador", a: "salida", dato: "tabla ordenada + % acumulado" },
  { de: "salida", a: "decision", dato: "pocas causas, mucho impacto" },
];

function bordeDerecho(c) {
  return { x: c.x + c.w, y: c.y + c.h / 2 };
}
function bordeIzquierdo(c) {
  return { x: c.x, y: c.y + c.h / 2 };
}

export default function ParetoAnalizadorArquitectura() {
  const porId = Object.fromEntries(CAJAS.map((c) => [c.id, c]));

  return (
    <svg
      viewBox="0 0 950 230"
      className="pc-svg pc-arquitectura"
      role="img"
      aria-label="Arquitectura de referencia: fuente de datos, exportación periódica a CSV, analizador de Pareto, salida de gráfica y JSON, y decisión de prioridad del dueño del proceso, con reentrenamiento del umbral al reentrenar sobre nuevos datos"
    >
      <defs>
        <marker id="flecha-ap" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--ink-soft)" />
        </marker>
        <marker id="flecha-ap-loop" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#eb6834" />
        </marker>
      </defs>

      {FLECHAS.map(({ de, a, dato }, i) => {
        const c1 = porId[de];
        const c2 = porId[a];
        const p1 = bordeDerecho(c1);
        const p2 = bordeIzquierdo(c2);
        const mx = (p1.x + p2.x) / 2;
        return (
          <g key={i}>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--ink-soft)" strokeWidth="1.5" markerEnd="url(#flecha-ap)" />
            <text x={mx} y={p1.y - 9} textAnchor="middle" fontSize="8.3" fill="var(--meta)">
              {dato}
            </text>
          </g>
        );
      })}

      {/* Retroalimentación: la decisión de prioridad cambia el proceso de
          origen, lo que altera la próxima exportación de datos — el
          análisis se vuelve a correr periódicamente, nunca una sola vez. */}
      <path
        d={`M ${porId.decision.x + porId.decision.w / 2} ${porId.decision.y + porId.decision.h} C 846 190, 94 190, ${porId.fuente.x + porId.fuente.w / 2} ${porId.fuente.y + porId.fuente.h}`}
        fill="none"
        stroke="#eb6834"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        markerEnd="url(#flecha-ap-loop)"
      />
      <text x={470} y={207} textAnchor="middle" fontSize="9" fill="#eb6834">
        se vuelve a correr periódicamente — el corte de "pocos vitales" puede cambiar con datos nuevos
      </text>

      {CAJAS.map((c) => (
        <g key={c.id}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="10" fill="var(--surface)" stroke={c.color} strokeWidth="1.4" />
          <rect x={c.x} y={c.y} width="4" height={c.h} rx="2" fill={c.color} />
          <text x={c.x + c.w / 2 + 2} y={c.y + 27} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ink)">
            {c.titulo}
          </text>
          <text x={c.x + c.w / 2 + 2} y={c.y + 44} textAnchor="middle" fontSize="8.3" fill="var(--meta)">
            {c.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}
