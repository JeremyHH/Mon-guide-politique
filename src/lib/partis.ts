import logos from "../../data/partis-logos.json";

/** Logos des partis (Wikimedia Commons, statut libre), indexés par nom de parti tel qu'écrit dans les fiches. */
export type LogoParti = { fichier: string; source: string; licence: string; auteur: string };

const PARTIS: Record<string, string> = {
  "Renaissance": "renaissance",
  "Rassemblement national": "rn",
  "La France insoumise": "lfi",
  "Horizons": "horizons",
  "Les Républicains": "lr",
  "Parti communiste français": "pcf",
  "Les Écologistes": "ecologistes",
  "Reconquête": "reconquete",
  "Parti socialiste": "ps",
  "Place publique": "place-publique",
  "Gauche républicaine et socialiste": "grs",
  "Lutte ouvrière": "lo",
  "Union populaire républicaine": "upr",
  "Génération écologie": "ge",
  "Debout la France": "dlf",
  "NPA-Révolutionnaires": "npa-r",
  "Nouvelle Énergie": "nouvelle-energie",
  "Les Patriotes": "patriotes",
  "Debout !": "debout",
  "Solution démocratique": "solution-democratique",
  "Équinoxe": "equinoxe",
  "Révolution permanente": "revolution-permanente",
  "Les Ruches": "ruches",
  "France Libre": "france-libre",
  "La France humaine et forte": "fhf",
  "Nous France": "nous-france",
  "Union démocratique bretonne": "udb",
};

export function logoParti(parti: string): LogoParti | undefined {
  const slug = PARTIS[parti];
  return slug ? (logos as Record<string, LogoParti>)[slug] : undefined;
}
