// @ts-check
import { defineConfig } from "astro/config";

// SITE et BASE sont fournis par le workflow de déploiement (GitHub Pages).
export default defineConfig({
  site: process.env.SITE || "http://localhost:4321",
  base: process.env.BASE || "/",
  trailingSlash: "ignore",
});
