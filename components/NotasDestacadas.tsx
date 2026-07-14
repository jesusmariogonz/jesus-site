import Link from "next/link";

/* ── Propuesta 4: nota destacada + compactas, pills por categoría ─
   Conecta esto a tu fuente real de posts (markdown). El tipo Nota
   asume lo que ya expones en tu lista de "Últimas notas".          */

export type Nota = {
  slug: string;
  titulo: string;
  resumen: string;
  fecha: string; // ISO
  categoria: string;
  minutos: number; // usa calcularMinutos() de lib/lectura.ts
};

const COLORES: Record<string, string> = {
  Snowflake: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  Databricks: "bg-orange-500/15 text-orange-300 ring-orange-500/30",
  Azure: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
  Fintech: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  Opinión: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
};

function Pill({ categoria }: { categoria: string }) {
  const c =
    COLORES[categoria] ?? "bg-slate-500/15 text-slate-300 ring-slate-500/30";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${c}`}
    >
      {categoria}
    </span>
  );
}

function Meta({ nota }: { nota: Nota }) {
  return (
    <p className="text-xs text-slate-500">
      {new Date(nota.fecha).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}{" "}
      · {nota.minutos} min de lectura
    </p>
  );
}

export default function NotasDestacadas({ notas }: { notas: Nota[] }) {
  if (!notas.length) return null;
  const [principal, ...resto] = notas;

  return (
    <section className="mx-auto mt-16 max-w-4xl px-6">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-slate-100">Últimas notas</h2>
        <Link
          href="/blog"
          className="text-sm text-blue-400 transition hover:text-blue-300"
        >
          Ver todas →
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-5">
        {/* Destacada */}
        <Link
          href={`/blog/${principal.slug}`}
          className="group relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/40 md:col-span-3"
        >
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition group-hover:bg-blue-500/20" />
          <Pill categoria={principal.categoria} />
          <h3 className="mt-3 text-xl font-semibold text-slate-100 group-hover:text-blue-300">
            {principal.titulo}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-slate-400">
            {principal.resumen}
          </p>
          <div className="mt-4">
            <Meta nota={principal} />
          </div>
        </Link>

        {/* Compactas */}
        <div className="flex flex-col gap-5 md:col-span-2">
          {resto.slice(0, 2).map((n) => (
            <Link
              key={n.slug}
              href={`/blog/${n.slug}`}
              className="group flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition duration-300 hover:-translate-y-1 hover:border-slate-600"
            >
              <Pill categoria={n.categoria} />
              <h3 className="mt-2 text-sm font-semibold leading-snug text-slate-200 group-hover:text-blue-300">
                {n.titulo}
              </h3>
              <div className="mt-3">
                <Meta nota={n} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
