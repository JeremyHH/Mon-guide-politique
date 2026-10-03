# Clair 2027

Site de synthèse neutre et sourcée pour l'élection présidentielle française de 2027 : fiches candidats, comparateur par thème et quiz « qui me ressemble ».

Site statique, sans serveur ni base de données : tout le contenu vit dans `data/`, chaque modification est tracée par Git, et le quiz se calcule dans le navigateur (aucune opinion n'est collectée).

## Lancer en local

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # vérifie les données et génère dist/
```

## Où modifier le contenu

| Fichier | Contenu |
|---|---|
| `data/candidats/<id>.yaml` | Une fiche par candidat : bio, statut, positions par thème, analyses |
| `data/autres.yaml` | Candidatures déclarées sans fiche détaillée |
| `data/themes.yaml` | Liste et ordre des thèmes |
| `data/quiz.yaml` | Affirmations du quiz et position estimée de chaque candidat (-2 à +2) |
| `data/calendrier.yaml` | Dates clés |

Le schéma (`src/content.config.ts`) est vérifié à chaque build. Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les règles de rédaction.

## Publication

Chaque push sur `main` lance `.github/workflows/deploy.yml`, qui construit le site et le publie sur GitHub Pages. À activer une fois dans *Settings → Pages → Source : GitHub Actions*.

## État actuel

Les positions sont reprises de la maquette et marquées `statut: a_verifier` : elles n'ont pas encore de source et s'affichent avec un badge « À vérifier ».
