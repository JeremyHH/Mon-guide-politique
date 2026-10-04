import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export type Candidat = CollectionEntry<"candidats">;
export type Election = CollectionEntry<"elections">;
export type Position = Candidat["data"]["positions"][string];

export const nomComplet = (c: Candidat) => `${c.data.prenom} ${c.data.nom}`;
export const slugCandidat = (c: Candidat) => c.id.split("/")[1];

export const parNom = (a: Candidat, b: Candidat) => a.data.nom.localeCompare(b.data.nom, "fr");

export async function elections() {
  return (await getCollection("elections")).sort((a, b) => +a.data.date - +b.data.date);
}

/** Candidats d'une élection, triés par nom. Vérifie que leurs positions portent sur des thèmes connus. */
export async function candidatsDe(election: Election) {
  const themes = new Set(election.data.themes.map((t) => t.id));
  const liste = await getCollection("candidats", (c) => c.id.startsWith(election.id + "/") && c.data.statut !== "retire");
  for (const c of liste) {
    const inconnus = Object.keys(c.data.positions).filter((k) => !themes.has(k));
    if (inconnus.length) throw new Error(`${c.id} : thème(s) inconnu(s) ${inconnus.join(", ")}`);
  }
  return liste.sort(parNom);
}

/** Questions du quiz d'une élection ; chaque question doit positionner chaque candidat. */
export async function quizDe(election: Election, liste: Candidat[]) {
  const entree = await getEntry("quiz", election.id);
  const questions = entree?.data.questions ?? [];
  const themes = new Set(election.data.themes.map((t) => t.id));
  for (const q of questions) {
    if (!themes.has(q.theme)) throw new Error(`Quiz ${election.id}/${q.id} : thème inconnu « ${q.theme} »`);
    const manquants = liste.map(slugCandidat).filter((id) => q.positions[id] === undefined);
    if (manquants.length) throw new Error(`Quiz ${election.id}/${q.id} : position manquante pour ${manquants.join(", ")}`);
  }
  return questions;
}

export async function fiches(rubrique: "institutions" | "voter") {
  return (await getCollection("fiches", (f) => f.data.rubrique === rubrique)).sort((a, b) => a.data.ordre - b.data.ordre);
}

export const STATUTS: Record<Candidat["data"]["statut"], string> = {
  declare: "Déclaré",
  primaire: "Primaire socialiste",
  pressenti: "Pressenti",
  parrainages_valides: "Parrainages validés",
  retire: "Retiré",
};

export const dateFr = (d: Date) =>
  d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/** Préfixe un chemin interne avec la base du site (utile sur GitHub Pages). */
export const lien = (chemin: string) =>
  (import.meta.env.BASE_URL.replace(/\/$/, "") + "/" + chemin.replace(/^\//, "")).replace(/\/$/, "") || "/";

/**
 * Décompte des candidatures déclarées : candidats ayant une fiche (hors retirés)
 * + autres candidatures déclarées (les intentions sans déclaration officielle ne comptent pas).
 */
export async function compteCandidats(election: Election) {
  const liste = await candidatsDe(election);
  const autres = election.data.autres.filter((a) => !/sans déclaration officielle/i.test(a)).length;
  const primaire = liste.filter((c) => c.data.statut === "primaire").length;
  return { suivis: liste.length, primaire, autres, total: liste.length + autres };
}
