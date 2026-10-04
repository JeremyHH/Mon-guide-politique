import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const source = z.object({
  titre: z.string().min(3),
  url: z.string().url(),
  date: z.coerce.date(),
});

// Une position « verifie » doit obligatoirement citer une source datée.
const position = z
  .object({
    texte: z.string().min(5),
    statut: z.enum(["verifie", "a_verifier"]),
    source: source.optional(),
  })
  .refine((p) => p.statut !== "verifie" || p.source, {
    message: "Une position vérifiée doit avoir une source (titre, url, date).",
  });

/* ---------- Élections : un dossier par scrutin dans data/elections/<id>/ ---------- */

const elections = defineCollection({
  loader: glob({
    pattern: "*/election.yaml",
    base: "./data/elections",
    generateId: ({ entry }) => entry.split("/")[0],
  }),
  schema: z.object({
    nom: z.string(),
    menu: z.string().optional(),
    type: z.enum(["presidentielle", "legislatives", "senatoriales", "municipales", "departementales", "regionales", "europeennes", "referendum"]),
    date: z.coerce.date(),
    libelleDate: z.string(),
    resume: z.string(),
    miseAJour: z.coerce.date(),
    introCandidats: z.string(),
    themes: z.array(z.object({ id: z.string(), nom: z.string() })).min(1),
    calendrier: z
      .array(
        z.object({
          date: z.coerce.date(),
          quand: z.string(),
          quoi: z.string(),
          phase: z.enum(["candidatures", "campagne", "vote", "apres"]).default("candidatures"),
          indicatif: z.boolean().default(false),
        }),
      )
      .default([]),
    sourcesCalendrier: z.array(z.object({ titre: z.string(), url: z.string().url() })).default([]),
    autres: z.array(z.string()).default([]),
  }),
});

// id = "<election>/<candidat>", ex. "presidentielle-2027/attal".
const candidats = defineCollection({
  loader: glob({
    pattern: "*/candidats/*.yaml",
    base: "./data/elections",
    generateId: ({ entry }) => entry.replace("/candidats/", "/").replace(/\.yaml$/, ""),
  }),
  schema: z.object({
    prenom: z.string(),
    nom: z.string(),
    parti: z.string(),
    statut: z.enum(["declare", "pressenti", "parrainages_valides", "retire"]),
    declaration: z.coerce.date().optional(),
    bio: z.string(),
    // Clés = identifiants des thèmes de l'élection (vérifié dans src/lib/data.ts).
    positions: z.record(z.string(), position.nullable()),
    analyses: z.array(z.object({ titre: z.string(), resume: z.string(), source })).default([]),
  }),
});

const quiz = defineCollection({
  loader: glob({
    pattern: "*/quiz.yaml",
    base: "./data/elections",
    generateId: ({ entry }) => entry.split("/")[0],
  }),
  schema: z.object({
    questions: z.array(
      z.object({
        id: z.string(),
        theme: z.string(),
        affirmation: z.string(),
        // Position estimée de chaque candidat, de -2 (pas du tout d'accord) à +2.
        positions: z.record(z.string(), z.number().int().min(-2).max(2)),
      }),
    ),
  }),
});

const scrutins = defineCollection({
  loader: file("./data/scrutins.yaml"),
  schema: z.object({
    nom: z.string(),
    elu: z.string(),
    duree: z.string(),
    mode: z.string(),
    prochaine: z.string(),
    election: z.string().optional(),
  }),
});

/* ---------- Fiches pédagogiques (Markdown) ---------- */

const fiches = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/fiches" }),
  schema: z.object({
    titre: z.string(),
    resume: z.string(),
    rubrique: z.enum(["institutions", "voter"]),
    ordre: z.number(),
    miseAJour: z.coerce.date(),
    sources: z.array(z.object({ titre: z.string(), url: z.string().url() })).min(1),
  }),
});

export const collections = { elections, candidats, quiz, scrutins, fiches };
