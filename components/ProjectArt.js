/* ============================================================
   Arte abstracto por proyecto.
   Gráficos vectoriales (nítidos a cualquier resolución/zoom,
   sin peso de imagen) — un motivo distinto por categoría,
   misma familia visual para que se sientan de un solo set.
   ============================================================ */

const GRAD_ID = (variant) => `pshow-grad-${variant}`;

function Defs({ variant, hueA, hueB }) {
  return (
    <defs>
      <linearGradient id={GRAD_ID(variant)} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={hueA} stopOpacity="0.9" />
        <stop offset="100%" stopColor={hueB} stopOpacity="0.55" />
      </linearGradient>
      <radialGradient id={`${GRAD_ID(variant)}-glow`} cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor={hueA} stopOpacity="0.35" />
        <stop offset="100%" stopColor={hueA} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

const MOTIVOS = {
  // 01 · Lealtad — anillos concéntricos conectados (puntos de contacto con el cliente)
  lealtad: ({ variant, hueA, hueB }) => (
    <>
      <Defs variant={variant} hueA={hueA} hueB={hueB} />
      <rect width="400" height="240" fill={`url(#${GRAD_ID(variant)}-glow)`} />
      {[70, 46, 22].map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="120"
          r={r}
          fill="none"
          stroke={`url(#${GRAD_ID(variant)})`}
          strokeWidth={i === 2 ? 2.5 : 1.2}
          opacity={0.9 - i * 0.15}
        />
      ))}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 200 + 70 * Math.cos(rad);
        const y = 120 + 70 * Math.sin(rad);
        return <circle key={deg} cx={x} cy={y} r="4" fill={hueA} />;
      })}
    </>
  ),

  // 02 · Modernización — barras ascendentes tipo migración/capas
  modernizacion: ({ variant, hueA, hueB }) => (
    <>
      <Defs variant={variant} hueA={hueA} hueB={hueB} />
      <rect width="400" height="240" fill={`url(#${GRAD_ID(variant)}-glow)`} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={80 + i * 50}
          y={190 - i * 28}
          width="30"
          height={20 + i * 28}
          rx="4"
          fill={`url(#${GRAD_ID(variant)})`}
          opacity={0.55 + i * 0.09}
        />
      ))}
      <path
        d="M70 175 L130 140 L180 150 L230 100 L280 70 L320 40"
        stroke={hueA}
        strokeWidth="2"
        fill="none"
        strokeDasharray="4 5"
        opacity="0.8"
      />
    </>
  ),

  // 03 · Recomendación — grafo de nodos conectados (afinidad de productos)
  recomendacion: ({ variant, hueA, hueB }) => {
    const nodos = [
      [200, 60], [120, 110], [280, 110], [80, 180], [200, 150], [320, 180], [200, 210],
    ];
    const bordes = [[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[4,6],[3,6],[5,6]];
    return (
      <>
        <Defs variant={variant} hueA={hueA} hueB={hueB} />
        <rect width="400" height="240" fill={`url(#${GRAD_ID(variant)}-glow)`} />
        {bordes.map(([a, b], i) => (
          <line
            key={i}
            x1={nodos[a][0]} y1={nodos[a][1]}
            x2={nodos[b][0]} y2={nodos[b][1]}
            stroke={hueA} strokeWidth="1" opacity="0.4"
          />
        ))}
        {nodos.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 0 ? 9 : 6} fill={`url(#${GRAD_ID(variant)})`} />
        ))}
      </>
    );
  },

  // 04 · POS — franjas tipo ticket/código de barras
  pos: ({ variant, hueA, hueB }) => (
    <>
      <Defs variant={variant} hueA={hueA} hueB={hueB} />
      <rect width="400" height="240" fill={`url(#${GRAD_ID(variant)}-glow)`} />
      <rect x="130" y="40" width="140" height="170" rx="10" fill="none" stroke={hueA} strokeWidth="1.4" opacity="0.55" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect
          key={i}
          x={148 + i * 7.5}
          y="60"
          width={i % 3 === 0 ? 3 : 1.6}
          height="60"
          fill={`url(#${GRAD_ID(variant)})`}
          opacity="0.85"
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="148" y={135 + i * 12} width={90 - i * 10} height="4" rx="2" fill={hueA} opacity="0.35" />
      ))}
    </>
  ),

  // 05 · Agente IA — nodo central tipo chip/asistente con pulsos
  agente: ({ variant, hueA, hueB }) => (
    <>
      <Defs variant={variant} hueA={hueA} hueB={hueB} />
      <rect width="400" height="240" fill={`url(#${GRAD_ID(variant)}-glow)`} />
      <rect x="165" y="85" width="70" height="70" rx="16" fill={`url(#${GRAD_ID(variant)})`} />
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx="200" cy="120" r={45 + i * 22}
          fill="none" stroke={hueA} strokeWidth="1" opacity={0.32 - i * 0.06}
        />
      ))}
      {[[100,60],[300,60],[100,180],[300,180]].map(([x,y], i) => (
        <line key={i} x1="200" y1="120" x2={x} y2={y} stroke={hueA} strokeWidth="1" opacity="0.4" />
      ))}
    </>
  ),

  // 06 · Clima — línea de forecast con puntos climáticos
  clima: ({ variant, hueA, hueB }) => (
    <>
      <Defs variant={variant} hueA={hueA} hueB={hueB} />
      <rect width="400" height="240" fill={`url(#${GRAD_ID(variant)}-glow)`} />
      <path
        d="M40 150 Q90 80 140 140 T240 110 T340 150"
        stroke={`url(#${GRAD_ID(variant)})`}
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M40 150 Q90 80 140 140 T240 110 T340 150 L340 210 L40 210 Z"
        fill={`url(#${GRAD_ID(variant)})`}
        opacity="0.12"
      />
      {[[90,105],[190,120],[290,125]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={hueA} />
      ))}
    </>
  ),

  // 07 · Pricing — barras + etiqueta de precio
  pricing: ({ variant, hueA, hueB }) => (
    <>
      <Defs variant={variant} hueA={hueA} hueB={hueB} />
      <rect width="400" height="240" fill={`url(#${GRAD_ID(variant)}-glow)`} />
      {[40, 70, 55, 90, 65, 100].map((h, i) => (
        <rect
          key={i}
          x={90 + i * 35}
          y={190 - h}
          width="20"
          height={h}
          rx="3"
          fill={`url(#${GRAD_ID(variant)})`}
          opacity={0.5 + i * 0.08}
        />
      ))}
      <path d="M300 60 L330 60 L330 90 L315 105 L300 90 Z" fill={hueA} opacity="0.85" />
      <circle cx="313" cy="72" r="3.5" fill="#0b1220" />
    </>
  ),

  // 08 · GenAI — halo/burst radiante
  genai: ({ variant, hueA, hueB }) => (
    <>
      <Defs variant={variant} hueA={hueA} hueB={hueB} />
      <rect width="400" height="240" fill={`url(#${GRAD_ID(variant)}-glow)`} />
      {Array.from({ length: 16 }).map((_, i) => {
        const deg = (i * 360) / 16;
        const rad = (deg * Math.PI) / 180;
        const r1 = 26;
        const r2 = i % 2 === 0 ? 78 : 58;
        return (
          <line
            key={i}
            x1={200 + r1 * Math.cos(rad)} y1={120 + r1 * Math.sin(rad)}
            x2={200 + r2 * Math.cos(rad)} y2={120 + r2 * Math.sin(rad)}
            stroke={`url(#${GRAD_ID(variant)})`} strokeWidth="2"
            opacity="0.8"
          />
        );
      })}
      <circle cx="200" cy="120" r="18" fill={`url(#${GRAD_ID(variant)})`} />
    </>
  ),
};

export default function ProjectArt({ variant, hueA = "#4f8cff", hueB = "#1c2c52" }) {
  const Motivo = MOTIVOS[variant] || MOTIVOS.genai;
  return (
    <svg className="pshow-art-svg" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#0b1220" />
      {Motivo({ variant, hueA, hueB })}
    </svg>
  );
}
