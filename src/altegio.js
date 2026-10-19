const LOCATION_ID = 175107;
const PARTNER_TOKEN = "26nc37y8wewgwm6zamg6";
const API = "https://api.alteg.io/api/v1";

const inflight = new Map();

function remember(key, factory) {
  if (!inflight.has(key)) {
    inflight.set(
      key,
      factory().catch((error) => {
        inflight.delete(key);
        throw error;
      }),
    );
  }
  return inflight.get(key);
}

function query(params = {}) {
  const parts = [];
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "" || value === false) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item == null || item === "") continue;
        parts.push(`${key}[]=${encodeURIComponent(item)}`);
      }
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value === true ? 1 : value)}`);
    }
  }
  return parts.length ? `?${parts.join("&")}` : "";
}

function messageFrom(payload) {
  const meta = payload?.meta;
  const fieldError = meta?.errors && Object.values(meta.errors).flat().find(Boolean);
  const raw = String(fieldError || (meta && !Array.isArray(meta) ? meta.message : "") || "");
  if (/email/i.test(raw) && /required|not passed/i.test(raw)) return "Вкажіть email.";
  if (/phone/i.test(raw)) return "Перевірте номер телефону. Потрібен формат +380.";
  if (/past/i.test(raw)) return "Цей час уже минув. Оберіть інше вікно.";
  if (/taken|unavailable|no available/i.test(raw)) return "Цей час щойно зайняли. Оберіть інше вікно.";
  if (/name/i.test(raw) && /missing|required/i.test(raw)) return "Вкажіть ім'я.";
  if (/blacklisted/i.test(raw)) return "За цим номером онлайн-запис недоступний. Напишіть адміністратору.";
  if (raw && raw !== "An error occurred" && /[А-Яа-яІіЇїЄєҐґ]/.test(raw)) return raw;
  return "";
}

async function request(path, { method = "GET", body, fallback } = {}) {
  let response;
  try {
    response = await fetch(`${API}${path}`, {
      method,
      headers: {
        Accept: "application/vnd.api.v2+json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${PARTNER_TOKEN}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Немає з'єднання. Перевірте інтернет і спробуйте ще раз.");
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    const error = new Error(
      messageFrom(payload) || fallback || "Не вдалося отримати дані. Спробуйте ще раз.",
    );
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload?.data;
}

export function fetchBookServices({ staffId, serviceIds, withoutSeances = true } = {}) {
  return request(
    `/book_services/${LOCATION_ID}${query({
      staff_id: staffId || undefined,
      service_ids: serviceIds,
      without_seances: withoutSeances ? 1 : undefined,
    })}`,
    { fallback: "Не вдалося завантажити послуги." },
  );
}

export function fetchCategories() {
  return request(`/service_categories/${LOCATION_ID}`, {
    fallback: "Не вдалося завантажити категорії послуг.",
  });
}

export function fetchServiceDetails() {
  return request(`/services/${LOCATION_ID}`, {
    fallback: "Не вдалося завантажити опис послуг.",
  });
}

export function fetchStaff({ serviceIds } = {}) {
  return request(`/book_staff/${LOCATION_ID}${query({ service_ids: serviceIds })}`, {
    fallback: "Не вдалося завантажити фахівців.",
  });
}

export function fetchDates({ staffId = 0, serviceIds } = {}) {
  return request(
    `/book_dates/${LOCATION_ID}${query({ staff_id: staffId, service_ids: serviceIds })}`,
    { fallback: "Не вдалося завантажити вільні дати." },
  );
}

export function fetchTimes({ staffId = 0, date, serviceIds }) {
  return request(
    `/book_times/${LOCATION_ID}/${staffId}/${date}${query({ service_ids: serviceIds })}`,
    { fallback: "Не вдалося завантажити вільні години." },
  );
}

export function createBooking(payload) {
  return request(`/book_record/${LOCATION_ID}`, {
    method: "POST",
    body: payload,
    fallback: "Не вдалося створити запис. Оберіть інший час або напишіть нам.",
  });
}

export function loadCompany() {
  return remember("company", () =>
    request(`/company/${LOCATION_ID}`, { fallback: "Не вдалося завантажити дані локації." }),
  );
}

export function loadPublicStaff() {
  return remember("staff", () => fetchStaff());
}

export function loadCatalog() {
  return remember("catalog", async () => {
    const [book, categories, details] = await Promise.all([
      fetchBookServices(),
      fetchCategories(),
      fetchServiceDetails(),
    ]);
    const detailById = new Map((details || []).map((item) => [item.id, item]));
    const knownIds = new Set((categories || []).map((item) => item.id));
    const services = (book?.services || [])
      .filter((service) => service.active)
      .map((service) => {
        const detail = detailById.get(service.id);
        const lengths = (detail?.staff || [])
          .map((member) => member.seance_length)
          .filter((value) => value > 0);
        return {
          id: service.id,
          title: service.title,
          categoryId: service.category_id,
          priceMin: Number(service.price_min) || 0,
          priceMax: Number(service.price_max) || 0,
          comment: String(detail?.comment || service.comment || "").trim(),
          duration: lengths.length ? Math.min(...lengths) : null,
          weight: Number(service.weight) || 0,
        };
      })
      .sort((a, b) => b.weight - a.weight || a.title.localeCompare(b.title, "uk"));

    const used = new Set(services.map((service) => service.categoryId));
    const nextCategories = (categories || [])
      .filter((category) => used.has(category.id))
      .map((category) => ({
        id: category.id,
        title: category.title,
        weight: Number(category.weight) || 0,
      }));
    const unknownIds = [...used].filter((id) => !knownIds.has(id));
    if (unknownIds.length) {
      nextCategories.push({
        id: "other",
        title: "Інші послуги",
        weight: -1,
        ids: unknownIds,
      });
    }
    nextCategories.sort((a, b) => b.weight - a.weight || a.title.localeCompare(b.title, "uk"));
    return { services, categories: nextCategories };
  });
}

export function servicesInCategory(services, category) {
  if (!category || category === "all") return services;
  if (category.id === "other") return services.filter((service) => category.ids.includes(service.categoryId));
  return services.filter((service) => service.categoryId === category.id);
}

export function formatDuration(seconds) {
  if (!seconds) return "";
  const minutes = Math.round(Number(seconds) / 60);
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} хв`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} год ${rest} хв` : `${hours} год`;
}

export function priceBounds(service) {
  const min = Number(service?.priceMin) || 0;
  const max = Number(service?.priceMax) || 0;
  if (min === 0 && max === 0) return { kind: "request" };
  if (max === 0 || min === max) return { kind: "fixed", amount: min || max };
  if (min === 0) return { kind: "upto", amount: max };
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return lower === upper ? { kind: "fixed", amount: lower } : { kind: "range", lower, upper };
}

export function formatPrice(service) {
  const bounds = priceBounds(service);
  if (bounds.kind === "request") return "за запитом";
  if (bounds.kind === "fixed") return `${formatMoney(bounds.amount)} ₴`;
  if (bounds.kind === "upto") return `до ${formatMoney(bounds.amount)} ₴`;
  return `${formatMoney(bounds.lower)}–${formatMoney(bounds.upper)} ₴`;
}

export function chargeAmount(service) {
  const bounds = priceBounds(service);
  if (bounds.kind === "request") return null;
  if (bounds.kind === "range") return bounds.lower;
  return bounds.amount;
}

export function formatMoney(value) {
  return Number(value || 0).toLocaleString("uk-UA");
}

export function normalizePhone(input) {
  const trimmed = String(input || "").trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("380")) return `+${digits}`;
  if (digits.startsWith("80") && digits.length >= 11) return `+3${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `+38${digits}`;
  if (digits.length === 9 && !trimmed.startsWith("+")) return `+380${digits}`;
  return `+${digits}`;
}

export function isValidPhone(input) {
  return /^\+380\d{9}$/.test(normalizePhone(input));
}

export function isValidEmail(input) {
  const value = String(input || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
}

export function staffPortrait(member) {
  const candidates = [
    member?.avatar_big,
    member?.image_group?.images?.norm?.path,
    member?.image_group?.images?.origin?.path,
    member?.avatar,
  ];
  return candidates.find((url) => url && !/no-master/.test(url)) || "";
}

export function plainText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function quoteTotal(services) {
  const amounts = services.map(chargeAmount);
  const known = amounts.filter((amount) => amount != null);
  const ranged = services.some((service) => (Number(service.priceMin) || 0) !== (Number(service.priceMax) || 0));
  return {
    sum: known.reduce((total, amount) => total + amount, 0),
    partial: known.length !== services.length || ranged,
    empty: known.length === 0,
  };
}

export function formatQuote(total) {
  if (total.empty) return "за запитом";
  const money = `${formatMoney(total.sum)} ₴`;
  return total.partial ? `від ${money}` : money;
}

export function formatVisit(isoDate, time) {
  if (!isoDate) return time || "";
  const date = new Date(`${isoDate}T12:00:00`);
  const label = date.toLocaleDateString("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return time ? `${label}, ${time}` : label;
}
