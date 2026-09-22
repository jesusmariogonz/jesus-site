import Link from "next/link";

const HORIZONTES = [
  { href: "/swing", label: "Swing" },
  { href: "/position", label: "Position" },
  { href: "/long-term", label: "Long Term" },
];

export default function HorizonteSubnav({ actual }) {
  return (
    <nav className="horizonte-subnav" aria-label="Horizontes de Pulso de Mercado">
      {HORIZONTES.map((h) => (
        <Link
          key={h.href}
          href={h.href}
          className={h.href === actual ? "on" : undefined}
        >
          {h.label}
        </Link>
      ))}
    </nav>
  );
}
