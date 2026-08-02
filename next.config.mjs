/** @type {import('next').NextConfig} */
const nextConfig = {
  // El endpoint /api/newsletter/notify lee content/blog en runtime (no en
  // build time), así que hay que decirle a Vercel que incluya esos
  // archivos en el paquete de la función serverless.
  outputFileTracingIncludes: {
    "/api/newsletter/notify": ["./content/blog/**/*"],
  },
};
export default nextConfig;
