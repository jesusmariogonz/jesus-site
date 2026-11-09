import Link from "next/link";

/* Subnav compartida de las tres grandes áreas de Pulso de Mercado:
   Mercado (dashboard de inteligencia de mercado existente), Research
   (nuevo laboratorio de investigación cuantitativa) y Trading
   (sistema de trading algorítmico existente). No sustituye las subnavs
   propias de cada sección (horizonte-subnav, trading-subnav) — se
   muestra arriba de ellas para ubicar en cuál de las tres áreas está
   el visitante. */
export default function PulsoMercadoSubnav({ activo }) {
  const items = [
    { href: "/pulso-mercado", label: "Mercado", key: "mercado" },
    { href: "/pulso-mercado/research", label: "Research", key: "research" },
    { href: "/pulso-mercado/trading", label: "Trading", key: "trading" },
  ];
  return (
    <nav className="pulso-areas-subnav" aria-label="Áreas de Pulso de Mercado">
      {items.map((it) => (
        <Link
          key={it.key}
          href={it.href}
          className={it.key === activo ? "activo" : undefined}
          aria-current={it.key === activo ? "page" : undefined}
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
