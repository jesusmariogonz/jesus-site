"use client";

import Image from "next/image";
import Link from "next/link";
<<<<<<< HEAD
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
=======
import { motion, useReducedMotion } from "framer-motion";
>>>>>>> e40169ad88cf7072119c9ff793b8c4989a83d7b2

/* Hero editorial estilo Stripe/Vercel: titular grande por líneas,
   subtítulo de valor, stack en chips y CTAs. */

const STACK = [
  "Snowflake",
  "Databricks",
  "Azure",
  "Python",
  "AI",
  "Product Management",
];

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
<<<<<<< HEAD
  const { scrollY } = useScroll();
  // Parallax muy ligero: el resplandor de fondo se desplaza a ~25% del scroll
  const blobY = useTransform(scrollY, [0, 600], [0, 150]);

  return (
    <section className="jx-wrap jx-hero2">
      {!reduce && (
        <motion.div className="jx-hero2-blob" style={{ y: blobY }} aria-hidden />
      )}
=======

  return (
    <section className="jx-wrap jx-hero2">
>>>>>>> e40169ad88cf7072119c9ff793b8c4989a83d7b2
      <motion.div className="jx-hero2-id" {...fadeUp(reduce, 0)}>
        <Image
          src="/jesus-hero.webp"
          alt="Jesús González"
          width={44}
          height={44}
          priority
          className="jx-hero2-avatar"
        />
        <span>
          <b>Jesús González</b> · Data &amp; Analytics Product Lead
        </span>
      </motion.div>

      <motion.h1 {...fadeUp(reduce, 0.08)}>
        Data Products.
        <br />
        Inteligencia Artificial.
        <br />
        <span className="jx-grad">Analítica.</span>
      </motion.h1>

      <motion.p className="jx-hero2-sub" {...fadeUp(reduce, 0.16)}>
        Construyo plataformas de datos escalables para retail y negocios de
        consumo.
      </motion.p>

      <motion.div className="jx-hero2-stack" {...fadeUp(reduce, 0.24)}>
        {STACK.map((t) => (
          <span key={t} className="jx-hero2-chip">
            {t}
          </span>
        ))}
      </motion.div>

      <motion.div className="jx-hero2-cta" {...fadeUp(reduce, 0.32)}>
        <Link href="/contacto" className="btn">
          Hablemos →
        </Link>
        <a href="/cv/cv.pdf" target="_blank" rel="noopener" className="btn ghost">
          Ver CV
        </a>
      </motion.div>
    </section>
  );
}
