"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/curriculum", label: "Currículum" },
  { href: "/blog", label: "Blog" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="wordmark signature">
          Jesús González
        </Link>
        <nav className="site-nav" aria-label="Navegación principal">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
