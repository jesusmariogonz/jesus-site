import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: {
    default: "Jesús — Datos & Analítica",
    template: "%s · Jesús — Datos & Analítica",
  },
  description:
    "Notas sobre ingeniería de datos, Snowflake, arquitectura, IA y retail desde Saltillo, México.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <span className="sql-meta">
              © {new Date().getFullYear()} · hecho con Next.js · desplegado en
              Vercel
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
