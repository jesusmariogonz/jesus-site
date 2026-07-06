export const metadata = { title: "Contacto" };

// ✏️ Cambia estos datos por los tuyos reales.
const canales = [
  { label: "email", valor: "tu@correo.com", href: "mailto:tu@correo.com" },
  {
    label: "linkedin",
    valor: "linkedin.com/in/tu-usuario",
    href: "https://linkedin.com/in/tu-usuario",
  },
  {
    label: "github",
    valor: "github.com/tu-usuario",
    href: "https://github.com/tu-usuario",
  },
];

export default function Contacto() {
  return (
    <section className="section">
      <div className="container">
        <span className="sql-meta">contacto</span>
        <h2>Hablemos</h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: "56ch" }}>
          Si quieres platicar de datos, IA, retail o de alguna nota del blog,
          estos son los canales donde me encuentras.
        </p>
        <ul className="contact-list">
          {canales.map((c) => (
            <li key={c.label}>
              <span className="label">-- {c.label}</span>
              <a href={c.href} target="_blank" rel="noopener">
                {c.valor}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
