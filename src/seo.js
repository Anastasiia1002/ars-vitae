const GITHUB_ORIGIN = "https://anastasiia1002.github.io/ars-vitae";
const VERCEL_ORIGIN = "https://ars-vitae.vercel.app";

function resolveOrigin() {
  if (typeof __SITE_ORIGIN__ !== "undefined") return __SITE_ORIGIN__;
  if (typeof process !== "undefined" && process.env) {
    if (process.env.VITE_SITE_ORIGIN) return process.env.VITE_SITE_ORIGIN.replace(/\/$/, "");
    if (process.env.GITHUB_PAGES === "true") return GITHUB_ORIGIN;
  }
  return VERCEL_ORIGIN;
}

export const siteOrigin = resolveOrigin();

const heroImage = `${siteOrigin}/images/hero.jpg`;

export const pages = {
  home: {
    path: "/",
    title: "ARS VITAE SANCTUM — свідома косметологія у Чернівцях",
    description:
      "Ліцензована косметологія у Чернівцях, вул. Героїв Майдану, 55: ендоліфт, EMS, дерматоскопія, масаж, ендокринологія. Запис онлайн.",
  },
  price: {
    path: "/price",
    title: "Прайс-лист — ARS VITAE SANCTUM, Чернівці",
    description:
      "Прайс-лист ARS VITAE SANCTUM у Чернівцях: апаратні процедури, масаж, діагностика шкіри, ендокринологія та естетичні протоколи.",
  },
};

export function pageUrl(path = "/") {
  if (!path || path === "/") return `${siteOrigin}/`;
  return `${siteOrigin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function structuredData(page) {
  const url = pageUrl(page.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["MedicalClinic", "BeautySalon"],
        "@id": `${siteOrigin}/#clinic`,
        name: "ARS VITAE SANCTUM",
        url: `${siteOrigin}/`,
        image: heroImage,
        logo: `${siteOrigin}/images/logo.png`,
        telephone: "+380501398350",
        address: {
          "@type": "PostalAddress",
          streetAddress: "вулиця Героїв Майдану, 55",
          addressLocality: "Чернівці",
          addressCountry: "UA",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 48.272942,
          longitude: 25.9292636,
        },
        hasMap: "https://maps.google.com/?q=48.272942,25.9292636",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "19:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "09:00",
            closes: "18:00",
          },
        ],
        sameAs: [
          "https://instagram.com/ars.vitae.sanctum",
          "https://t.me/alina_naichuk",
          "https://wa.me/380501398350",
        ],
        medicalSpecialty: ["Dermatologic", "Endocrine"],
        areaServed: { "@type": "City", name: "Чернівці" },
      },
      {
        "@type": "WebSite",
        "@id": `${siteOrigin}/#website`,
        url: `${siteOrigin}/`,
        name: "ARS VITAE SANCTUM",
        inLanguage: "uk",
        publisher: { "@id": `${siteOrigin}/#clinic` },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        isPartOf: { "@id": `${siteOrigin}/#website` },
        about: { "@id": `${siteOrigin}/#clinic` },
        inLanguage: "uk",
      },
    ],
  };
}

function replaceMeta(html, attr, key, content) {
  const pattern = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`);
  if (!pattern.test(html)) throw new Error(`missing meta ${attr}=${key}`);
  return html.replace(pattern, `<meta ${attr}="${key}" content="${content}" />`);
}

export function applySeo(html, page) {
  const url = pageUrl(page.path);
  let next = html.replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`);
  next = replaceMeta(next, "name", "description", page.description);
  next = replaceMeta(next, "property", "og:title", page.title);
  next = replaceMeta(next, "property", "og:description", page.description);
  next = replaceMeta(next, "property", "og:url", url);
  next = replaceMeta(next, "property", "og:image", `${siteOrigin}/images/hero.jpg`);
  next = replaceMeta(next, "name", "twitter:title", page.title);
  next = replaceMeta(next, "name", "twitter:description", page.description);
  next = replaceMeta(next, "name", "twitter:image", `${siteOrigin}/images/hero.jpg`);
  if (!/<link rel="canonical" href="[^"]*"\s*\/?>/.test(next)) throw new Error("missing canonical");
  next = next.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`);
  const json = `<script type="application/ld+json" id="structured-data">${JSON.stringify(structuredData(page))}</script>`;
  if (!next.includes('id="structured-data"')) throw new Error("missing structured data");
  next = next.replace(/<script type="application\/ld\+json" id="structured-data">[\s\S]*?<\/script>/, json);
  return next;
}
