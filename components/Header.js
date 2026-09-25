"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/proyectos", label: "Trabajo" },
  { href: "/blog", label: "Ideas" },
  { href: "/pulso-mercado", label: "Pulso de Mercado" },
  { href: "/the-toolkit", label: "Toolkit" },
  { href: "/contacto", label: "Hablemos →", accent: true },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="wordmark" aria-label="Inicio">
          J<span className="dot">.</span>
        </Link>
        <nav className="site-nav" aria-label="Navegación principal">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={l.accent ? "nav-toolkit" : undefined}
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
