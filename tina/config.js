import { defineConfig } from "tinacms";

// Rama sobre la que el panel hace commits (en Vercel se detecta sola)
const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  "main";

export default defineConfig({
  branch,

  // Credenciales de Tina Cloud (solo necesarias para el panel en producción;
  // en local `npm run dev` funciona sin ellas)
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  // Las imágenes que subas desde el panel se guardan en public/blog
  media: {
    tina: {
      mediaRoot: "blog",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "nota",
        label: "Notas del blog",
        path: "content/blog",
        format: "md",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) =>
              (values?.titulo || "nota")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // quita acentos
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
                .slice(0, 60),
          },
        },
        fields: [
          {
            type: "string",
            name: "titulo",
            label: "Título",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "fecha",
            label: "Fecha de publicación",
            required: true,
            ui: { dateFormat: "YYYY-MM-DD" },
          },
          {
            type: "string",
            name: "categoria",
            label: "Categoría",
            required: true,
            options: [
              { value: "ingenieria-de-datos", label: "Data Engineering" },
              { value: "snowflake", label: "Snowflake" },
              { value: "arquitectura", label: "Data Architecture" },
              { value: "ia", label: "IA & GenAI" },
              { value: "cloud", label: "Cloud" },
              { value: "data-model", label: "Data Model" },
              { value: "business-analytics", label: "Business Analytics" },
              { value: "business", label: "Business" },
              { value: "leadership", label: "Leadership" },
              { value: "geopolitics", label: "Geopolitics" },
              { value: "fintech", label: "Fintech" },
              { value: "opinion", label: "Opinión" },
            ],
          },
          {
            type: "string",
            name: "tags",
            label: "Etiquetas (escribe y presiona Enter)",
            list: true,
            ui: {
              component: "tags",
            },
          },
          {
            type: "string",
            name: "resumen",
            label: "Resumen (1-2 frases que venden la nota)",
            required: true,
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "tesis",
            label: "Mi tesis (frase editorial, opcional — aparece destacada arriba del artículo)",
            ui: { component: "textarea" },
          },
          {
            type: "object",
            name: "datosClave",
            label: "Datos clave / En una mirada (opcional, 3-4 recomendados)",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.valor || "Dato" }),
            },
            fields: [
              {
                type: "string",
                name: "valor",
                label: "Valor (ej. 3.12%)",
                required: true,
              },
              {
                type: "string",
                name: "etiqueta",
                label: "Etiqueta (ej. Inflación anual)",
                required: true,
              },
            ],
          },
          {
            type: "image",
            name: "imagen",
            label: "Imagen de portada (opcional)",
          },
          {
            type: "boolean",
            name: "destacada",
            label: "★ Editor's Pick (solo una nota a la vez)",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Contenido",
            isBody: true,
          },
        ],
      },
    ],
  },
});