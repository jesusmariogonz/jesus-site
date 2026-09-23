import Link from "next/link";
import { AUTHOR } from "@/lib/site";

const LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/pulso-mercado", label: "Pulso de Mercado" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/recursos", label: "Biblioteca" },
  { href: "/the-toolkit", label: "The Toolkit" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/contacto", label: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="footer-name">Jesús M. González Siller</span>
          <span className="footer-tagline">Data · AI · Business</span>
          <a
            href={AUTHOR.sameAs[0]}
            target="_blank"
            rel="noopener"
            className="footer-linkedin"
          >
            LinkedIn →
          </a>
        </div>

        <nav className="footer-links" aria-label="Navegación del pie de página">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container">
        <span className="sql-meta">
          © {new Date().getFullYear()} Jesús M. González Siller · hecho con
          Next.js · desplegado en Vercel
        </span>
      </div>
    </footer>
  );
}
