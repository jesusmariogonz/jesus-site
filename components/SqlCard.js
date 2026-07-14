"use client";

import { useEffect, useRef, useState } from "react";

/* Terminal SQL interactiva: pestañas de queries + botón ejecutar.
   El visitante puede cambiar de query y re-ejecutar la animación. */

const QUERIES = {
  about_me: {
    lineas: [
      { text: "SELECT rol, stack, especialidad, ciudad", kw: ["SELECT"] },
      { text: "FROM   about_me", kw: ["FROM"] },
      { text: "WHERE  cafe = TRUE", kw: ["WHERE", "TRUE"] },
      { text: "  AND  data_changes_decisions = TRUE;", kw: ["AND", "TRUE"] },
    ],
    resultado: [
      ["rol", "Data & Analytics Product Lead"],
      ["stack", "Snowflake · Databricks · Azure Data Factory · Spark · Python"],
      ["especialidad", "AI Products · Data Strategy · Cloud Analytics · Retail Intelligence"],
      ["ciudad", "Saltillo · Monterrey, MX | Working across LATAM & Europe"],
    ],
    filas: "4 filas",
  },
  experiencia: {
    lineas: [
      { text: "SELECT empresa, rol, periodo", kw: ["SELECT"] },
      { text: "FROM   experiencia", kw: ["FROM"] },
      { text: "ORDER  BY fecha DESC", kw: ["ORDER", "BY", "DESC"] },
      { text: "LIMIT  3;", kw: ["LIMIT"] },
    ],
    resultado: [
      ["FEMSA P&S", "Data & Analytics Product Lead · 2024 → hoy"],
      ["FEMSA Comercio", "Data Manager · 2019 — 2024"],
      ["Raken Data Group", "Data Engineer · 2018 — 2019"],
    ],
    filas: "3 filas",
  },
  enfoque: {
    lineas: [
      { text: "SELECT area, detalle", kw: ["SELECT"] },
      { text: "FROM   enfoque_2026", kw: ["FROM"] },
      { text: "WHERE  impacto = 'alto';", kw: ["WHERE"] },
    ],
    resultado: [
      ["ai_products", "Agentes y GenAI aplicados a procesos de negocio"],
      ["data_strategy", "ROI y casos de negocio de plataformas de datos"],
      ["cloud_analytics", "Snowflake + Databricks a escala retail"],
    ],
    filas: "3 filas",
  },
};

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
  const [tab, setTab] = useState("about_me");
  const [fase, setFase] = useState(0); // 0 nada · 1 query · 2 ejecutando · 3 listo
  const timers = useRef([]);

  const limpiar = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const ejecutar = (instant = false) => {
    limpiar();
    if (
      instant ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setFase(3);
      return;
    }
    setFase(1);
    timers.current.push(setTimeout(() => setFase(2), 1100));
    timers.current.push(setTimeout(() => setFase(3), 1800));
  };

  const cambiarTab = (t) => {
    if (t === tab && fase === 3) return;
    setTab(t);
    setFase(0);
    // pequeño respiro para que el cambio se sienta como nueva ejecución
    limpiar();
    timers.current.push(setTimeout(() => ejecutar(), 60));
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          ejecutar();
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => {
      obs.disconnect();
      limpiar();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = QUERIES[tab];

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

        <div className="jx-sql-tabs" role="tablist" aria-label="Queries">
          {Object.keys(QUERIES).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={`jx-sql-tab ${tab === t ? "is-active" : ""}`}
              onClick={() => cambiarTab(t)}
            >
              {t}.sql
            </button>
          ))}
          <button
            type="button"
            className="jx-sql-run"
            onClick={() => {
              setFase(0);
              limpiar();
              timers.current.push(setTimeout(() => ejecutar(), 60));
            }}
            aria-label="Ejecutar query"
          >
            ▶ Ejecutar
          </button>
        </div>

        <div className="jx-sql-body">
          {q.lineas.map((l, i) => (
            <div
              key={tab + i}
              className="jx-sql-line"
              style={{ transitionDelay: `${i * 220}ms` }}
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
            {fase === 3 && <span className="ok">✓ {q.filas} en 0.42 s</span>}
          </div>

          <div className="jx-sql-result">
            <table>
              <tbody>
                {q.resultado.map(([k, v]) => (
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
