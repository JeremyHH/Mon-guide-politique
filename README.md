# Clair

Guide neutre et sourcé de la vie démocratique française : comprendre les institutions, savoir voter, et comparer les candidats à chaque élection (fiches, comparateur par thème, quiz « qui me ressemble »).

Site statique, sans serveur ni base de données : tout le contenu est dans le dépôt, chaque modification est tracée par Git, et le quiz se calcule dans le navigateur (aucune opinion n'est collectée).

## Lancer en local

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # vérifie les données et génère dist/
```

## Où modifier le contenu

| Emplacement | Contenu |
|---|---|
| `src/fiches/institutions/*.md` | Fiches « Les institutions » (Markdown) |
| `src/fiches/voter/*.md` | Fiches « Voter » (Markdown) |
| `data/scrutins.yaml` | Tableau des élections en France (mandat, mode de scrutin, prochaine échéance) |
| `data/elections/<id>/election.yaml` | Une élection suivie : dates, thèmes, calendrier, autres candidatures |
| `data/elections/<id>/candidats/*.yaml` | Une fiche par candidat de cette élection |
| `data/elections/<id>/quiz.yaml` | Affirmations du quiz et position estimée de chaque candidat (-2 à +2) |

Le schéma (`src/content.config.ts`) et des vérifications de cohérence (`src/lib/data.ts`) tournent à chaque build. Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les règles de rédaction.

## Publication

Chaque push sur `main` lance `.github/workflows/deploy.yml`, qui construit le site et le publie sur GitHub Pages. À activer une fois dans *Settings → Pages → Source : GitHub Actions*.

## État actuel

- Fiches institutions et vote : rédigées, à relire.
- Présidentielle 2027 : positions reprises de la maquette, marquées `statut: a_verifier` ; elles s'affichent avec un badge « À vérifier » tant qu'elles n'ont pas de source.
