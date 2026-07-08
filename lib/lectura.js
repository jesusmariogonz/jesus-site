/** Tiempo de lectura estimado a partir del markdown crudo. */
export function calcularMinutos(markdown, ppm = 220) {
  const palabras = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(palabras / ppm));
}
