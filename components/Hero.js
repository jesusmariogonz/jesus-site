"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/* Propuesta 1 + foto y firma */

const PALABRAS = ["decisiones", "pipelines", "retail", "criterio"];

function useTypewriter(words, speed = 90, pause = 2200) {
  const [texto, setTexto] = useState("");
  const [i, setI] = useState(0);
  const [borrando, setBorrando] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTexto(words[0]);
      return;
    }
    const actual = words[i % words.length];
    let t;
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
    <section className="jx-wrap jx-hero">
      <div className="jx-foto-anillo">
        <Image
          src="/jesus-hero.webp"
          alt="Jesús González"
          width={190}
          height={190}
          priority
          className="jx-foto"
        />
      </div>

      <div>
        <p className="signature jx-firma">Jesús González</p>
        <h1>
          Datos, arquitectura y{" "}
          <span className="jx-typed">
            {palabra}
            <span className="cursor-blink" aria-hidden>
              |
            </span>
          </span>
        </h1>
        <p className="jx-intro">
          Notas sobre construir plataformas de datos en el mundo real:
          decisiones técnicas, trade-offs y lo que aprendí operándolas.
        </p>
      </div>
    </section>
  );
}
