"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/* ── Propuesta 1: typewriter en la última palabra ─────────────── */
const PALABRAS = ["decisiones", "pipelines", "retail", "criterio"];

function useTypewriter(words: string[], speed = 90, pause = 2200) {
  const [texto, setTexto] = useState("");
  const [i, setI] = useState(0);
  const [borrando, setBorrando] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTexto(words[0]);
      return;
    }
    const actual = words[i % words.length];
    let t: ReturnType<typeof setTimeout>;

    if (!borrando && texto === actual) {
      t = setTimeout(() => setBorrando(true), pause);
    } else if (borrando && texto === "") {
      setBorrando(false);
      setI((v) => v + 1);
    } else {
      t = setTimeout(
        () => setTexto(actual.slice(0, texto.length + (borrando ? -1 : 1))),
        borrando ? speed / 2 : speed
      );
    }
    return () => clearTimeout(t);
  }, [texto, borrando, i, words, speed, pause]);

  return texto;
}

export default function Hero() {
  const palabra = useTypewriter(PALABRAS);

  return (
    <section className="fade-up relative mx-auto flex max-w-4xl flex-col items-center gap-10 px-6 pt-16 text-center sm:pt-24 md:flex-row md:text-left">
      {/* Foto con anillo */}
      <div className="relative shrink-0">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500/60 to-emerald-400/60 blur-sm" />
        <Image
          src="/jesus-hero.webp"
          alt="Jesús González"
          width={208}
          height={208}
          priority
          className="relative h-44 w-44 rounded-full object-cover ring-2 ring-slate-700/60 sm:h-52 sm:w-52"
        />
      </div>

      <div>
        {/* Firma cursiva */}
        <p className="signature text-5xl text-slate-100 sm:text-6xl">
          Jesús González
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
          Datos, arquitectura y{" "}
          <span className="text-blue-400">
            {palabra}
            <span className="cursor-blink" aria-hidden>
              |
            </span>
          </span>
        </h1>

        <p className="mt-4 max-w-xl text-slate-400">
          Notas sobre construir plataformas de datos en el mundo real:
          decisiones técnicas, trade-offs y lo que aprendí operándolas.
        </p>
      </div>
    </section>
  );
}
