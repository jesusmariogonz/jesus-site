import { initBotId } from "botid/client/core";

/* Registra qué rutas necesitan verificación anti-bot invisible.
   Por ahora: las descargas de libros de la Biblioteca. Cuando
   agregues más rutas sensibles (ej. checkout propio, formularios),
   añádelas aquí también. */
initBotId({
  protect: [
    {
      path: "/api/descargar",
      method: "POST",
    },
  ],
});
