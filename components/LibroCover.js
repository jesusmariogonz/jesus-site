/* ============================================================
   Portada editorial de un libro — CSS + SVG, sin fotos.
   Tipografía + gradiente + un motivo geométrico propio del tema.
   `variante` decide gradiente y motivo (ver VARIANTES abajo).
   `size`: "card" (grid de Biblioteca) o "hero" (página de detalle).
   ============================================================ */

const VARIANTES = {
  framing: {
    claseGradiente: "lc-framing",
    motivo: (
      <g stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M25 40 L25 25 L45 25" />
        <path d="M175 40 L175 25 L155 25" />
        <path d="M25 260 L25 275 L45 275" />
        <path d="M175 260 L175 275 L155 275" />
      </g>
    ),
  },
  cognitivo: {
    claseGradiente: "lc-cognitivo",
    motivo: (
      <g>
        <circle cx="170" cy="40" r="120" fill="none" stroke="rgba(255,255,255,0.14)" />
        <circle cx="170" cy="40" r="85" fill="none" stroke="rgba(255,255,255,0.14)" />
        <circle cx="170" cy="40" r="50" fill="none" stroke="rgba(255,255,255,0.18)" />
        <line x1="20" y1="270" x2="140" y2="150" stroke="rgba(255,255,255,0.12)" />
      </g>
    ),
  },
  analitica: {
    claseGradiente: "lc-analitica",
    motivo: (
      <g>
        <g stroke="rgba(255,255,255,0.16)">
          <line x1="0" y1="60" x2="200" y2="60" />
          <line x1="0" y1="100" x2="200" y2="100" />
          <line x1="0" y1="140" x2="200" y2="140" />
        </g>
        <circle cx="40" cy="90" r="3" fill="rgba(255,255,255,0.5)" />
        <circle cx="90" cy="55" r="4" fill="rgba(255,255,255,0.6)" />
        <circle cx="130" cy="120" r="3" fill="rgba(255,255,255,0.4)" />
        <circle cx="165" cy="70" r="5" fill="rgba(255,255,255,0.7)" />
        <circle cx="60" cy="135" r="3" fill="rgba(255,255,255,0.4)" />
      </g>
    ),
  },
  tiempo: {
    claseGradiente: "lc-tiempo",
    motivo: (
      <g>
        <circle cx="100" cy="230" r="90" fill="none" stroke="rgba(255,255,255,0.14)" />
        <path d="M100 230 L100 165" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
        <path d="M100 230 L145 245" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />
      </g>
    ),
  },
  seniority: {
    claseGradiente: "lc-seniority",
    motivo: (
      <g stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M40 70 h90" />
        <path d="M40 95 h60" />
        <path d="M40 120 h75" />
        <circle cx="150" cy="200" r="30" fill="none" stroke="rgba(255,255,255,0.22)" />
        <path d="M150 185 v18 l12 8" strokeWidth="2" />
      </g>
    ),
  },
};

export default function LibroCover({
  variante,
  titulo,
  eyebrow,
  paginas,
  precio,
  gratis,
  size = "card",
}) {
  const v = VARIANTES[variante] || VARIANTES.framing;

  return (
    <div className={`lc lc-${size} ${v.claseGradiente}`}>
      {gratis ? (
        <span className="lc-price lc-price-gratis">Gratis</span>
      ) : precio != null ? (
        <span className="lc-price">${precio}</span>
      ) : null}
      <svg className="lc-motivo" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {v.motivo}
      </svg>
      <span className="lc-eyebrow">{eyebrow}</span>
      <span className="lc-titulo">{titulo}</span>
      <span className="lc-pie">{paginas ? `${paginas} pág.` : ""}</span>
    </div>
  );
}
