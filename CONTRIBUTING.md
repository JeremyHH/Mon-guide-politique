# Règles de rédaction

## Une fiche institutions ou vote

Fichier Markdown dans `src/fiches/institutions/` ou `src/fiches/voter/`, avec un en-tête :

```yaml
---
titre: Le Sénat
resume: Une phrase affichée dans les listes.
rubrique: institutions      # ou voter
ordre: 10                   # position dans la liste
miseAJour: 2026-10-03
sources:                    # au moins une, de préférence officielle
  - { titre: "Sénat", url: "https://www.senat.fr" }
---
```

Décrire les règles en vigueur, sans commenter les réformes souhaitables. Pour un lien vers une autre fiche, écrire le chemin absolu (`/voter/procuration`) : la base du site est ajoutée au build.

## Le calendrier d'une élection

Uniquement les étapes institutionnelles, communes à tous les candidats (décret, inscriptions, parrainages, liste officielle, campagne, scrutins, proclamation, prise de fonction). Pas d'échéance propre à un parti ou à un candidat (primaires, congrès, décisions de justice).

## Ajouter une élection

1. Créer `data/elections/<id>/election.yaml` (copier celui de `presidentielle-2027` et adapter les thèmes).
2. Ajouter les fiches dans `data/elections/<id>/candidats/` et, si besoin, un `quiz.yaml`.
3. Dans `data/scrutins.yaml`, renseigner `election: <id>` sur la ligne du scrutin correspondant.


## Une position de candidat

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

Pour une page de programme non datée (site de campagne), indiquer la date de consultation et l'écrire dans le titre : « (page consultée le 4 octobre 2026) ».

- `statut: verifie` exige une source complète, sinon le build échoue.
- Source primaire en priorité : programme, site officiel, discours, interview filmée.
- Pas de déclaration trouvée : `retraites: null` (affiché « Pas de position connue »).
- Même longueur approximative pour tous les candidats sur un même thème.

## Une analyse

Uniquement des évaluations d'organismes nommés, en variant les sensibilités (Cour des comptes, OFCE, Institut Montaigne, Fondation Jean-Jaurès, iFRAP, Terra Nova…).

## Le quiz

Chaque affirmation de `data/elections/<id>/quiz.yaml` doit donner une valeur de -2 à +2 pour **chaque** candidat ayant une fiche dans cette élection ; le build échoue sinon. Le `theme` doit être un des thèmes de l'élection. La valeur doit découler des positions sourcées de la fiche.

## Ajouter un candidat

1. Créer `data/elections/<election>/candidats/<id>.yaml` (copier une fiche existante). Les clés de `positions` doivent être des thèmes de l'élection.
2. Ajouter `<id>: <valeur>` à chaque question du `quiz.yaml` de l'élection.
3. Le retirer de la liste `autres` de `election.yaml` s'il y figurait.

## Profil d'un candidat

Mêmes rubriques pour tous : `naissance`, `biographie` (formation, métier, parcours partisan ; pas de vie privée), `fonctions`, `resultats` (élections publiques uniquement, pas les votes internes aux partis), `condamnations`, `procedures`, `sourcesProfil`.

- `condamnations` : condamnations **pénales** uniquement (ni relaxes, ni litiges civils), avec la juridiction, la peine et le statut : `definitive` (plus de recours possible), `non_definitive` (appel ou cassation en cours) ou `non_precise`.
- `procedures` : enquêtes ou instructions publiques visant nommément le candidat, rédigées en rappelant la présomption d'innocence.
- Sans condamnation, laisser `condamnations: []` : la fiche affiche « Aucune condamnation pénale connue ».

## Photos des candidats

Uniquement des images sous licence libre (Wikimedia Commons : CC0, CC BY, CC BY-SA), enregistrées dans `public/candidats/<id>.jpg`, recadrées en 3:4 (360 × 480 px). Renseigner le bloc `photo` (auteur, licence, lien de la licence, page Commons, année) : le crédit est affiché sous le portrait, comme l'exigent les licences CC BY et CC BY-SA. Préférer, pour chaque candidat, un portrait récent et posé, de cadrage comparable aux autres.

## Positions issues d'un programme précédent

Si un candidat déjà candidat à une présidentielle n'a pas de position 2027 sur un thème, on peut reprendre celle de son dernier programme présidentiel : ajouter `anterieur: "Présidentielle 2022"` (ou l'année concernée) à la position, avec une source de l'époque (programme officiel, profession de foi, article daté de la campagne). Le site affiche alors l'étiquette « Programme présidentielle 2022 ». Remplacer la position dès qu'une position 2027 sourcée existe.
