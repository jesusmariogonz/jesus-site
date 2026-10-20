/* ============================================================
   Diagrama de arquitectura (SVG estático) de cómo se vería este
   pipeline corriendo en producción — no es la arquitectura de ningún
   cliente real, es el diseño de referencia de este proyecto propio.

   Versión 2: agrupado por etapa (fuente / plataforma de datos /
   ciencia de datos / consumo comercial), con el dato que viaja en
   cada flecha etiquetado explícitamente — no solo "A conecta con B",
   sino qué información concreta se transforma en cada paso.
   ============================================================ */

const ETAPAS = [
  { id: "fuente", titulo: "Fuente", x: 10, w: 150, color: "#5fa8ff" },
  { id: "plataforma", titulo: "Plataforma de datos", x: 174, w: 316, color: "#22c39a" },
  { id: "ciencia", titulo: "Ciencia de datos", x: 504, w: 316, color: "#eb6834" },
  { id: "consumo", titulo: "Consumo comercial", x: 834, w: 150, color: "#a78bfa" },
];

const CAJAS = [
  { id: "pos", etapa: "fuente", x: 20, y: 70, w: 130, h: 66, titulo: "Punto de Venta", sub: "transacciones por tienda" },
  { id: "ingesta", etapa: "plataforma", x: 184, y: 70, w: 130, h: 66, titulo: "Ingesta", sub: "batch diario / streaming" },
  { id: "dw", etapa: "plataforma", x: 348, y: 70, w: 130, h: 66, titulo: "Data Warehouse", sub: "tabla tienda · SKU · semana" },
  { id: "features", etapa: "ciencia", x: 514, y: 70, w: 130, h: 66, titulo: "Feature Engineering", sub: "precio, promo, estación" },
  { id: "modelo", etapa: "ciencia", x: 678, y: 70, w: 130, h: 66, titulo: "Modelo de Elasticidad", sub: "statsmodels · OLS clustered" },
  { id: "simulador", etapa: "ciencia", x: 844, y: 70, w: 130, h: 66, titulo: "Simulador de Precio", sub: "grid search + Lerner" },
];

const FILA_2 = [
  { id: "dashboard", x: 678, y: 192, w: 130, h: 66, titulo: "Tablero comercial", sub: "precio recomendado + IC 95%", color: "#a78bfa" },
  { id: "decision", x: 844, y: 192, w: 130, h: 66, titulo: "Decisión y ejecución", sub: "equipo comercial autoriza", color: "#a78bfa" },
];

const FLECHAS = [
  { de: "pos", a: "ingesta", dato: "ventas, precio, promo" },
  { de: "ingesta", a: "dw", dato: "eventos validados" },
  { de: "dw", a: "features", dato: "panel tienda-semana" },
  { de: "features", a: "modelo", dato: "ln(precio), ln(cantidad)" },
  { de: "modelo", a: "simulador", dato: "elasticidad β + IC 95%" },
];

function bordeDerecho(c) {
  return { x: c.x + c.w, y: c.y + c.h / 2 };
}
function bordeIzquierdo(c) {
  return { x: c.x, y: c.y + c.h / 2 };
}
function bordeInferior(c) {
  return { x: c.x + c.w / 2, y: c.y + c.h };
}
function bordeSuperior(c) {
  return { x: c.x + c.w / 2, y: c.y };
}

function Caja({ c, color }) {
  return (
    <g>
      <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="10" fill="var(--surface)" stroke={color} strokeWidth="1.4" />
      <rect x={c.x} y={c.y} width="4" height={c.h} rx="2" fill={color} />
      <text x={c.x + c.w / 2 + 2} y={c.y + 27} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ink)">
        {c.titulo}
      </text>
      <text x={c.x + c.w / 2 + 2} y={c.y + 44} textAnchor="middle" fontSize="8.3" fill="var(--meta)">
        {c.sub}
      </text>
    </g>
  );
}

export default function PricingCientificoArquitectura() {
  const todas = Object.fromEntries([...CAJAS, ...FILA_2].map((c) => [c.id, c]));
  const colorEtapa = Object.fromEntries(
    CAJAS.map((c) => [c.id, ETAPAS.find((e) => e.id === c.etapa).color])
  );

  return (
    <svg
      viewBox="0 0 1004 310"
      className="pc-svg pc-arquitectura"
      role="img"
      aria-label="Arquitectura de referencia: ingesta desde punto de venta, data warehouse en la plataforma de datos, feature engineering y modelo de elasticidad en ciencia de datos, simulador de precio y tablero comercial en consumo comercial, con decisión del equipo comercial y retroalimentación hacia el punto de venta tras cada cambio de precio ejecutado"
    >
      <defs>
        <marker id="flecha" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--ink-soft)" />
        </marker>
        <marker id="flecha-loop" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#eb6834" />
        </marker>
      </defs>

      {/* Leyenda de etapas (colores) en vez de bandas de fondo — con dos
          filas de cajas, una banda por columna se encima con la fila
          equivocada; el color del borde izquierdo de cada caja ya basta
          para identificar la etapa, y la leyenda lo hace explícito. */}
      <g>
        {ETAPAS.map((e, i) => (
          <g key={e.id} transform={`translate(${20 + i * 240}, 16)`}>
            <rect x={0} y={-9} width={10} height={10} rx="2" fill={e.color} />
            <text x={16} y={0} fontSize="9.5" fill="var(--meta)">
              {e.titulo}
            </text>
          </g>
        ))}
      </g>

      {/* Flechas de la fila superior, con el dato que transportan etiquetado arriba de la línea */}
      {FLECHAS.map(({ de, a, dato }, i) => {
        const c1 = todas[de];
        const c2 = todas[a];
        const p1 = bordeDerecho(c1);
        const p2 = bordeIzquierdo(c2);
        const mx = (p1.x + p2.x) / 2;
        return (
          <g key={i}>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--ink-soft)" strokeWidth="1.5" markerEnd="url(#flecha)" />
            <text x={mx} y={p1.y - 9} textAnchor="middle" fontSize="7.8" fill="var(--meta)">
              {dato}
            </text>
          </g>
        );
      })}

      {/* Simulador → Tablero comercial (baja de fila) y Tablero → Decisión */}
      {(() => {
        const sim = todas.simulador;
        const dash = todas.dashboard;
        const dec = todas.decision;
        const p1 = bordeInferior(sim);
        const p2 = bordeSuperior(dash);
        const p3 = bordeDerecho(dash);
        const p4 = bordeIzquierdo(dec);
        return (
          <>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--ink-soft)" strokeWidth="1.5" markerEnd="url(#flecha)" />
            <text x={(p1.x + p2.x) / 2 + 48} y={(p1.y + p2.y) / 2} textAnchor="middle" fontSize="7.8" fill="var(--meta)">
              precio óptimo + utilidad esperada
            </text>
            <line x1={p3.x} y1={p3.y} x2={p4.x} y2={p4.y} stroke="var(--ink-soft)" strokeWidth="1.5" markerEnd="url(#flecha)" />
            <text x={(p3.x + p4.x) / 2} y={p3.y - 9} textAnchor="middle" fontSize="7.8" fill="var(--meta)">
              recomendación con contexto
            </text>
          </>
        );
      })()}

      {/* Retroalimentación: la ejecución de un nuevo precio genera nuevas
          transacciones reales, que vuelven a entrar al pipeline — el
          modelo se reentrena periódicamente con esos datos nuevos. */}
      <path
        d={`M ${todas.decision.x + todas.decision.w / 2} ${todas.decision.y + todas.decision.h} C 900 296, 85 296, ${todas.pos.x + todas.pos.w / 2} ${todas.pos.y + todas.pos.h}`}
        fill="none"
        stroke="#eb6834"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        markerEnd="url(#flecha-loop)"
      />
      <text x={502} y={307} textAnchor="middle" fontSize="9" fill="#eb6834">
        reentrenamiento periódico con transacciones reales tras cada cambio de precio ejecutado
      </text>

      {CAJAS.map((c) => (
        <Caja key={c.id} c={c} color={colorEtapa[c.id]} />
      ))}
      {FILA_2.map((c) => (
        <Caja key={c.id} c={c} color={c.color} />
      ))}
    </svg>
  );
}
