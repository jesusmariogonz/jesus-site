/* ============================================================
   Iconos de línea para "En qué me enfoco" (Sobre mí) — SVG propio,
   mismo estilo que ProjectArt/LibroCover: trazos finos, sin fotos
   de stock, coherente con la identidad del sitio.
   ============================================================ */

const ICONOS = {
  producto: (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="5" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="23" y="22" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M17 13 H23 a4 4 0 0 1 4 4 V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="11" cy="27" r="4" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </svg>
  ),
  arquitectura: (
    <svg viewBox="0 0 40 40" fill="none">
      <rect x="7" y="6" width="26" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="7" y="16.5" width="26" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="7" y="27" width="26" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12.5" cy="9.5" r="1.4" fill="currentColor" />
      <circle cx="12.5" cy="20" r="1.4" fill="currentColor" />
      <circle cx="12.5" cy="30.5" r="1.4" fill="currentColor" />
    </svg>
  ),
  ia: (
    <svg viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="4.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="10" r="2.6" stroke="currentColor" strokeWidth="2" />
      <circle cx="33" cy="10" r="2.6" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="30" r="2.6" stroke="currentColor" strokeWidth="2" />
      <circle cx="33" cy="30" r="2.6" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.3 11.6 L16.4 17.4 M30.7 11.6 L23.6 17.4 M9.3 28.4 L16.4 22.6 M30.7 28.4 L23.6 22.6"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.7"
      />
    </svg>
  ),
  roi: (
    <svg viewBox="0 0 40 40" fill="none">
      <path
        d="M6 30 V10 M6 30 H34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 25 L17 17 L22 21 L32 10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M25 10 H32 V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function SobreFocos({ focos }) {
  return (
    <div className="sobre-focos-grid">
      {focos.map((f) => (
        <div key={f.titulo} className="sobre-foco-card">
          <span className="sobre-foco-icon">{ICONOS[f.icono]}</span>
          <strong className="sobre-foco-titulo">{f.titulo}</strong>
          <p className="sobre-foco-desc">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
