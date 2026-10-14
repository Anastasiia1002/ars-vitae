import { useEffect, useMemo, useState } from "react";
import { Check, Plus, Search, Sparkles } from "lucide-react";
import { formatDuration, formatPrice, formatQuote, quoteTotal, servicesInCategory } from "../altegio.js";
import { useReveal } from "../hooks.js";
import { useCatalog } from "../useAltegio.js";
import BookingDialog from "../components/BookingDialog.jsx";

export default function Price() {
  const catalog = useCatalog();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  useReveal([filter, query, catalog.status]);

  useEffect(() => {
    document.title = "Інтерактивний прайс-лист — ARS VITAE SANCTUM, Чернівці";
  }, []);

  const activeCategory = catalog.categories.find((category) => String(category.id) === String(filter));

  const visible = useMemo(() => {
    const scoped = filter === "all" ? catalog.services : servicesInCategory(catalog.services, activeCategory);
    const needle = query.trim().toLowerCase();
    if (!needle) return scoped;
    return scoped.filter((service) => {
      const category = catalog.categories.find((item) =>
        item.id === "other" ? item.ids.includes(service.categoryId) : item.id === service.categoryId,
      );
      return `${service.title} ${service.comment} ${category?.title || ""}`.toLowerCase().includes(needle);
    });
  }, [catalog.services, catalog.categories, filter, activeCategory, query]);

  const toggle = (id) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <main className="mx-auto max-w-[1500px] px-5 pt-28 pb-16 sm:pt-32 md:px-10 md:pt-44">
      <p className="eyebrow">Прайс-лист · {new Date().getFullYear()}</p>
      <h1 className="mt-4 font-display text-[13vw] leading-[0.86] md:text-[7vw]">
        Прозорі
        <span className="block text-accent italic">умови</span>
      </h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Послуги і ціни підвантажуються з Altegio. Запис одразу займає вільне вікно фахівця.
      </p>

      <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="sticky top-16 z-30 -mx-1 flex flex-col gap-4 bg-background/85 px-1 py-4 backdrop-blur-md sm:top-20">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap">
              <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
                Всі послуги
              </FilterButton>
              {catalog.categories.map((item) => (
                <FilterButton
                  key={item.id}
                  active={String(filter) === String(item.id)}
                  onClick={() => setFilter(item.id)}
                >
                  {item.title}
                </FilterButton>
              ))}
            </div>
            <label className="flex items-center gap-3 border-b border-border pb-2">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.4} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Пошук за назвою або запитом"
                className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>

          {catalog.status === "loading" ? (
            <p className="py-16 text-sm text-muted-foreground">Завантажуємо послуги з Altegio…</p>
          ) : null}
          {catalog.status === "error" ? (
            <p className="py-16 text-sm text-muted-foreground">
              Не вдалося завантажити прайс. Оновіть сторінку або запишіться через кнопку «Запис».
            </p>
          ) : null}

          <ul className="mt-4">
            {visible.map((service) => {
              const category = catalog.categories.find((item) =>
                item.id === "other" ? item.ids.includes(service.categoryId) : item.id === service.categoryId,
              );
              const duration = formatDuration(service.duration);
              return (
                <li
                  key={service.id}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-border py-6 transition-colors hover:bg-secondary/40 sm:gap-4 md:grid-cols-[minmax(0,1fr)_120px_160px_auto] md:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="eyebrow">{category?.title}</span>
                      <h2 className="font-display text-xl md:text-2xl">{service.title}</h2>
                    </div>
                    {service.comment ? (
                      <p className="mt-1 max-w-lg text-sm text-muted-foreground">{service.comment}</p>
                    ) : null}
                    <p className="mt-2 text-xs tracking-wide text-accent md:hidden">
                      {[duration, formatPrice(service)].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="hidden rounded-full border border-border px-3 py-1 text-center text-xs text-muted-foreground md:inline">
                    {duration || "—"}
                  </span>
                  <div className="hidden text-right md:block">
                    <p className="font-display text-2xl tabular-nums">{formatPrice(service)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggle(service.id)}
                      data-magnetic
                      aria-label="Додати в консультаційний сет"
                      aria-pressed={selected.includes(service.id)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-500 ${
                        selected.includes(service.id)
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border text-muted-foreground hover:border-accent hover:text-foreground"
                      }`}
                    >
                      {selected.includes(service.id) ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </button>
                    <BookingDialog
                      serviceIds={[service.id]}
                      trigger={({ onClick }) => (
                        <button
                          type="button"
                          onClick={onClick}
                          data-magnetic
                          className="rounded-full border border-primary px-4 py-2 text-xs tracking-wide transition-colors duration-500 hover:bg-primary hover:text-primary-foreground"
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
          {catalog.status === "ready" && visible.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Нічого не знайдено. Спробуйте інший запит або напишіть нам у Direct.
            </p>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <Calculator services={catalog.services} selected={selected} onToggle={toggle} />
        </aside>
      </div>
    </main>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      data-magnetic
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 text-xs tracking-wide transition-all duration-500 ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:border-accent hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Calculator({ services, selected, onToggle }) {
  const [open, setOpen] = useState(false);
  const chosen = selected.map((id) => services.find((service) => service.id === id)).filter(Boolean);
  const total = quoteTotal(chosen);

  return (
    <div className="bento-card p-6 md:p-9">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="eyebrow">Калькулятор візиту</p>
          <h3 className="mt-2 font-display text-3xl leading-tight md:text-4xl">
            Зберіть візит
            <br />
            з кількох послуг
          </h3>
        </div>
        <Sparkles className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.2} />
      </div>
      {chosen.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Оберіть послуги у прайсі — запишемо їх одним візитом, якщо їх виконує один фахівець.
        </p>
      ) : (
        <ul className="mt-6 space-y-2">
          {chosen.map((service) => (
            <li
              key={service.id}
              className="flex items-center justify-between gap-3 border-b border-border pb-2 text-sm"
            >
              <button
                type="button"
                onClick={() => onToggle(service.id)}
                className="flex items-center gap-2 text-left transition-opacity hover:opacity-60"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
                <span>{service.title}</span>
              </button>
              <span className="shrink-0 text-muted-foreground tabular-nums">{formatPrice(service)}</span>
            </li>
          ))}
        </ul>
      )}
      {chosen.length > 0 ? (
        <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{total.partial ? "Орієнтовно" : "Разом"}</p>
            <p className="font-display text-4xl tabular-nums">{formatQuote(total)}</p>
          </div>
          <BookingDialog
            open={open}
            onOpenChange={setOpen}
            serviceIds={chosen.map((service) => service.id)}
            trigger={({ onClick }) => (
              <button
                type="button"
                onClick={onClick}
                data-magnetic
                className="rounded-full bg-primary px-6 py-3 text-xs font-medium tracking-[0.12em] text-primary-foreground uppercase transition-transform duration-500 hover:scale-[1.04]"
              >
                Записатися на сет
              </button>
            )}
          />
        </div>
      ) : null}
    </div>
  );
}
