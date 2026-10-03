import { getCollection, type CollectionEntry } from "astro:content";

export type Candidat = CollectionEntry<"candidats">;

export const nomComplet = (c: Candidat) => `${c.data.prenom} ${c.data.nom}`;

export const parNom = (a: Candidat, b: Candidat) => a.data.nom.localeCompare(b.data.nom, "fr");

export async function candidats() {
  return (await getCollection("candidats", (c) => c.data.statut !== "retire")).sort(parNom);
}

export async function themes() {
  return (await getCollection("themes")).sort((a, b) => a.data.ordre - b.data.ordre);
}

export const STATUTS: Record<Candidat["data"]["statut"], string> = {
  declare: "Déclaré",
  pressenti: "Pressenti",
  parrainages_valides: "Parrainages validés",
  retire: "Retiré",
};

export const dateFr = (d: Date) =>
  d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/** Préfixe un chemin interne avec la base du site (utile sur GitHub Pages). */
export const lien = (chemin: string) =>
  (import.meta.env.BASE_URL.replace(/\/$/, "") + "/" + chemin.replace(/^\//, "")).replace(/\/$/, "") || "/";
