"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/* Hero editorial estilo Stripe/Vercel: titular grande por líneas,
   subtítulo de valor, stack en chips y CTAs. */

const STACK = [
  "Data Architecture",
  "AI",
  "Analytics",
  "Data Products",
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
  const { scrollY } = useScroll();
  // Parallax muy ligero: el resplandor de fondo se desplaza a ~25% del scroll
  const blobY = useTransform(scrollY, [0, 600], [0, 150]);

  return (
    <section className="jx-wrap jx-hero2">
      {!reduce && (
        <motion.div className="jx-hero2-blob" style={{ y: blobY }} aria-hidden />
      )}
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
          <b>Jesús González</b> · Data, Analytics &amp; AI Solutions Architect
        </span>
      </motion.div>

      <motion.h1 {...fadeUp(reduce, 0.08)}>
        Data <span aria-hidden="true">·</span>
        <br />
        AI <span aria-hidden="true">·</span>
        <br />
        <span className="jx-grad">Business.</span>
      </motion.h1>

      <motion.p className="jx-hero2-sub" {...fadeUp(reduce, 0.16)}>
        Diseño soluciones de datos e inteligencia artificial que convierten
        información en decisiones de negocio.
      </motion.p>

      <motion.div className="jx-hero2-stack" {...fadeUp(reduce, 0.24)}>
        {STACK.map((t) => (
          <span key={t} className="jx-hero2-chip">
            {t}
          </span>
        ))}
      </motion.div>

      <motion.div className="jx-hero2-cta" {...fadeUp(reduce, 0.32)}>
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
