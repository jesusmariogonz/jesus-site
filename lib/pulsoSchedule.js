/* ============================================================
   Calcula la próxima corrida de cada Routine de Pulso de Mercado,
   a partir de los mismos horarios con los que están programadas
   (ver las Routines "Pulso de Mercado — ..." en Claude Code Remote).
   Todos los horarios son hora de Ciudad de México (UTC-6 fijo, sin
   horario de verano).
   ============================================================ */

const CDMX_OFFSET_HORAS = 6; // CDMX = UTC-6 todo el año

// Construye una fecha en UTC a partir de un momento en hora CDMX.
function desdeCdmx(anio, mes, dia, hora) {
  return new Date(Date.UTC(anio, mes, dia, hora + CDMX_OFFSET_HORAS, 0, 0));
}

function horaCdmxDe(fechaUtc) {
  const d = new Date(fechaUtc.getTime() - CDMX_OFFSET_HORAS * 3600 * 1000);
  return {
    anio: d.getUTCFullYear(),
    mes: d.getUTCMonth(),
    dia: d.getUTCDate(),
    diaSemana: d.getUTCDay(), // 0 = domingo
    hora: d.getUTCHours(),
  };
}

/** Próxima vez (a partir de ahora) que cae un día de la semana + hora dados,
 *  en hora CDMX. diasSemana: array de 0(dom)-6(sab). */
function proximaOcurrenciaSemanal(ahora, diasSemana, horaCdmx) {
  const hoy = horaCdmxDe(ahora);
  for (let offset = 0; offset < 8; offset++) {
    const diaSemana = (hoy.diaSemana + offset) % 7;
    if (!diasSemana.includes(diaSemana)) continue;
    const candidato = desdeCdmx(hoy.anio, hoy.mes, hoy.dia + offset, horaCdmx);
    if (candidato > ahora) return candidato;
  }
  return null;
}

/** Próxima vez que cae el día `diaMes` del mes a la hora `horaCdmx` CDMX. */
function proximaOcurrenciaMensual(ahora, diaMes, horaCdmx) {
  const hoy = horaCdmxDe(ahora);
  let candidato = desdeCdmx(hoy.anio, hoy.mes, diaMes, horaCdmx);
  if (candidato <= ahora) {
    candidato = desdeCdmx(hoy.anio, hoy.mes + 1, diaMes, horaCdmx);
  }
  return candidato;
}

export function proximaCorrida(tipo, ahora = new Date()) {
  switch (tipo) {
    case "daily":
      return proximaOcurrenciaSemanal(ahora, [1, 2, 3, 4, 5], 7);
    case "weeklyReview":
      return proximaOcurrenciaSemanal(ahora, [5], 15);
    case "weeklyOutlook":
      return proximaOcurrenciaSemanal(ahora, [0], 12);
    case "monthly":
      return proximaOcurrenciaMensual(ahora, 1, 7);
    default:
      return null;
  }
}

/** Formatea la próxima corrida en español, ej. "mañana 7:00" o
 *  "vie 26 sep, 15:00". */
export function formatProximaCorrida(fecha) {
  if (!fecha) return null;
  const ahora = new Date();
  const hoy = horaCdmxDe(ahora);
  const objetivo = horaCdmxDe(fecha);
  const horaTxt = String(objetivo.hora).padStart(2, "0") + ":00";

  const esMismoDia =
    hoy.anio === objetivo.anio && hoy.mes === objetivo.mes && hoy.dia === objetivo.dia;
  if (esMismoDia) return `hoy ${horaTxt}`;

  const manana = desdeCdmx(hoy.anio, hoy.mes, hoy.dia + 1, 0);
  const mananaInfo = horaCdmxDe(manana);
  const esManana =
    mananaInfo.anio === objetivo.anio &&
    mananaInfo.mes === objetivo.mes &&
    mananaInfo.dia === objetivo.dia;
  if (esManana) return `mañana ${horaTxt}`;

  const fechaTxt = fecha.toLocaleDateString("es-MX", {
    timeZone: "America/Mexico_City",
    day: "numeric",
    month: "short",
  });
  return `${fechaTxt}, ${horaTxt}`;
}
