export type Reponse = { valeur: number; double: boolean } | null;

/**
 * Proximité de 0 à 100 : 100 % moins l'écart moyen (pondéré) entre la réponse
 * et la position estimée du candidat, sur une échelle de -2 à +2 (écart max 4).
 */
export function proximites<C extends { id: string; nomTri: string }>(
  candidats: C[],
  questions: Record<string, number>[],
  reponses: Reponse[],
) {
  return candidats
    .map((c) => {
      let ecart = 0;
      let max = 0;
      reponses.forEach((r, i) => {
        if (!r) return;
        const poids = r.double ? 2 : 1;
        ecart += poids * Math.abs(r.valeur - questions[i][c.id]);
        max += poids * 4;
      });
      return { ...c, pct: max ? Math.round(100 * (1 - ecart / max)) : 0 };
    })
    .sort((a, b) => b.pct - a.pct || a.nomTri.localeCompare(b.nomTri, "fr"));
}
