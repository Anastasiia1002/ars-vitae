import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { siteOrigin } from "./src/seo.js";

const githubPages = process.env.GITHUB_PAGES === "true";
const base = githubPages ? "/ars-vitae/" : "/";

function redirectBareBase() {
  const bare = base.replace(/\/$/, "");
  return {
    name: "redirect-bare-base",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "/";
        const path = url.split("?")[0];
        if (path === bare) {
          res.statusCode = 302;
          res.setHeader("Location", base + url.slice(path.length));
          res.end();
          return;
        }
        next();
      });
    },
  };
}

function writeSeoPages() {
  return {
    name: "write-seo-pages",
    apply: "build",
    async closeBundle() {
      await import("./scripts/write-seo-pages.mjs");
    },
  };
}

export default defineConfig({
  base,
  define: {
    __SITE_ORIGIN__: JSON.stringify(siteOrigin),
  },
  plugins: [githubPages ? redirectBareBase() : null, react(), tailwindcss(), writeSeoPages()].filter(Boolean),
});
