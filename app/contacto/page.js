import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contacto",
  description:
    "Contacta a Jesús Mario González Siller para temas de datos, analítica, IA y retail.",
  alternates: { canonical: "/contacto" },
};

const canales = [
  {
    label: "email",
    valor: "jesusmariogonz@gmail.com",
    href: "mailto:jesusmariogonz@gmail.com",
  },
  {
    label: "linkedin",
    valor: "linkedin.com/in/jesus-mario-gonzalez-siller",
    href: "https://www.linkedin.com/in/jesus-mario-gonzalez-siller-545301ab/",
  },
];

export default function Contacto() {
  return (
    <section className="section">
      <div className="container">
        <span className="sql-meta">-- contacto</span>
        <h2>Hablemos</h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: "56ch" }}>
          ¿Datos, IA o retail? Escríbeme.
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
        <ContactForm />
      </div>
    </section>
  );
}
