import { withBotId } from "botid/next/config";
import { arreglarPortadasAutomaticamente } from "./scripts/fix-portadas-auto.mjs";

// Corre en cada build de producción (no en `next dev`, para no reescribir
// archivos en cada guardado): si alguna nota trae una foto cruda del banco
// de portadas, la trata automáticamente antes de compilar. Ver
// scripts/fix-portadas-auto.mjs para el porqué.
if (process.env.NODE_ENV === "production") {
  try {
    const { arregladas } = await arreglarPortadasAutomaticamente();
    if (arregladas.length > 0) {
      console.log(`[next.config] Portadas tratadas automáticamente: ${arregladas.join(", ")}`);
    }
  } catch (err) {
    console.log("[next.config] No se pudieron arreglar portadas automáticamente:", err.message || err);
  }
}

// Libros con landing page a medida en /public/<id>/index.html — la
// plantilla genérica en /recursos/<id> sigue existiendo (Next no borra
// rutas dinámicas), así que redirige la URL vieja a la nueva para que
// nadie llegue a la versión sin terminar por un link guardado o viejo.
const LIBROS_CON_LANDING_PROPIA = [
  "el-cerebro-organizacional",
  "ai-solution-architect",
  "control-cognitivo-empresarial",
  "la-analitica-avanzada",
  "gestion-del-tiempo-con-datos",
  "los-primeros-5-minutos-revelan-tu-seniority",
  "el-problema-del-framing",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // El endpoint /api/newsletter/notify lee content/blog en runtime (no en
  // build time), así que hay que decirle a Vercel que incluya esos
  // archivos en el paquete de la función serverless.
  outputFileTracingIncludes: {
    "/api/newsletter/notify": ["./content/blog/**/*"],
  },
  async redirects() {
    return LIBROS_CON_LANDING_PROPIA.map((id) => ({
      source: `/recursos/${id}`,
      destination: `/${id}`,
      permanent: true,
    }));
  },
};
export default withBotId(nextConfig);
