import { useEffect } from "react";
import { pageUrl, structuredData } from "../seo.js";

function setMeta(attr, key, content) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function Seo({ page }) {
  useEffect(() => {
    const url = pageUrl(page.path);
    document.title = page.title;
    setMeta("name", "description", page.description);
    setMeta("property", "og:title", page.title);
    setMeta("property", "og:description", page.description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", page.title);
    setMeta("name", "twitter:description", page.description);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
    const json = document.getElementById("structured-data");
    if (json) json.textContent = JSON.stringify(structuredData(page));
  }, [page]);

  return null;
}
