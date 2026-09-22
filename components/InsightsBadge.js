import { HORIZONTES, REGIONES } from "@/lib/posts";

/* Badge de clasificación editorial para Insights: HORIZONTE · REGIÓN.
   Solo se muestra si la nota trae horizonte en su frontmatter (campo
   opcional); si no, el llamador debe caer de vuelta a la categoría
   normal del blog. Acepta los slugs (ej. "long-term", "mexico"), no
   los nombres ya formateados. */
export default function InsightsBadge({ horizonte, region }) {
  const horizonteNombre = horizonte ? HORIZONTES[horizonte] || horizonte : null;
  if (!horizonteNombre) return null;
  const regionNombre = region ? REGIONES[region] || region : null;

  return (
    <span
      className={`insights-badge insights-badge-${horizonte}`}
    >
      {horizonteNombre.toUpperCase()}
      {regionNombre && <> · {regionNombre.toUpperCase()}</>}
    </span>
  );
}
