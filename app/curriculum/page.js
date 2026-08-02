import { redirect } from "next/navigation";

/* "Sobre mí" y "CV" ahora viven en una sola página (/sobre-mi).
   Este redirect conserva los enlaces/backlinks viejos a /curriculum
   en vez de romperlos con un 404. */
export default function Curriculum() {
  redirect("/sobre-mi");
}
