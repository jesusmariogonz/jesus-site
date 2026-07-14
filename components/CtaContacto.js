import Link from "next/link";

/* Propuesta 5: cierre con intención */

export default function CtaContacto() {
  return (
    <section className="jx-wrap">
      <div className="jx-cta">
        <p className="jx-cta-firma">¿Platicamos?</p>
<<<<<<< HEAD
        <p>Datos, IA o retail: cruzar notas siempre suma.</p>
=======
        <p>
          Si trabajas en datos, retail o loyalty y algo de lo que escribo te
          hizo ruido, me da gusto cruzar notas.
        </p>
>>>>>>> e40169ad88cf7072119c9ff793b8c4989a83d7b2
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
