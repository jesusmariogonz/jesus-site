import { getPostsListado } from "@/lib/posts";
import { calcularMinutos } from "@/lib/lectura";

import Hero from "@/components/Hero";
import SqlCard from "@/components/SqlCard";
import StatsStrip from "@/components/StatsStrip";
import FeaturedProjects from "@/components/FeaturedProjects";
import PulsoMercadoMini from "@/components/PulsoMercadoMini";
import NotasDestacadas from "@/components/NotasDestacadas";
import CtaContacto from "@/components/CtaContacto";
import Reveal from "@/components/Reveal";

export default function Inicio() {
  const ultimos = getPostsListado()
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      titulo: p.titulo ?? p.title ?? "Sin título",
      resumen: p.resumen ?? p.summary ?? p.description ?? p.excerpt ?? "",
      fecha: p.fecha ?? p.date ?? null,
      imagen: p.imagen ?? null,
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
      <Reveal delay={0.1}>
        <SqlCard />
      </Reveal>
      <Reveal delay={0.05}>
        <StatsStrip />
      </Reveal>
      <Reveal delay={0.05}>
        <FeaturedProjects />
      </Reveal>
      <NotasDestacadas notas={ultimos} />
      <PulsoMercadoMini />
      <Reveal>
        <CtaContacto />
      </Reveal>
    </>
  );
}
