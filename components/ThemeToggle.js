"use client";

import { useEffect, useState } from "react";

/* Propuesta 6: modo claro/oscuro (persistente).
   El script anti-flash del layout aplica el tema antes de pintar. */

export default function ThemeToggle() {
  const [dark, setDark] = useState(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  if (dark === null) return <span style={{ width: 36, height: 36 }} />;

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("tema", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <button
      onClick={toggle}
      className="jx-toggle"
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}
