<<<<<<< HEAD
/* Portada de nota:
   - Si la nota trae `imagen` en su frontmatter (ej. /blog/mi-nota.jpg),
     se muestra esa fotografía como thumbnail.
   - Si no, se genera una portada con gradiente + glifo por categoría,
     para que ninguna nota quede "sin cara". */
=======
/* Portada visual editorial para las notas del blog.
   Genera una miniatura con gradiente + glifo según la categoría —
   sin necesidad de subir imágenes por cada nota. */
>>>>>>> e40169ad88cf7072119c9ff793b8c4989a83d7b2

const TEMAS = {
  snowflake: { glifo: "❄", grad: "linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)" },
  "ingenieria-de-datos": { glifo: "⛁", grad: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)" },
  arquitectura: { glifo: "◫", grad: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" },
  ia: { glifo: "✳", grad: "linear-gradient(135deg, #10b981 0%, #047857 100%)" },
<<<<<<< HEAD
  cloud: { glifo: "☁", grad: "linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)" },
  "data-model": { glifo: "⬡", grad: "linear-gradient(135deg, #2dd4bf 0%, #0f766e 100%)" },
  "business-analytics": { glifo: "◔", grad: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)" },
  business: { glifo: "▲", grad: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)" },
  leadership: { glifo: "✦", grad: "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)" },
  geopolitics: { glifo: "◍", grad: "linear-gradient(135deg, #64748b 0%, #334155 100%)" },
  fintech: { glifo: "◈", grad: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)" },
  opinion: { glifo: "❝", grad: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
  default: { glifo: "▤", grad: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)" },
};

export default function NotaCover({ categoria, imagen, size = "md" }) {
  const tema = TEMAS[categoria] || TEMAS.default;

  if (imagen) {
    return (
      <div
        className={`jx-cover jx-cover-${size} jx-cover-img`}
        style={{ backgroundImage: `url(${imagen})` }}
        aria-hidden
      >
        <span className="jx-cover-tag">{categoria}</span>
      </div>
    );
  }

=======
  oxxo: { glifo: "▣", grad: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" },
  opinion: { glifo: "❝", grad: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
  fintech: { glifo: "◈", grad: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)" },
  default: { glifo: "▤", grad: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)" },
};

export default function NotaCover({ categoria, size = "md" }) {
  const tema = TEMAS[categoria] || TEMAS.default;
>>>>>>> e40169ad88cf7072119c9ff793b8c4989a83d7b2
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
