"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/* Hero: portada editorial, texto centrado, sin foto — la foto se quitó
   a pedido del usuario (26-oct-2026). La tarjeta de marca con la foto
   real vive en /sobre-mi. */

const fadeUp = (reduce, delay) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y: 26 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, delay, ease: [0.21, 0.65, 0.36, 1] },
      };

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="jx-wrap jx-hero2">
      <div className="jx-hero2-texto">
        <motion.span className="jx-hero-eyebrow" {...fadeUp(reduce, 0)}>
          Data · IA · Negocio
        </motion.span>
        <motion.h1 className="jx-hero-nombre" {...fadeUp(reduce, 0.04)}>
          Jesús González
        </motion.h1>
        <motion.p className="jx-hero-tagline" {...fadeUp(reduce, 0.08)}>
          La tecnología importa. El valor que genera, más.
        </motion.p>
        <motion.p className="jx-hero-desc" {...fadeUp(reduce, 0.12)}>
          Convierto datos complejos en soluciones analíticas, productos
          digitales y decisiones de negocio. Aquí comparto proyectos, ideas y
          herramientas sobre datos, inteligencia artificial y mercados.
        </motion.p>

        <motion.div className="jx-hero2-cta jx-hero2-cta--centrado" {...fadeUp(reduce, 0.16)}>
          <Link href="/proyectos" className="btn">
            Ver proyectos →
          </Link>
          <Link href="/blog" className="btn ghost">
            Leer las últimas ideas →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
