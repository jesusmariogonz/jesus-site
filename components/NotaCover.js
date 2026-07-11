/* Portada visual editorial para las notas del blog.
   Genera una miniatura con gradiente + glifo según la categoría —
   sin necesidad de subir imágenes por cada nota. */

const TEMAS = {
  snowflake: { glifo: "❄", grad: "linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)" },
  "ingenieria-de-datos": { glifo: "⛁", grad: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)" },
  arquitectura: { glifo: "◫", grad: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" },
  ia: { glifo: "✳", grad: "linear-gradient(135deg, #10b981 0%, #047857 100%)" },
  oxxo: { glifo: "▣", grad: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" },
  opinion: { glifo: "❝", grad: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
  fintech: { glifo: "◈", grad: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)" },
  default: { glifo: "▤", grad: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)" },
};

export default function NotaCover({ categoria, size = "md" }) {
  const tema = TEMAS[categoria] || TEMAS.default;
  return (
    <div
      className={`jx-cover jx-cover-${size}`}
      style={{ background: tema.grad }}
      aria-hidden
    >
      <span className="jx-cover-glifo">{tema.glifo}</span>
      <span className="jx-cover-tag">{categoria}</span>
    </div>
  );
}
