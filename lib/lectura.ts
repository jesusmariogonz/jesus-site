/** Tiempo de lectura estimado a partir del markdown crudo. */
export function calcularMinutos(markdown: string, ppm = 220): number {
  const palabras = markdown
    .replace(/```[\s\S]*?```/g, " ") // ignora bloques de código
    .replace(/[#>*_`\[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(palabras / ppm));
}
