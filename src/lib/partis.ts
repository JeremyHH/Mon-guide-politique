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

/** Sites officiels des partis et mouvements (vérifiés le 4-5 octobre 2026). */
const SITES: Record<string, string> = {
  "Renaissance": "https://parti-renaissance.fr/",
  "Rassemblement national": "https://rassemblementnational.fr/",
  "La France insoumise": "https://lafranceinsoumise.fr/",
  "Horizons": "https://horizonsleparti.fr/",
  "Les Républicains": "https://republicains.fr/",
  "Parti communiste français": "https://www.pcf.fr/",
  "Les Écologistes": "https://lesecologistes.fr/",
  "Reconquête": "https://www.parti-reconquete.fr/",
  "Parti socialiste": "https://parti-socialiste.fr/",
  "Place publique": "https://place-publique.eu/",
  "Gauche républicaine et socialiste": "https://g-r-s.fr/",
  "Lutte ouvrière": "https://www.lutte-ouvriere.org/",
  "Union populaire républicaine": "https://upr.fr/",
  "Génération écologie": "https://www.generationecologie.fr/",
  "Debout la France": "https://www.debout-la-france.fr/",
  "NPA-Révolutionnaires": "https://npa-revolutionnaires.org/",
  "Nouvelle Énergie": "https://www.unenouvelleenergie.fr/",
  "Les Patriotes": "https://les-patriotes.fr/",
  "Debout !": "https://debout.fr/",
  "Solution démocratique": "https://solutiondemocratique.fr/",
  "Équinoxe": "https://parti-equinoxe.fr/",
  "Révolution permanente": "https://www.revolutionpermanente.fr/",
  "Les Ruches": "https://ruches.org/",
  "La France humaine et forte": "https://www.lafrancehumaineetforte.fr/",
  "Nous France": "https://www.nousfrance.fr/",
};

export function siteParti(parti: string): string | undefined {
  return SITES[parti];
}
