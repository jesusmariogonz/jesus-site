import { getPosts } from "@/lib/posts";
import { calcularMinutos } from "@/lib/lectura";

import Hero from "@/components/Hero";
import SqlCard from "@/components/SqlCard";
import StatsStrip from "@/components/StatsStrip";
import NotasDestacadas from "@/components/NotasDestacadas";
import CtaContacto from "@/components/CtaContacto";

export default function Inicio() {
  // Adaptador: normaliza los campos de tus posts sin importar
  // cómo se llamen en tu markdown (title/titulo, date/fecha, etc.)
  const ultimos = getPosts()
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      titulo: p.titulo ?? p.title ?? "Sin título",
      resumen: p.resumen ?? p.summary ?? p.description ?? p.excerpt ?? "",
      fecha: p.fecha ?? p.date ?? null,
      categoria:
        p.categoria ??
        p.category ??
        (Array.isArray(p.tags) ? p.tags[0] : p.tags) ??
        "Nota",
      minutos:
        p.minutos ??
        (typeof p.content === "string" ? calcularMinutos(p.content) : null),
    }));

  return (
    <>
      <Hero />
      <SqlCard />
      <StatsStrip />
      <NotasDestacadas notas={ultimos} />
      <CtaContacto />
    </>
  );
}
