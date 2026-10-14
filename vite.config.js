import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const base = "/ars-vitae/";

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

const homeTitle = "ARS VITAE SANCTUM — свідома косметологія у Чернівцях";
const homeDescription =
  "Ліцензована медична практика косметології у Чернівцях. Консультації, догляд і онлайн-запис, вул. Героїв Майдану, 55.";
const priceTitle = "Прайс-лист — ARS VITAE SANCTUM, Чернівці";
const priceDescription =
  "Актуальні ціни послуг ARS VITAE SANCTUM. Оберіть напрям і запишіться онлайн у Чернівцях.";
const origin = "https://anastasiia1002.github.io/ars-vitae";

function pricePageHtml() {
  return {
    name: "price-page-html",
    apply: "build",
    writeBundle(options) {
      if (!options.dir) return;
      const indexPath = path.join(options.dir, "index.html");
      const html = fs
        .readFileSync(indexPath, "utf8")
        .replaceAll(homeTitle, priceTitle)
        .replaceAll(homeDescription, priceDescription)
        .replaceAll(`rel="canonical" href="${origin}/"`, `rel="canonical" href="${origin}/price"`)
        .replaceAll(`property="og:url" content="${origin}/"`, `property="og:url" content="${origin}/price"`)
        .replace(
          "</head>",
          `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Головна","item":"${origin}/"},{"@type":"ListItem","position":2,"name":"Прайс-лист","item":"${origin}/price"}]}</script></head>`,
        );
      fs.mkdirSync(path.join(options.dir, "price"), { recursive: true });
      fs.writeFileSync(path.join(options.dir, "price", "index.html"), html);
    },
  };
}

export default defineConfig({
  base,
  plugins: [redirectBareBase(), react(), tailwindcss(), pricePageHtml()],
});
