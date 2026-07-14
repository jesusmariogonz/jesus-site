"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Animación de entrada sutil (fade + translateY) al hacer scroll.
   Uso: <Reveal delay={0.1}> ... </Reveal>
   Respeta prefers-reduced-motion. */
export default function Reveal({ children, delay = 0, y = 22, ...props }) {
  const reduce = useReducedMotion();

  if (reduce) return <div {...props}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.65, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
