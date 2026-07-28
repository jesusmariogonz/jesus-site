"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import NotaCover from "@/components/NotaCover";

/* ============================================================
   Explorador del blog (buscador + filtro por categoría)
   ------------------------------------------------------------
   - Caja de búsqueda por palabras: filtra por título, resumen,
     categoría, etiquetas y un fragmento del contenido. Ignora
     acentos y mayúsculas.
   - Chips de categoría que filtran en la misma página.
   - Sin búsqueda ni filtro: muestra el "Editor's Pick" grande
     y el resto en cuadrícula (como antes).
   - Con búsqueda/filtro: cuadrícula de resultados + contador.

   Se renderiza también en el servidor con el estado inicial
   (todas las notas visibles), así que Google ve todos los
   enlaces en el HTML: no perjudica el SEO.
   ============================================================ */

function sinAcentos(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function NotaCard({ nota }) {
  return (
    <li className="post-card post-card-editorial">
      <Link href={`/blog/${nota.slug}`} className="post-card-link">
        <NotaCover categoria={nota.categoria} imagen={nota.imagen} size="md" />
        <div className="post-card-body">
          <span className="post-card-cat">{nota.categoriaNombre}</span>
          <h3>{nota.titulo}</h3>
          {nota.resumen && <p>{nota.resumen}</p>}
          <span className="post-card-meta">
            {nota.minutos} min de lectura <span className="jx-flecha">→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}

export default function BlogExplorer({ notas = [], pickSlug, categorias = [] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("todas");

  // Solo categorías que tienen al menos una nota (evita chips vacíos).
  const categoriasConNotas = useMemo(() => {
    const usadas = new Set(notas.map((n) => n.categoria));
    return categorias.filter(([slug]) => usadas.has(slug));
  }, [notas, categorias]);

  const query = sinAcentos(q.trim());
  const buscando = query.length > 0 || cat !== "todas";

  const resultados = useMemo(() => {
    return notas.filter((n) => {
      const okCat = cat === "todas" || n.categoria === cat;
      const okQuery = query === "" || n.buscar.includes(query);
      return okCat && okQuery;
    });
  }, [notas, cat, query]);

  const pick = notas.find((n) => n.slug === pickSlug) || notas[0];
  const resto = notas.filter((n) => n.slug !== pick?.slug);

  return (
    <>
      <div className="buscador">
        <span className="buscador-icono" aria-hidden>
          ⌕
        </span>
        <input
          type="search"
          className="buscador-input"
          placeholder="Buscar notas por palabra clave…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar notas"
        />
        {q && (
          <button
            type="button"
            className="buscador-limpiar"
            onClick={() => setQ("")}
            aria-label="Limpiar búsqueda"
          >
            ×
          </button>
        )}
      </div>

      <div className="chip-row">
        <button
          type="button"
          className={cat === "todas" ? "chip active" : "chip"}
          onClick={() => setCat("todas")}
        >
          Todas
        </button>
        {categoriasConNotas.map(([slug, nombre]) => (
          <button
            key={slug}
            type="button"
            className={cat === slug ? "chip active" : "chip"}
            onClick={() => setCat(slug)}
          >
            {nombre}
          </button>
        ))}
      </div>

      {buscando ? (
        <>
          <p className="buscador-conteo" aria-live="polite">
            {resultados.length}{" "}
            {resultados.length === 1 ? "nota encontrada" : "notas encontradas"}
            {q && (
              <>
                {" "}
                para <strong>“{q}”</strong>
              </>
            )}
          </p>
          {resultados.length === 0 ? (
            <div className="buscador-vacio">
              <p>No hay notas que coincidan con tu búsqueda.</p>
              <button
                type="button"
                className="btn ghost btn-sm"
                onClick={() => {
                  setQ("");
                  setCat("todas");
                }}
              >
                Ver todas las notas
              </button>
            </div>
          ) : (
            <ul className="post-list post-list-editorial">
              {resultados.map((nota) => (
                <NotaCard key={nota.slug} nota={nota} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          {pick && (
            <Link href={`/blog/${pick.slug}`} className="editors-pick">
              <NotaCover
                categoria={pick.categoria}
                imagen={pick.imagen}
                size="pick"
              />
              <div className="editors-pick-body">
                <span className="editors-pick-badge">★ Editor's Pick</span>
                <h3>{pick.titulo}</h3>
                {pick.resumen && <p>{pick.resumen}</p>}
                <span className="post-card-meta">
                  {pick.categoriaNombre} · {pick.minutos} min de lectura{" "}
                  <span className="jx-flecha">→</span>
                </span>
              </div>
            </Link>
          )}
          <ul className="post-list post-list-editorial">
            {resto.map((nota) => (
              <NotaCard key={nota.slug} nota={nota} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}
