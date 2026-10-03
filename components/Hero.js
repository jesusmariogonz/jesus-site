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
  {
    valor: "+13",
    etiqueta: "años de experiencia",
    icono: (
      <path d="M8 6 2 12l6 6M16 6l6 6-6 6" />
    ),
  },
  {
    valor: "7",
    etiqueta: "países",
    icono: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
      </>
    ),
  },
  {
    valor: "+20",
    etiqueta: "iniciativas estratégicas",
    icono: <path d="M12 2 4.5 20.3l7.5-4 7.5 4L12 2Z" />,
  },
  {
    valor: "+5",
    etiqueta: "unidades de negocio",
    icono: (
      <>
        <path d="M3 9.5 12 3l9 6.5V21H3V9.5Z" />
        <path d="M9 21v-7h6v7" />
      </>
    ),
  },
  {
    valor: "+100M",
    etiqueta: "transacciones analizadas",
    icono: (
      <>
        <ellipse cx="12" cy="5.5" rx="8" ry="3" />
        <path d="M4 5.5V12c0 1.66 3.58 3 8 3s8-1.34 8-3V5.5" />
        <path d="M4 12v6.5c0 1.66 3.58 3 8 3s8-1.34 8-3V12" />
      </>
    ),
  },
  {
    valor: "$130M",
    etiqueta: "en valor de negocio documentado",
    icono: (
      <>
        <path d="M3 17 9 11l4 4 8-8" />
        <path d="M15 7h6v6" />
      </>
    ),
  },
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
              src="/jesus-hero-cutout.png"
              alt="Jesús González"
              width={733}
              height={1284}
              priority
              className="jx-hero-foto-img"
            />
          </motion.div>
        </div>

        <motion.div className="jx-hero-stats" {...fadeUp(reduce, 0.4)}>
          {STATS.map((s) => (
            <div key={s.etiqueta} className="jx-hero-stat">
              <svg
                className="jx-hero-stat-icono"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {s.icono}
              </svg>
              <b>{s.valor}</b>
              <small>{s.etiqueta}</small>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
