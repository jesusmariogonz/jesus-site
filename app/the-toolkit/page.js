import { TOOLKIT_PRODUCTOS, TOOLKIT_BUNDLES } from "@/lib/toolkit";
import ToolkitCatalog from "@/components/ToolkitCatalog";
import Link from "next/link";

export const metadata = {
  title: "The Toolkit",
  description:
    "Plantillas, kits y cursos de analítica, datos e IA para retail — Power BI, SQL, Excel y más, listos para usar.",
  alternates: { canonical: "/the-toolkit" },
};

export default function TheToolkit() {
  const hayAlgunoDisponible = TOOLKIT_PRODUCTOS.some((p) => p.checkoutUrl);

  return (
    <section className="tk-page">
      <div className="container">
        <div className="tk-hero">
          <span className="tk-hero-eyebrow">The Toolkit</span>
          <h1 className="tk-hero-title">
            Recursos de datos y analítica, listos para usar.
          </h1>
          <p className="tk-hero-desc">
            Plantillas, kits y cursos que uso en proyectos reales de datos,
            IA y retail — empaquetados para que los apliques directo, sin
            reinventar la rueda. Compra individual, o selecciona varios y
            te aplicamos el precio de bundle.
          </p>
          {!hayAlgunoDisponible && (
            <span className="tk-hero-badge">Muy pronto disponible</span>
          )}
        </div>

        <ToolkitCatalog productos={TOOLKIT_PRODUCTOS} bundles={TOOLKIT_BUNDLES} />

        <div className="tk-cta-final">
          <p>¿Quieres que te avise en cuanto abra un recurso nuevo?</p>
          <Link href="/blog" className="tk-banner-cta">
            Suscríbete al newsletter →
          </Link>
        </div>
      </div>
    </section>
  );
}
