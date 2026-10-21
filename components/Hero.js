"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/* Hero: portada editorial, dos columnas — texto alineado a la
   izquierda + ilustración abstracta (generada con IA, fondo
   transparente) a la derecha. La fotografía/tarjeta de marca que
   antes vivía aquí se movió a /sobre-mi. */

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
    <section className="jx-wrap jx-hero2 jx-hero2--split">
      <div className="jx-hero2-texto">
        <motion.span className="jx-hero-eyebrow jx-hero-eyebrow--izq" {...fadeUp(reduce, 0)}>
          Data · IA · Negocio
        </motion.span>
        <motion.h1 className="jx-hero-nombre jx-hero-nombre--izq" {...fadeUp(reduce, 0.04)}>
          Jesús González
        </motion.h1>
        <motion.p className="jx-hero-tagline jx-hero-tagline--izq" {...fadeUp(reduce, 0.08)}>
          La tecnología importa. El valor que genera, más.
        </motion.p>
        <motion.p className="jx-hero-desc jx-hero-desc--izq" {...fadeUp(reduce, 0.12)}>
          Convierto datos complejos en soluciones analíticas, productos
          digitales y decisiones de negocio. Aquí comparto proyectos, ideas y
          herramientas sobre datos, inteligencia artificial y mercados.
        </motion.p>

        <motion.div className="jx-hero2-cta" {...fadeUp(reduce, 0.16)}>
          <Link href="/proyectos" className="btn">
            Ver proyectos →
          </Link>
          <Link href="/blog" className="btn ghost">
            Leer las últimas ideas →
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="jx-hero2-ilustracion"
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0, scale: 0.94 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.8, delay: 0.1, ease: [0.21, 0.65, 0.36, 1] },
            })}
      >
        <Image
          src="/hero-ilustracion.png"
          alt=""
          width={1024}
          height={1024}
          priority
          className="jx-hero2-ilustracion-img"
        />
      </motion.div>
    </section>
  );
}
