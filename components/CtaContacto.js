import Link from "next/link";

/* Propuesta 5: cierre con intención */

export default function CtaContacto() {
  return (
    <section className="jx-wrap">
      <div className="jx-cta">
        <p className="jx-cta-firma">¿Platicamos?</p>
        <p>Datos, IA o retail: cruzar notas siempre suma.</p>
        <div className="jx-cta-botones">
          <Link href="/contacto" className="jx-btn jx-btn-primario">
            Escríbeme
          </Link>
          <Link href="/blog" className="jx-btn jx-btn-secundario">
            Lee el blog
          </Link>
        </div>
      </div>
    </section>
  );
}
