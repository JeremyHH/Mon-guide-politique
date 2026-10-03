# Règles de rédaction

## Une position

```yaml
positions:
  retraites:
    texte: "Une phrase factuelle, sans adjectif."
    statut: verifie          # ou a_verifier
    source:
      titre: "Programme 2027, p. 12"
      url: "https://…"
      date: 2026-09-14       # date de la déclaration, pas de la consultation
```

- `statut: verifie` exige une source complète, sinon le build échoue.
- Source primaire en priorité : programme, site officiel, discours, interview filmée.
- Pas de déclaration trouvée : `retraites: null` (affiché « Pas de position connue »).
- Même longueur approximative pour tous les candidats sur un même thème.

## Une analyse

Uniquement des évaluations d'organismes nommés, en variant les sensibilités (Cour des comptes, OFCE, Institut Montaigne, Fondation Jean-Jaurès, iFRAP, Terra Nova…).

## Le quiz

Chaque affirmation de `data/quiz.yaml` doit donner une valeur de -2 à +2 pour **chaque** candidat ayant une fiche ; le build échoue sinon. La valeur doit découler des positions sourcées de la fiche.

## Ajouter un candidat

1. Créer `data/candidats/<id>.yaml` (copier une fiche existante).
2. Ajouter `<id>: <valeur>` à chaque question de `data/quiz.yaml`.
3. Le retirer de `data/autres.yaml` s'il y figurait.
