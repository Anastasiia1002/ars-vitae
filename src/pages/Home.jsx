import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BadgeCheck,
  Car,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  images,
  licenseRows,
  pillars,
  quotes,
  services,
  site,
} from "../data.js";
import { useReveal, useScrollY, useTilt } from "../hooks.js";
import BeforeAfter from "../components/BeforeAfter.jsx";
import BookingDialog from "../components/BookingDialog.jsx";
import Dialog from "../components/Dialog.jsx";

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
    <main>
      <Hero scrollY={scrollY} />
      <Approach />
      <Pillars />
      <PriceTeaser />
      <Proof />
      <Location />
    </main>
  );
}

function Hero({ scrollY }) {
  const [soft, setSoft] = useState(false);
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pt-28 pb-28 md:px-10 md:pt-32 md:pb-16">
      <div className="absolute inset-0 -z-10">
        <img
          src={images.hero}
          alt="Інтер'єр простору ARS VITAE SANCTUM у теплих алебастрових тонах"
          width={1600}
          height={1104}
          className="h-[118%] w-full object-cover transition-[filter] duration-1000"
          style={{
            transform: `translateY(${scrollY * -0.12}px) scale(1.06)`,
            filter: soft ? "blur(16px) saturate(1.05)" : "blur(2px) saturate(1.02)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/25" />
        <div className="animate-veil absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
      </div>
      <div className="mx-auto w-full max-w-[1500px]">
        <p className="eyebrow animate-rise">Чернівці · Licensed medical practice</p>
        <h1 className="mt-5 font-display text-[15vw] leading-[0.82] tracking-[-0.02em] sm:text-[13vw] md:text-[10.5vw]">
          <span className="kinetic-line">
            <span className="animate-rise block">ARS VITAE</span>
          </span>
          <span className="kinetic-line">
            <span className="animate-rise block italic" style={{ animationDelay: "0.12s" }}>
              SANCTUM
            </span>
          </span>
        </h1>
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p
            className="animate-rise max-w-md text-sm leading-relaxed text-muted-foreground md:text-base"
            style={{ animationDelay: "0.24s" }}
          >
            Мистецтво свідомої косметології та здоров'я.
            <br />
            Ліцензія МОЗ України.
          </p>
          <div className="animate-rise flex flex-wrap gap-2" style={{ animationDelay: "0.32s" }}>
            <a
              href="#pillars"
              data-magnetic
              className="glass-panel rounded-full px-5 py-3 text-xs tracking-[0.1em] uppercase"
            >
              Презентація послуг
            </a>
            <Link
              to="/price"
              data-magnetic
              className="glass-panel rounded-full px-5 py-3 text-xs tracking-[0.1em] uppercase"
            >
              Інтерактивний прайс-лист
            </Link>
            <BookingDialog
              trigger={({ onClick }) => (
                <button
                  type="button"
                  onClick={onClick}
                  data-magnetic
                  className="rounded-full bg-primary px-5 py-3 text-xs tracking-[0.1em] text-primary-foreground uppercase transition-transform duration-500 hover:scale-[1.04]"
                >
                  Онлайн-запис
                </button>
              )}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSoft((value) => !value)}
          data-magnetic
          className="mt-8 text-xs tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          {soft ? "чіткий кадр" : "додати м'якості"}
        </button>
      </div>
    </section>
  );
}

function Approach() {
  const [licenseOpen, setLicenseOpen] = useState(false);
  return (
    <section className="mx-auto max-w-[1500px] px-5 py-20 sm:py-24 md:px-10 md:py-36">
      <div className="grid gap-4 md:grid-cols-12 md:gap-5">
        <div className="reveal md:col-span-7">
          <p className="eyebrow">Підхід Sanctum</p>
          <h2 className="mt-4 font-display text-[9vw] leading-[0.92] md:text-[4.4vw]">
            Ендокринологія + дерматологія + практики тіла =
            <span className="text-accent italic"> тривала краса</span>
          </h2>
        </div>
        <div className="reveal md:col-span-5 md:pt-16">
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
            className={`reveal bento-card bento-card-hover p-7 md:col-span-4 ${index === 1 ? "bg-secondary" : ""}`}
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
  const [active, setActive] = useState(0);
  const pillar = pillars[active];
  const items = services.filter((service) => service.index === pillar.index);
  return (
    <section id="pillars" className="border-y border-border bg-secondary/40 py-20 sm:py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">П'ять напрямів</p>
            <h2 className="mt-3 font-display text-[10vw] leading-[0.9] md:text-[5vw]">Простір процедур</h2>
          </div>
          <Link
            to="/price"
            data-magnetic
            className="inline-flex items-center gap-2 text-sm underline underline-offset-8"
          >
            Повний прайс <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="reveal mt-10 flex flex-wrap gap-2 sm:mt-12">
          {pillars.map((item, index) => (
            <button
              key={item.index}
              type="button"
              data-magnetic
              onClick={() => setActive(index)}
              className={`rounded-full border px-4 py-2 text-left text-xs tracking-wide transition-all duration-500 ${
                index === active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-accent hover:text-foreground"
              }`}
            >
              <span className="mr-2 opacity-60">{item.index}</span>
              {item.title}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-12 md:gap-5">
          <TiltCard className="md:col-span-5 md:row-span-2">
            <div className="relative h-full min-h-[280px] overflow-hidden sm:min-h-[320px]">
              <img
                src={active % 2 === 0 ? images.portrait : images.texture}
                alt={pillar.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-x-0 bottom-0 p-6"
                style={{ background: "linear-gradient(to top, var(--card), transparent)" }}
              >
                <p className="eyebrow">{pillar.index}</p>
                <h3 className="mt-1 font-display text-3xl">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground">{pillar.subtitle}</p>
              </div>
            </div>
          </TiltCard>
          <TiltCard className="md:col-span-7">
            <div className="p-7 md:p-10">
              <Sparkles className="h-5 w-5 text-accent" strokeWidth={1.2} />
              <p className="mt-4 font-display text-2xl leading-snug md:text-4xl">{pillar.focus}</p>
            </div>
          </TiltCard>
          {items.map((service) => (
            <TiltCard key={service.id} className="md:col-span-7">
              <div className="flex flex-col gap-5 p-6 sm:p-7 md:flex-row md:items-center md:justify-between">
                <div className="max-w-md">
                  <h4 className="font-display text-2xl">{service.title}</h4>
                  <p className="mt-1 text-sm text-accent">{service.benefit}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1">
                      <Clock className="h-3 w-3" /> {service.duration}
                    </span>
                    <span className="rounded-full border border-border px-3 py-1">Курс: {service.course}</span>
                  </div>
                </div>
                <Link
                  to="/price"
                  data-magnetic
                  className="shrink-0 self-start rounded-full border border-primary px-5 py-3 text-xs tracking-wide uppercase transition-colors duration-500 hover:bg-primary hover:text-primary-foreground md:self-auto"
                >
                  Деталі та прайс
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function TiltCard({ children, className = "" }) {
  const tilt = useTilt();
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className={`reveal bento-card bento-card-hover group ${className}`}
    >
      {children}
    </div>
  );
}

function PriceTeaser() {
  return (
    <section className="mx-auto max-w-[1500px] px-5 py-20 sm:py-24 md:px-10 md:py-32">
      <div className="reveal bento-card bento-wash relative overflow-hidden p-7 sm:p-8 md:p-16">
        <p className="eyebrow">Прайс-лист</p>
        <h2 className="mt-4 max-w-3xl font-display text-[10vw] leading-[0.9] md:text-[5.2vw]">
          Зберіть власний комплекс і побачте ціну одразу
        </h2>
        <p className="mt-6 max-w-lg text-sm text-muted-foreground">
          Фільтри за напрямами, пошук у реальному часі, вартість у гривні та євро й калькулятор
          персонального сету процедур.
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

function Proof() {
  const storyImages = [images.portrait, images.hero, images.texture, images.hero, images.texture, images.portrait];
  return (
    <section className="border-t border-border py-20 sm:py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[10vw] leading-[0.9] md:text-[5vw]">Візуальні докази</h2>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            data-magnetic
            className="text-sm underline underline-offset-8"
          >
            @ars.vitae.sanctum
          </a>
        </div>
        <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-12 md:gap-5">
          <div className="reveal md:col-span-6">
            <BeforeAfter
              before={images.before}
              after={images.after}
              caption="Курс: діагностика шкіри + 6 авторських доглядів + корекція дефіцитів. Фото публікуються лише за письмовою згодою клієнта."
            />
          </div>
          <div className="reveal bento-card md:col-span-6">
            <div className="border-b border-border px-6 py-4">
              <p className="eyebrow">Stories · live</p>
            </div>
            <div className="grid grid-cols-3 gap-px bg-border">
              {storyImages.map((src, index) => (
                <a
                  key={index}
                  href={site.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-square overflow-hidden bg-card"
                >
                  <img
                    src={src}
                    alt="Публікація студії в Instagram"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </a>
              ))}
            </div>
          </div>
          {quotes.map((item) => (
            <blockquote key={item.a} className="reveal bento-card p-6 sm:p-7 md:col-span-4">
              <p className="font-display text-xl leading-snug italic">«{item.q}»</p>
              <footer className="eyebrow mt-4">{item.a}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Location() {
  return (
    <section className="mx-auto max-w-[1500px] px-5 pb-20 sm:pb-24 md:px-10 md:pb-32">
      <div className="reveal bento-card grid gap-8 p-6 sm:p-8 md:grid-cols-2 md:p-14">
        <div>
          <p className="eyebrow">Локація</p>
          <h2 className="mt-3 font-display text-5xl md:text-7xl">{site.city}</h2>
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
            Пн–Сб · 09:00–20:00. Приймаємо лише за попереднім записом, щоб у просторі була одна людина
            одночасно.
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
