import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BadgeCheck, Car, Clock, MapPin } from "lucide-react";
import { images, licenseRows, site } from "../data.js";
import { formatDuration, formatMoney, formatPrice, servicesInCategory } from "../altegio.js";
import { useReveal, useScrollY, useStillMotion } from "../hooks.js";
import BeforeAfter from "../components/BeforeAfter.jsx";
import BookingDialog from "../components/BookingDialog.jsx";
import Dialog from "../components/Dialog.jsx";
import Team from "../components/Team.jsx";
import { useCatalog, useCompany } from "../useAltegio.js";

const approaches = [
  {
    k: "Внутрішнє",
    t: "Гормони, метаболізм, дефіцити",
    d: "Лабораторний скринінг і робота з першопричиною — від щитоподібної залози до інсуліну.",
  },
  {
    k: "Зовнішнє",
    t: "Шкіра як орган",
    d: "Цифрова дерматоскопія, аналіз бар'єру, профілактика новоутворень.",
  },
  {
    k: "Тілесне",
    t: "Нервова система і тонус",
    d: "Краніо-сакральна терапія, EMS, дихальні та відновлювальні практики.",
  },
];

export default function Home() {
  const scrollY = useScrollY();
  useReveal([]);
  useEffect(() => {
    document.title = "ARS VITAE SANCTUM — свідома косметологія у Чернівцях";
  }, []);

  return (
    <main id="content" tabIndex={-1}>
      <Hero scrollY={scrollY} />
      <Approach />
      <Pillars />
      <Team />
      <PriceTeaser />
      <Proof />
      <Location />
    </main>
  );
}

function Hero({ scrollY }) {
  const still = useStillMotion();

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pt-28 pb-28 md:px-10 md:pt-32 lg:pb-16">
      <div className="absolute inset-0 -z-10">
        <img
          src={images.hero}
          alt="Інтер'єр простору ARS VITAE SANCTUM у теплих алебастрових тонах"
          width={1600}
          height={1104}
          className="h-[118%] w-full object-cover"
          style={
            still
              ? { filter: "blur(2px) saturate(1.02)" }
              : {
                  transform: `translateY(${scrollY * -0.12}px) scale(1.06)`,
                  filter: "blur(2px) saturate(1.02)",
                }
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/25" />
        <div className="animate-veil absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
      </div>
      <div className="mx-auto w-full max-w-[1500px]">
        <p className="eyebrow animate-rise">Чернівці · Licensed medical practice</p>
        <h1 className="hero-title mt-5 max-w-full">
          <span className="hero-name animate-rise block">ARS VITAE</span>
          <span className="hero-script animate-rise block" style={{ animationDelay: "0.12s" }}>
            Sanctum
          </span>
        </h1>
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p
            className="animate-rise max-w-md text-sm leading-relaxed text-muted-foreground md:text-base"
            style={{ animationDelay: "0.24s" }}
          >
            Мистецтво свідомої косметології та здоров'я.
            <br />
            Ліцензія МОЗ України.
          </p>
          <div className="animate-rise flex w-full max-w-md flex-col gap-2 sm:max-w-none sm:flex-row sm:flex-wrap" style={{ animationDelay: "0.32s" }}>
            <a
              href="#pillars"
              data-magnetic
              className="glass-panel rounded-full px-5 py-3 text-center text-[11px] tracking-[0.08em] uppercase sm:text-xs"
            >
              Презентація послуг
            </a>
            <Link
              to="/price"
              data-magnetic
              className="glass-panel rounded-full px-5 py-3 text-center text-[11px] tracking-[0.08em] uppercase sm:text-xs"
            >
              Інтерактивний прайс-лист
            </Link>
            <BookingDialog
              trigger={({ onClick }) => (
                <button
                  type="button"
                  onClick={onClick}
                  data-magnetic
                  className="rounded-full bg-primary px-5 py-3 text-[11px] tracking-[0.08em] text-primary-foreground uppercase sm:text-xs"
                >
                  Онлайн-запис
                </button>
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Approach() {
  const [licenseOpen, setLicenseOpen] = useState(false);
  return (
    <section className="mx-auto max-w-[1500px] px-5 py-20 sm:py-24 md:px-10 md:py-36">
      <div className="grid gap-4 md:grid-cols-12 md:gap-5">
        <div className="reveal md:col-span-12 lg:col-span-7">
          <p className="eyebrow">Підхід Sanctum</p>
          <h2 className="mt-4 font-display text-[1.85rem] leading-[1.05] sm:text-5xl md:text-[4.4vw] md:leading-[0.92]">
            Ендокринологія + дерматологія + практики тіла =
            <span className="text-accent italic"> тривала краса</span>
          </h2>
        </div>
        <div className="reveal md:col-span-12 lg:col-span-5 lg:pt-16">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Ми не «закриваємо» симптом кремом чи ін'єкцією. Спершу дивимось на гормональний фон,
            стан шкіри та нервової системи — і лише потім будуємо протокол. Тому результат
            тримається не тижні, а роки.
          </p>
          <button
            type="button"
            data-magnetic
            onClick={() => setLicenseOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent px-4 py-2 text-xs tracking-wide transition-colors duration-500 hover:bg-accent hover:text-accent-foreground"
          >
            <BadgeCheck className="h-4 w-4" strokeWidth={1.5} />
            Ліцензія МОЗ України — перевірити
          </button>
          <Dialog
            open={licenseOpen}
            onClose={() => setLicenseOpen(false)}
            title="Медична ліцензія та кваліфікація"
            description="Практика ведеться відповідно до вимог МОЗ України."
          >
            <dl className="mt-6 space-y-3 text-sm">
              {licenseRows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 border-b border-border pb-2 sm:flex-row sm:justify-between sm:gap-6"
                >
                  <dt className="eyebrow shrink-0">{label}</dt>
                  <dd className="sm:text-right">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Копію ліцензії та дипломи можна переглянути на рецепції або запросити у Direct.
            </p>
          </Dialog>
        </div>
        {approaches.map((item, index) => (
          <div
            key={item.k}
            className={`reveal bento-card bento-card-hover p-6 sm:p-7 md:col-span-6 lg:col-span-4 ${index === 1 ? "bg-secondary" : ""}`}
          >
            <p className="eyebrow">{item.k}</p>
            <h3 className="mt-3 font-display text-2xl">{item.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pillars() {
  const catalog = useCatalog();
  const [active, setActive] = useState(0);
  const scrollerRef = useRef(null);
  const categories = catalog.categories;
  const index = categories.length ? Math.min(active, categories.length - 1) : 0;
  const category = categories[index];
  const items = category ? servicesInCategory(catalog.services, category) : [];
  const preview = items.slice(0, 4);
  const hiddenCount = Math.max(0, items.length - preview.length);
  useReveal([catalog.status, index]);

  useEffect(() => {
    const root = scrollerRef.current;
    const button = root?.querySelector("[data-active='true']");
    if (!root || !button || root.scrollWidth <= root.clientWidth + 8) return;
    const left = button.offsetLeft - (root.clientWidth - button.offsetWidth) / 2;
    root.scrollTo({ left: Math.max(0, left) });
  }, [index, categories.length]);

  return (
    <section id="pillars" className="border-y border-border bg-secondary/40 py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow">Напрями</p>
            <h2 className="mt-3 font-display text-[2.4rem] leading-[0.95] sm:text-6xl md:text-[5vw]">Простір процедур</h2>
          </div>
          <Link
            to="/price"
            data-magnetic
            className="inline-flex items-center gap-2 text-sm underline underline-offset-8"
          >
            Повний прайс <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        {catalog.status === "loading" ? (
          <p className="mt-10 text-sm text-muted-foreground">Завантажуємо актуальні напрями…</p>
        ) : null}
        {catalog.status === "error" ? (
          <p className="mt-10 text-sm text-muted-foreground">
            Не вдалося завантажити напрями. Повний список є в прайсі.
          </p>
        ) : null}
        {category ? (
          <>
            <div ref={scrollerRef} className="chip-scroller chip-wrap reveal mt-8 pb-1 sm:mt-10">
              {categories.map((item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  data-active={itemIndex === index}
                  onClick={() => setActive(itemIndex)}
                  className={`shrink-0 snap-start rounded-full border px-4 py-2.5 text-left text-sm transition-colors ${
                    itemIndex === index
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-accent hover:text-foreground"
                  }`}
                >
                  <span className="mr-2 opacity-60">{String(itemIndex + 1).padStart(2, "0")}</span>
                  {item.title}
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-4 lg:mt-6 lg:grid-cols-12 lg:gap-5">
              <div className="reveal relative h-52 overflow-hidden rounded-[calc(var(--radius)+8px)] border border-border sm:h-64 lg:col-span-5 lg:h-auto lg:min-h-56">
                <img
                  src={index % 2 === 0 ? images.portrait : images.texture}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-x-0 bottom-0 p-5 sm:p-6"
                  style={{ background: "linear-gradient(to top, var(--card), transparent)" }}
                >
                  <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">{category.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{categorySummary(items)}</p>
                </div>
              </div>
              <div className="reveal bento-card flex flex-col lg:col-span-7">
                {preview.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-muted-foreground">У цьому напрямі зараз немає послуг для запису.</p>
                ) : (
                  <ul className="flex flex-1 flex-col">
                    {preview.map((service) => {
                      const duration = formatDuration(service.duration);
                      return (
                        <li key={service.id} className="border-b border-border last:border-b-0">
                          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <h4 className="font-display text-xl leading-snug">{service.title}</h4>
                              {service.comment ? (
                                <p className="mt-1 text-sm text-muted-foreground">{service.comment}</p>
                              ) : null}
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                {duration ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1">
                                    <Clock className="h-3 w-3" /> {duration}
                                  </span>
                                ) : null}
                                <span className="rounded-full border border-border px-3 py-1 whitespace-nowrap">
                                  {formatPrice(service)}
                                </span>
                              </div>
                            </div>
                            <BookingDialog
                              serviceIds={[service.id]}
                              trigger={({ onClick }) => (
                                <button
                                  type="button"
                                  onClick={onClick}
                                  className="min-h-11 w-full shrink-0 rounded-full border border-primary px-5 py-2.5 text-sm transition-colors hover:bg-primary hover:text-primary-foreground sm:w-auto"
                                >
                                  Записатися
                                </button>
                              )}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {hiddenCount > 0 ? (
                  <Link
                    to={`/price?category=${category.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-4 text-sm text-muted-foreground"
                  >
                    Ще {hiddenCount} у цьому напрямі
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

function categorySummary(items) {
  const count = serviceCount(items.length);
  const prices = items
    .map((service) => {
      const min = Number(service.priceMin) || 0;
      const max = Number(service.priceMax) || 0;
      if (min === 0 && max === 0) return null;
      if (max === 0 || min === max) return min || max;
      return Math.min(min, max);
    })
    .filter((value) => value != null);
  if (!prices.length) return `${count} · ціна за запитом`;
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  if (lowest === highest) return `${count} · ${formatMoney(lowest)} ₴`;
  return `${count} · від ${formatMoney(lowest)} ₴`;
}

function serviceCount(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} послуга`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} послуги`;
  return `${count} послуг`;
}

function PriceTeaser() {
  return (
    <section className="mx-auto max-w-[1500px] px-5 py-20 sm:py-24 md:px-10 md:py-32">
      <div className="reveal bento-card bento-wash relative overflow-hidden p-7 sm:p-8 md:p-16">
        <p className="eyebrow">Прайс-лист</p>
        <h2 className="mt-4 max-w-3xl font-display text-[1.85rem] leading-[1.05] sm:text-5xl md:text-[5.2vw] md:leading-[0.9]">
          Зберіть власний комплекс і побачте ціну одразу
        </h2>
        <p className="mt-6 max-w-lg text-sm text-muted-foreground">
          Фільтри за напрямами, пошук і калькулятор візиту з кількох послуг.
        </p>
        <Link
          to="/price"
          data-magnetic
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs tracking-[0.12em] text-primary-foreground uppercase transition-transform duration-500 hover:scale-[1.03]"
        >
          Відкрити прайс <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

const instagramEmbed = "https://www.instagram.com/ars.vitae.sanctum/embed/";

function Proof() {
  return (
    <section className="border-t border-border py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[2.15rem] leading-[0.95] sm:text-6xl md:text-[5vw]">Візуальні докази</h2>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline underline-offset-8"
          >
            @ars.vitae.sanctum
          </a>
        </div>
        <div className="mt-8 grid items-start gap-4 sm:mt-10 md:grid-cols-2 md:gap-5">
          <div className="reveal">
            <BeforeAfter
              before={images.before}
              after={images.after}
              caption="Потягніть повзунок, щоб порівняти фото до і після."
            />
          </div>
          <div className="reveal bento-card">
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Профіль Instagram @ars.vitae.sanctum"
              className="relative block overflow-hidden bg-card"
              style={{ containerType: "inline-size", aspectRatio: "960 / 798" }}
            >
              <iframe
                title="Профіль Instagram @ars.vitae.sanctum"
                src={instagramEmbed}
                scrolling="no"
                tabIndex={-1}
                loading="lazy"
                className="pointer-events-none absolute top-0 left-0 h-[863px] w-[960px] max-w-none origin-top-left border-0"
                style={{ transform: "scale(calc(100cqw / 960px))" }}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Location() {
  const { company } = useCompany();
  const schedule = company?.schedule || "пн–пт: 9:00–19:00 / сб: 9:00–18:00 / нд: вихідний";
  return (
    <section className="mx-auto max-w-[1500px] px-5 pb-20 sm:pb-24 md:px-10 md:pb-32">
      <div className="reveal bento-card grid gap-8 p-6 sm:p-8 md:grid-cols-2 md:p-14">
        <div>
          <p className="eyebrow">Локація</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl md:text-7xl">{site.city}</h2>
          <p className="mt-4 text-sm text-muted-foreground">{site.address}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={site.maps}
              target="_blank"
              rel="noreferrer"
              data-magnetic
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs tracking-wide text-primary-foreground uppercase"
            >
              <MapPin className="h-4 w-4" /> Побудувати маршрут
            </a>
            <BookingDialog
              trigger={({ onClick }) => (
                <button
                  type="button"
                  onClick={onClick}
                  data-magnetic
                  className="rounded-full border border-primary px-5 py-3 text-xs tracking-wide uppercase transition-colors duration-500 hover:bg-primary hover:text-primary-foreground"
                >
                  Записатися
                </button>
              )}
            />
          </div>
        </div>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p className="flex gap-3">
            <Car className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.4} />
            Безкоштовне паркування у внутрішньому дворі; за потреби — місця вздовж вулиці за 80 м від
            входу.
          </p>
          <p className="flex gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.4} />
            {schedule}. Приймаємо за попереднім записом, щоб у просторі була одна людина одночасно.
          </p>
          <p className="flex gap-3">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.4} />
            Перед першим візитом надішлемо коротку анкету здоров'я — це економить час консультації.
          </p>
        </div>
      </div>
    </section>
  );
}
