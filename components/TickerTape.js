"use client";

import { useEffect, useState } from "react";

export default function TickerTape() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let activo = true;
    async function cargar() {
      try {
        const res = await fetch("/api/mercados/ticker");
        const data = await res.json();
        if (activo) setItems(data.items || []);
      } catch {
        if (activo) setItems([]);
      }
    }
    cargar();
    const id = setInterval(cargar, 60_000);
    return () => {
      activo = false;
      clearInterval(id);
    };
  }, []);

  if (!items || items.every((i) => i.price == null)) return null;

  const disponibles = items.filter((i) => i.price != null);
  // Se duplica la lista para que la animación de scroll sea continua (sin salto).
  const fila = [...disponibles, ...disponibles];

  return (
    <div className="ticker-tape" aria-label="Cotizaciones en vivo (Finnhub)">
      <div className="ticker-tape-track">
        {fila.map((item, i) => (
          <span className="ticker-tape-item" key={`${item.symbol}-${i}`}>
            <strong>{item.name}</strong>
            <span>{item.price.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={item.changePct >= 0 ? "ticker-up" : "ticker-down"}>
              {item.changePct >= 0 ? "+" : ""}
              {item.changePct.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
