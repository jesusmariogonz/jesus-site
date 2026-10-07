"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { trackEvent } from "@/components/PostHogProvider";

const links = [
  { href: "/proyectos", label: "Trabajo" },
  { href: "/blog", label: "Ideas" },
  { href: "/pulso-mercado", label: "Pulso de Mercado" },
  { href: "/recursos", label: "Biblioteca" },
  { href: "/the-toolkit", label: "Toolkit →", accent: true },
  { href: "/contacto", label: "Hablemos" },
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
              onClick={() =>
                l.href === "/the-toolkit" &&
                trackEvent("toolkit_nav_click", { desde: pathname })
              }
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
