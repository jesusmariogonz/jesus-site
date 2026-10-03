"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/* Hero estilo "tarjeta de marca": panel oscuro de ancho completo con
   la foto recortada (sin fondo), el titular + cifras de impacto
   superpuestas, igual que la gráfica de LinkedIn. */

const STACK = [
  "Data Architecture",
  "AI",
  "Analytics",
  "Data Products",
];

const STATS = [
  { valor: "7", etiqueta: "países" },
  { valor: "+20", etiqueta: "iniciativas estratégicas" },
  { valor: "+5", etiqueta: "unidades de negocio" },
  { valor: "+100M", etiqueta: "transacciones analizadas" },
  { valor: "$130M", etiqueta: "en valor de negocio documentado" },
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
      <div className="jx-hero-card">
        <motion.div className="jx-hero-brand" {...fadeUp(reduce, 0)}>
          <span className="jx-hero-brand-nombre">Jesús González</span>
          <span className="jx-hero-brand-tag">DATA · AI · BUSINESS</span>
          <span className="jx-hero-brand-url">jgonzalez.app</span>
        </motion.div>

        <div className="jx-hero-grid">
          <div className="jx-hero-copy">
            <motion.h1 {...fadeUp(reduce, 0.08)}>
              Más de <span className="jx-grad">13 años</span> convirtiendo
              datos en decisiones que generan valor
            </motion.h1>

            <motion.p className="jx-hero2-sub" {...fadeUp(reduce, 0.16)}>
              Data, Analytics &amp; AI Solutions Architect. Diseño soluciones
              de datos e inteligencia artificial que convierten información
              en decisiones de negocio.
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
          </div>

          <motion.div className="jx-hero-foto" {...fadeUp(reduce, 0.14)}>
            <Image
              src="/jesus-hero-full.webp"
              alt="Jesús González"
              width={900}
              height={1325}
              priority
              className="jx-hero-foto-img"
            />
          </motion.div>
        </div>

        <motion.div className="jx-hero-stats" {...fadeUp(reduce, 0.4)}>
          {STATS.map((s) => (
            <div key={s.etiqueta} className="jx-hero-stat">
              <b>{s.valor}</b>
              <small>{s.etiqueta}</small>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
