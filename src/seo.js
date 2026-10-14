import { useEffect } from "react";

const ORIGIN = "https://anastasiia1002.github.io/ars-vitae";

export const pages = {
  home: {
    title: "ARS VITAE SANCTUM — свідома косметологія у Чернівцях",
    description:
      "Ліцензована медична практика косметології у Чернівцях. Консультації, догляд і онлайн-запис, вул. Героїв Майдану, 55.",
    path: "/",
  },
  price: {
    title: "Прайс-лист — ARS VITAE SANCTUM, Чернівці",
    description:
      "Актуальні ціни послуг ARS VITAE SANCTUM. Оберіть напрям і запишіться онлайн у Чернівцях.",
    path: "/price",
  },
};

export function pageUrl(path) {
  return path === "/" ? `${ORIGIN}/` : `${ORIGIN}${path}`;
}

function setMeta(attribute, key, content) {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href) {
  let tag = document.head.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.rel = "canonical";
    document.head.appendChild(tag);
  }
  tag.href = href;
}

export function usePageMeta({ title, description, path }) {
  useEffect(() => {
    const url = pageUrl(path);
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setCanonical(url);
  }, [title, description, path]);
}
