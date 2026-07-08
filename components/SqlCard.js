"use client";

import { useEffect, useRef, useState } from "react";

/* Propuesta 2: terminal SQL con ejecución animada */

const QUERY = [
  { text: "SELECT rol, stack, ciudad", kw: ["SELECT"] },
  { text: "FROM   quien_escribe_aqui", kw: ["FROM"] },
  { text: "WHERE  cafe = TRUE;", kw: ["WHERE", "TRUE"] },
];

const RESULT = [
  ["rol", "Data Product Owner"],
  ["stack", "Snowflake · Databricks · Azure · Python"],
  ["ciudad", "Saltillo, MX"],
];

function resaltar(linea) {
  return linea.text.split(/(\s+)/).map((p, i) =>
    linea.kw.includes(p.replace(";", "")) ? (
      <span key={i} className="kw">
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function SqlCard() {
  const ref = useRef(null);
  const [fase, setFase] = useState(0); // 0 nada · 1 query · 2 ejecutando · 3 listo

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
    <div className="jx-wrap">
      <div
        ref={ref}
        className={`jx-sql ${fase >= 1 ? "is-on" : ""} ${
          fase === 3 ? "is-done" : ""
        }`}
      >
        <div className="jx-sql-bar">
          <i /> <i /> <i />
          <span>¿quién escribe aquí? — snowflake.sql</span>
        </div>

        <div className="jx-sql-body">
          {QUERY.map((l, i) => (
            <div
              key={i}
              className="jx-sql-line"
              style={{ transitionDelay: `${i * 250}ms` }}
            >
              <span className="n">{i + 1}</span>
              {resaltar(l)}
            </div>
          ))}

          <div className="jx-sql-status">
            {fase === 2 && (
              <span className="run">
                ▸ Ejecutando<span className="cursor-blink">…</span>
              </span>
            )}
            {fase === 3 && <span className="ok">✓ 1 fila en 0.42 s</span>}
          </div>

          <div className="jx-sql-result">
            <table>
              <tbody>
                {RESULT.map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
