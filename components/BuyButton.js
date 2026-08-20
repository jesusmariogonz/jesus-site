"use client";

/* Botón de compra de un producto de The Toolkit.
   - Si `checkoutUrl` ya tiene valor, es o bien /api/checkout?... (crea
     la sesión de Stripe en el servidor y redirige) o el link directo
     a un archivo gratuito (ej. /recursos/algo.pdf).
   - Si todavía no hay link (checkoutUrl === ""), muestra un estado
     "Próximamente" no interactivo. */

export default function BuyButton({ checkoutUrl, label = "Comprar", className = "" }) {
  if (!checkoutUrl) {
    return (
      <span className={`tk-buy tk-buy-soon ${className}`}>Próximamente</span>
    );
  }

  return (
    <a href={checkoutUrl} className={`tk-buy ${className}`}>
      {label}
    </a>
  );
}
