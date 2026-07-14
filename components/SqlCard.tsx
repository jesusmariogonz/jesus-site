"use client";

import { useEffect, useRef, useState } from "react";

/* ── Propuesta 2: la query se "ejecuta" al entrar en viewport ──── */

const QUERY_LINES = [
  { text: "SELECT rol, stack, ciudad", kw: ["SELECT"] },
  { text: "FROM   quien_escribe_aqui", kw: ["FROM"] },
  { text: "WHERE  cafe = TRUE;", kw: ["WHERE", "TRUE"] },
];

const RESULT = [
  ["rol", "Data Product Owner"],
  ["stack", "Snowflake · Databricks · Azure · Python"],
  ["ciudad", "Saltillo, MX"],
];

function highlight(line: { text: string; kw: string[] }) {
  const parts = line.text.split(/(\s+)/);
  return parts.map((p, idx) =>
    line.kw.includes(p.replace(";", "")) ? (
      <span key={idx} className="text-sky-400">
        {p}
      </span>
    ) : (
      <span key={idx} className="text-slate-200">
        {p}
      </span>
    )
  );
}

export default function SqlCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [fase, setFase] = useState(0); // 0: nada · 1: query · 2: ejecutando · 3: resultado

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setFase(3);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setFase(1);
          setTimeout(() => setFase(2), 1300);
          setTimeout(() => setFase(3), 2100);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mx-auto mt-12 w-full max-w-2xl overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/80 shadow-2xl shadow-blue-950/40 backdrop-blur"
    >
      {/* barra de ventana */}
      <div className="flex items-center gap-2 border-b border-slate-700/60 bg-slate-800/60 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
        <span className="h-3 w-3 rounded-full bg-green-400/80" />
        <span className="ml-3 font-mono text-xs text-slate-400">
          ¿quién escribe aquí? — snowflake.sql
        </span>
      </div>

      <div className="px-5 py-4 font-mono text-sm leading-7">
        {/* query, línea por línea */}
        {QUERY_LINES.map((l, i) => (
          <div
            key={i}
            className={`transition-all duration-300 ${
              fase >= 1
                ? "translate-y-0 opacity-100"
                : "translate-y-1 opacity-0"
            }`}
            style={{ transitionDelay: `${i * 250}ms`, whiteSpace: "pre" }}
          >
            <span className="mr-3 select-none text-slate-600">{i + 1}</span>
            {highlight(l)}
          </div>
        ))}

        {/* estado de ejecución */}
        <div className="mt-3 min-h-6 text-xs">
          {fase === 2 && (
            <span className="text-yellow-400/90">
              ▸ Ejecutando<span className="cursor-blink">…</span>
            </span>
          )}
          {fase === 3 && (
            <span className="text-emerald-400">✓ 1 fila en 0.42 s</span>
          )}
        </div>

        {/* resultado */}
        <div
          className={`mt-2 overflow-hidden rounded-lg border border-slate-700/50 transition-all duration-500 ${
            fase === 3 ? "max-h-56 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <table className="w-full text-left text-xs sm:text-sm">
            <tbody>
              {RESULT.map(([k, v], i) => (
                <tr
                  key={k}
                  className={i % 2 ? "bg-slate-800/40" : "bg-slate-800/70"}
                >
                  <td className="px-3 py-2 text-emerald-400/90">{k}</td>
                  <td className="px-3 py-2 text-slate-200">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
