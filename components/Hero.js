"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

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

  return (
    <section className="jx-wrap jx-hero2">
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
