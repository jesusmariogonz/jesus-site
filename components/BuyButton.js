"use client";

/* Botón de compra de un producto de The Toolkit.
   - Si `checkoutUrl` ya es un link real de Lemon Squeezy, abre el
     checkout como overlay (modal) sobre la misma página gracias a
     Lemon.js (cargado una vez en la página con <LemonjsScript />).
   - Si todavía no hay link (checkoutUrl === ""), muestra un estado
     "Próximamente" no interactivo. */

export default function BuyButton({ checkoutUrl, label = "Comprar", className = "" }) {
  if (!checkoutUrl) {
    return (
      <span className={`tk-buy tk-buy-soon ${className}`}>Próximamente</span>
    );
  }

  return (
    <a href={checkoutUrl} className={`tk-buy lemonsqueezy-button ${className}`}>
      {label}
    </a>
  );
}
