const ID = /^[A-Za-z0-9_-]{11}$/;

export function youtubeId(value) {
  const raw = String(value ?? "").trim();
  if (ID.test(raw)) return raw;

  let url;
  try {
    url = new URL(raw);
  } catch {
    return "";
  }

  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0] || "";
    return ID.test(id) ? id : "";
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    if (["embed", "shorts", "live", "v"].includes(parts[0]) && ID.test(parts[1] || "")) return parts[1];
    const id = url.searchParams.get("v") || "";
    return ID.test(id) ? id : "";
  }

  return "";
}
