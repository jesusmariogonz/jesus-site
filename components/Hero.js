"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/* Hero: la tarjeta de marca se usa tal cual (imagen completa, ya
   diseñada), solo se agregan los CTAs debajo. */

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
      <motion.h1 className="jx-hero-nombre" {...fadeUp(reduce, 0)}>
        Jesús González
      </motion.h1>

      <motion.div className="jx-hero-card-img" {...fadeUp(reduce, 0.06)}>
        <Image
          src="/jesus-hero-card.jpg"
          alt="Jesús González — Data, AI & Business. Más de 13 años convirtiendo datos en decisiones que generan valor."
          width={1254}
          height={1254}
          priority
          className="jx-hero-card-img-el"
        />
      </motion.div>

      <motion.div className="jx-hero2-cta" {...fadeUp(reduce, 0.12)}>
        <Link href="/proyectos" className="btn">
          Ver proyectos →
        </Link>
        <Link href="/blog" className="btn ghost">
          Leer el blog
        </Link>
      </motion.div>
    </section>
  );
}
