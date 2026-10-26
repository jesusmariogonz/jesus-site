import Link from "next/link";

/* Banner promocional de la colección "Cómo leer el mercado" (4 libros),
   al costado del Market Snapshot en /pulso-mercado. Lleva a la página
   de colección con la explicación completa de los 4 libros. */
export default function LibrosMercadoBanner() {
  return (
    <Link href="/recursos/como-leer-el-mercado" className="libros-mercado-banner">
      <span className="libros-mercado-banner-eyebrow">Cómo leer el mercado</span>
      <p className="libros-mercado-banner-titulo">
        90 días para construir tu propio sistema de inversión
      </p>
      <p className="libros-mercado-banner-desc">
        4 libros, metodología diaria, práctica contra los datos reales de
        este mismo Pulso de Mercado. $115 MXN cada uno.
      </p>
      <span className="libros-mercado-banner-cta">Ver la colección →</span>
    </Link>
  );
}
