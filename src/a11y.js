export const A11Y_STORAGE_KEY = "ars-vitae-a11y";

export const defaultA11y = {
  scale: 100,
  contrast: "default",
  readable: false,
  links: false,
  spacing: false,
  motion: false,
  cursor: false,
  hideImages: false,
};

const SCALES = new Set([100, 115, 130, 150]);
const CONTRASTS = new Set(["default", "light", "dark", "yellow"]);
const FLAGS = ["readable", "links", "spacing", "motion", "cursor", "hideImages"];

function sanitize(raw) {
  const prefs = { ...defaultA11y };
  if (!raw || typeof raw !== "object") return prefs;
  if (SCALES.has(raw.scale)) prefs.scale = raw.scale;
  if (CONTRASTS.has(raw.contrast)) prefs.contrast = raw.contrast;
  for (const key of FLAGS) {
    if (typeof raw[key] === "boolean") prefs[key] = raw[key];
  }
  return prefs;
}

function setData(name, value) {
  if (value == null) delete document.documentElement.dataset[name];
  else document.documentElement.dataset[name] = value;
}

export function readA11y() {
  try {
    return sanitize(JSON.parse(localStorage.getItem(A11Y_STORAGE_KEY) || "null"));
  } catch {
    return { ...defaultA11y };
  }
}

export function applyA11y(prefs) {
  const next = sanitize(prefs);
  const root = document.documentElement;
  setData("a11yScale", next.scale === 100 ? null : String(next.scale));
  setData("a11yContrast", next.contrast === "default" ? null : next.contrast);
  setData("a11yReadable", next.readable ? "on" : null);
  setData("a11yLinks", next.links ? "on" : null);
  setData("a11ySpacing", next.spacing ? "on" : null);
  setData("a11yMotion", next.motion ? "off" : null);
  setData("a11yCursor", next.cursor ? "large" : null);
  setData("a11yImages", next.hideImages ? "off" : null);
  return next;
}

export function writeA11y(prefs) {
  const next = applyA11y(prefs);
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Private mode or a full storage quota still keeps the current visit. */
  }
  window.dispatchEvent(new Event("sanctum-a11y"));
  return next;
}
