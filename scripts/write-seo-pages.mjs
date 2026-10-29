import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { applySeo, pageUrl, pages, siteOrigin } from "../src/seo.js";

const home = applySeo(readFileSync("dist/index.html", "utf8"), pages.home);
writeFileSync("dist/index.html", home);

const extras = Object.values(pages).filter((page) => page.path !== "/");
for (const page of extras) {
  const html = applySeo(home, page);
  const slug = page.path.replace(/^\//, "");
  mkdirSync(`dist/${slug}`, { recursive: true });
  writeFileSync(`dist/${slug}.html`, html);
  writeFileSync(`dist/${slug}/index.html`, html);
}

const sitemapUrls = [pages.home, ...extras]
  .map(
    (page) => `  <url>
    <loc>${pageUrl(page.path)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page.path === "/" ? "1.0" : page.path === "/price" ? "0.8" : "0.4"}</priority>
  </url>`,
  )
  .join("\n");

writeFileSync(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`,
);

writeFileSync(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`,
);
