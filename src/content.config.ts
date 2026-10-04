import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const source = z.object({
  titre: z.string().min(3),
  url: z.string().url(),
  date: z.coerce.date(),
});

// Sources des positions reprises d'un programme précédent : au plus un an avant la dernière présidentielle (10 avril 2022).
const SOURCE_ANTERIEURE_MIN = new Date("2021-04-10");

// Une position « verifie » doit obligatoirement citer une source datée.
const position = z
  .object({
    texte: z.string().min(5),
    statut: z.enum(["verifie", "a_verifier"]),
    source: source.optional(),
    // Position reprise d'un programme antérieur (ex. « Présidentielle 2022 »), faute de position actuelle.
    anterieur: z.string().optional(),
  })
  .refine((p) => p.statut !== "verifie" || p.source, {
    message: "Une position vérifiée doit avoir une source (titre, url, date).",
  })
  .refine((p) => !p.anterieur || (p.source && p.source.date >= SOURCE_ANTERIEURE_MIN), {
    message: "Une position reprise d'un programme précédent doit dater d'au plus un an avant la dernière présidentielle (10 avril 2021).",
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
    statut: z.enum(["declare", "primaire", "pressenti", "parrainages_valides", "retire"]),
    declaration: z.coerce.date().optional(),
    bio: z.string(),
    // Investi ou soutenu par un parti disposant d'un groupe à l'Assemblée nationale ou au Sénat,
    // ou d'élus au Parlement européen (voir la page Méthode). Sert uniquement à grouper les cartes.
    representation: z.boolean().default(false),
    // Site officiel : de campagne si possible, sinon du parti ou du mouvement qui soutient la candidature.
    site: z.object({ url: z.string().url(), type: z.enum(["campagne", "parti", "mouvement"]) }).optional(),
    // Clés = identifiants des thèmes de l'élection (vérifié dans src/lib/data.ts).
    positions: z.record(z.string(), position.nullable()),
    analyses: z.array(z.object({ titre: z.string(), resume: z.string(), source })).default([]),
    // Profil
    naissance: z.object({ date: z.coerce.date(), lieu: z.string() }).optional(),
    biographie: z.string().optional(),
    fonctions: z.array(z.object({ intitule: z.string(), periode: z.string() })).default([]),
    resultats: z.array(z.object({ annee: z.number(), scrutin: z.string(), resultat: z.string() })).default([]),
    // Condamnations pénales uniquement ; « definitive » = plus aucun recours possible.
    condamnations: z
      .array(
        z.object({
          date: z.string(),
          juridiction: z.string(),
          motif: z.string(),
          peine: z.string(),
          statut: z.enum(["definitive", "non_definitive", "non_precise"]),
          detail: z.string().optional(),
        }),
      )
      .default([]),
    procedures: z.array(z.string()).default([]),
    photo: z
      .object({ fichier: z.string(), auteur: z.string(), licence: z.string(), licenceUrl: z.string().url(), source: z.string().url(), annee: z.number() })
      .optional(),
    campagne: z
      .array(
        z.object({
          date: z.coerce.date(),
          quand: z.string(),
          type: z.enum(["annonce", "designation", "debat", "meeting", "programme", "parti", "justice"]),
          quoi: z.string(),
          source: z.object({ titre: z.string(), url: z.string().url() }),
        }),
      )
      .default([]),
    tournee: z
      .array(
        z.object({
          date: z.coerce.date(),
          quand: z.string(),
          lieu: z.string(),
          type: z.enum(["meeting", "deplacement", "salon", "debat"]),
          quoi: z.string(),
          source: z.object({ titre: z.string(), url: z.string().url() }),
        }),
      )
      .default([]),
    sourcesProfil: z.array(z.object({ titre: z.string(), url: z.string().url() })).default([]),
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
