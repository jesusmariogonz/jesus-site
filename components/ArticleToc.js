"use client";

import { useEffect, useState } from "react";

/* Tabla de contenido automática.
   Lee los subtítulos (h2/h3) del cuerpo ya renderizado, les pone
   un id y arma un índice navegable. Solo aparece si hay 3 o más.
   Ayuda a la lectura y da a Google enlaces de salto (jump links). */

function slugify(txt) {
  return txt
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export default function ArticleToc() {
  const [items, setItems] = useState([]);
  const [abierto, setAbierto] = useState(true);

  useEffect(() => {
    const nodos = Array.from(
      document.querySelectorAll(".prose h2, .prose h3")
    );
    const usados = new Set();
    const lista = nodos.map((el) => {
      let id = el.id || slugify(el.textContent || "");
      let base = id || "seccion";
      let n = 2;
      while (!id || usados.has(id)) id = `${base}-${n++}`;
      usados.add(id);
      el.id = id;
      return { id, texto: el.textContent || "", nivel: el.tagName === "H3" ? 3 : 2 };
    });
    if (lista.length >= 3) setItems(lista);
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="toc" aria-label="Contenido del artículo">
      <button
        type="button"
        className="toc-titulo"
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
      >
        <span>Contenido</span>
        <span className="toc-chevron" aria-hidden>
          {abierto ? "▾" : "▸"}
        </span>
      </button>
      {abierto && (
        <ol className="toc-lista">
          {items.map((it) => (
            <li key={it.id} className={it.nivel === 3 ? "toc-h3" : "toc-h2"}>
              <a href={`#${it.id}`}>{it.texto}</a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
