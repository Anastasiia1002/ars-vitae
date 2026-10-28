import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { applySeo, pageUrl, pages, siteOrigin } from "../src/seo.js";

const home = applySeo(readFileSync("dist/index.html", "utf8"), pages.home);
writeFileSync("dist/index.html", home);

const price = applySeo(home, pages.price);
mkdirSync("dist/price", { recursive: true });
writeFileSync("dist/price.html", price);
writeFileSync("dist/price/index.html", price);

writeFileSync(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`,
);

writeFileSync(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${pageUrl("/")}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${pageUrl("/price")}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`,
);
