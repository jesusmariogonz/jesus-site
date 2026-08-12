import Image from "next/image";
import Link from "next/link";
import { AUTHOR } from "@/lib/site";

/* Deja bien claro quién escribió el libro: foto + nombre + link a
   /sobre-mi. Se usa en la página de detalle de cada libro. */

export default function AutorLibro() {
  return (
    <Link href="/sobre-mi" className="lib-autor">
      <Image
        src="/jesus-hero.png"
        alt={AUTHOR.name}
        width={56}
        height={56}
        className="lib-autor-foto"
      />
      <span className="lib-autor-texto">
        <span className="lib-autor-label">Escrito por</span>
        <span className="lib-autor-nombre">{AUTHOR.name}</span>
      </span>
    </Link>
  );
}
