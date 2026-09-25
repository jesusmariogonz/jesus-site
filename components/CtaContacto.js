import Link from "next/link";
import { AUTHOR } from "@/lib/site";

/* Propuesta 5: cierre con intención */

export default function CtaContacto() {
  return (
    <section className="jx-wrap">
      <div className="jx-cta">
        <p className="jx-cta-firma">
          ¿Tienes un problema de datos, IA o analítica?
        </p>
        <p>Hablemos de arquitectura, producto o valor de negocio.</p>
        <div className="jx-cta-botones">
          <Link href="/contacto" className="jx-btn jx-btn-primario">
            Hablemos →
          </Link>
          <Link href="/blog" className="jx-btn jx-btn-secundario">
            Lee el blog
          </Link>
        </div>
        <div className="jx-cta-redes">
          <a href={AUTHOR.sameAs[0]} target="_blank" rel="noopener">
            LinkedIn
          </a>
          <span aria-hidden>·</span>
          <a href={`mailto:${AUTHOR.email}`}>Correo</a>
        </div>
      </div>
    </section>
  );
}
