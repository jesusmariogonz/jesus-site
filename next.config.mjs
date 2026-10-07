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

/** @type {import('next').NextConfig} */
const nextConfig = {
  // El endpoint /api/newsletter/notify lee content/blog en runtime (no en
  // build time), así que hay que decirle a Vercel que incluya esos
  // archivos en el paquete de la función serverless.
  outputFileTracingIncludes: {
    "/api/newsletter/notify": ["./content/blog/**/*"],
  },
};
export default withBotId(nextConfig);
