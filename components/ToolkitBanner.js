import Link from "next/link";

/* Banner promocional de "The Toolkit" dentro de cada nota del blog.
   Identidad propia (negro + dorado), independiente del tema de
   lectura claro/oscuro, con sombra "flotante" para que resalte
   sobre el contenido editorial. */

export default function ToolkitBanner({
  title = "Plantillas y kits listos para usar",
  description = "Dashboards, plantillas de Excel/Power BI y kits de analítica para retail — lo que uso en proyectos reales, empaquetado para que lo apliques hoy.",
  cta = "Ver The Toolkit",
  href = "/the-toolkit",
  className = "",
}) {
  return (
    <Link
      href={href}
      className={`tk-banner${className ? ` ${className}` : ""}`}
      aria-label={`${title} — ${cta}`}
    >
      <span className="tk-banner-mark" aria-hidden="true">
        TK
      </span>
      <div className="tk-banner-body">
        <span className="tk-banner-eyebrow">The Toolkit</span>
        <p className="tk-banner-title">{title}</p>
        <p className="tk-banner-desc">{description}</p>
      </div>
      <span className="tk-banner-cta">{cta} →</span>
    </Link>
  );
}
