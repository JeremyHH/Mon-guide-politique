// @ts-check
import { defineConfig } from "astro/config";

// SITE et BASE sont fournis par le workflow de déploiement (GitHub Pages).
const base = process.env.BASE || "/";

/** Dans les fiches Markdown, préfixe les liens internes (« /voter/… ») avec la base du site. */
function liensInternes() {
  const prefixe = base.replace(/\/$/, "");
  /** @param {any} node */
  const visiter = (node) => {
    if (node.tagName === "a" && typeof node.properties?.href === "string" && node.properties.href.startsWith("/")) {
      node.properties.href = prefixe + node.properties.href;
    }
    node.children?.forEach(visiter);
  };
  return visiter;
}

export default defineConfig({
  site: process.env.SITE || "http://localhost:4321",
  base,
  trailingSlash: "ignore",
  markdown: { rehypePlugins: [liensInternes] },
});
