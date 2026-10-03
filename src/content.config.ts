import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const THEMES = ["retraites", "immigration", "energie", "fiscalite", "europe", "securite"] as const;

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

const candidats = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./data/candidats" }),
  schema: z.object({
    prenom: z.string(),
    nom: z.string(),
    parti: z.string(),
    statut: z.enum(["declare", "pressenti", "parrainages_valides", "retire"]),
    declaration: z.coerce.date().optional(),
    bio: z.string(),
    positions: z.record(z.enum(THEMES), position.nullable()),
    analyses: z
      .array(z.object({ titre: z.string(), resume: z.string(), source }))
      .default([]),
  }),
});

const themes = defineCollection({
  loader: file("./data/themes.yaml"),
  schema: z.object({ nom: z.string(), ordre: z.number() }),
});

const quiz = defineCollection({
  loader: file("./data/quiz.yaml"),
  schema: z.object({
    theme: z.enum(THEMES),
    affirmation: z.string(),
    // Position estimée de chaque candidat, de -2 (pas du tout d'accord) à +2.
    positions: z.record(z.string(), z.number().int().min(-2).max(2)),
  }),
});

const calendrier = defineCollection({
  loader: file("./data/calendrier.yaml"),
  schema: z.object({ quand: z.string(), quoi: z.string(), date: z.coerce.date() }),
});

const autres = defineCollection({
  loader: file("./data/autres.yaml"),
  schema: z.object({ libelle: z.string() }),
});

export const collections = { candidats, themes, quiz, calendrier, autres };
