import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { applySeo, pages } from "../src/seo.js";

const home = applySeo(readFileSync("dist/index.html", "utf8"), pages.home);
writeFileSync("dist/index.html", home);

const price = applySeo(home, pages.price);
mkdirSync("dist/price", { recursive: true });
writeFileSync("dist/price.html", price);
writeFileSync("dist/price/index.html", price);
