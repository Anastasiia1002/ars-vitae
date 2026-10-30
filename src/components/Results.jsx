import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { resultCases } from "../data.js";
import { useReveal, useStillMotion } from "../hooks.js";

const AUTO_MS = 3000;

function useColumns() {
  const query = "(min-width: 768px)";
  const [columns, setColumns] = useState(() => (window.matchMedia(query).matches ? 3 : 2));

  useEffect(() => {
    const media = window.matchMedia(query);
    const sync = () => setColumns(media.matches ? 3 : 2);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return columns;
}

function useReducedMotion() {
  const still = useStillMotion();
  const [reduce, setReduce] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(media.matches);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return still || reduce;
}

export default function Results() {
  const cases = resultCases.filter((item) => item?.image && item?.procedure);
  const count = cases.length;
  const columns = Math.min(useColumns(), Math.max(count, 1));
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [motion, setMotion] = useState(true);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(() => document.hidden);
  const [inView, setInView] = useState(false);
  const viewport = useRef(null);
  useReveal([count]);

  const loop = count > columns;
  const slides = loop ? [...cases, ...cases.slice(0, columns)] : cases;
  const active = count ? index % count : 0;
  const playing = loop && inView && !paused && !reduce && !hidden;

  useLayoutEffect(() => {
    const root = viewport.current;
    if (!root) return undefined;
    const measure = () => {
      const card = root.querySelector("[data-slide]");
      const track = root.querySelector(".results-track");
      if (!card || !track) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      setStep(card.getBoundingClientRect().width + gap);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [columns, count]);

  useEffect(() => {
    const node = viewport.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [count, columns]);

  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setMotion(true);
      setIndex((current) => (current >= count ? 1 : current + 1));
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [playing, count]);

  useEffect(() => {
    if (motion) return undefined;
    const frame = requestAnimationFrame(() => setMotion(true));
    return () => cancelAnimationFrame(frame);
  }, [motion]);

  useEffect(() => {
    if (index < count) return undefined;
    const timer = window.setTimeout(() => {
      setMotion(false);
      setIndex(0);
    }, motion && !reduce ? 750 : 0);
    return () => window.clearTimeout(timer);
  }, [index, count, motion, reduce]);

  if (!count) return null;

  const next = () => {
    if (index >= count) {
      setMotion(false);
      setIndex(1 % count);
      return;
    }
    setMotion(true);
    setIndex(index + 1);
  };

  const prev = () => {
    if (index % count === 0) {
      setMotion(false);
      setIndex(count - 1);
      return;
    }
    setMotion(true);
    setIndex(index - 1);
  };

  const onKeyDown = (event) => {
    if (!loop) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
  };

  return (
    <section
      id="results"
      className="py-16 sm:py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 max-w-2xl">
            <p className="eyebrow">Результати</p>
            <h2 className="mt-3 font-display text-[2.15rem] leading-[0.95] sm:text-6xl md:text-[5vw]">
              До і після
            </h2>
            <p className="mt-4 max-w-lg text-sm text-muted-foreground">
              На фото — назва процедури.
            </p>
          </div>
          {loop ? (
            <div className="flex items-center gap-2">
              {!reduce ? (
                <button
                  type="button"
                  aria-pressed={paused}
                  aria-label={paused ? "Продовжити прокрутку" : "Зупинити прокрутку"}
                  onClick={() => setPaused((value) => !value)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-accent"
                >
                  {paused ? (
                    <Play className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  ) : (
                    <Pause className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  )}
                </button>
              ) : null}
              <button
                type="button"
                onClick={prev}
                aria-label="Попереднє фото"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-accent"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </button>
              <p className="min-w-14 text-center text-xs tracking-[0.18em] text-muted-foreground tabular-nums">
                {String(active + 1).padStart(2, "0")}
                <span className="mx-1 opacity-40" aria-hidden>
                  /
                </span>
                {String(count).padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={next}
                aria-label="Наступне фото"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-accent"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          ) : null}
        </div>

        <div
          className="reveal mt-8 sm:mt-10"
          role="region"
          aria-roledescription="карусель"
          aria-label="Фото до і після за процедурами"
          onKeyDown={onKeyDown}
        >
          <div ref={viewport} className="overflow-hidden">
            <div
              className={`results-track ${motion ? "" : "is-instant"}`}
              style={{
                "--results-gap": columns > 2 ? "1.25rem" : "0.75rem",
                transform: step ? `translate3d(-${index * step}px, 0, 0)` : undefined,
              }}
            >
              {slides.map((item, itemIndex) => {
                const clone = itemIndex >= count;
                const number = (itemIndex % count) + 1;
                return (
                  <figure
                    key={`${item.id}-${itemIndex}`}
                    data-slide
                    aria-hidden={clone || undefined}
                    className="bento-card shrink-0"
                    style={{
                      width: `calc((100% - ${(columns - 1)} * var(--results-gap)) / ${columns})`,
                    }}
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={clone ? "" : `${item.procedure}: фото до і після, ${number}`}
                        width={1080}
                        height={1080}
                        loading={itemIndex < columns ? "eager" : "lazy"}
                        decoding="async"
                        className="aspect-square w-full object-cover"
                      />
                      <span className="pointer-events-none absolute top-3 left-3 z-10 max-w-[calc(100%-1.5rem)] rounded-full bg-background/88 px-3 py-1.5 text-[13px] leading-snug text-foreground shadow-sm backdrop-blur-md sm:top-4 sm:left-4 sm:px-3.5 sm:text-sm">
                        {item.procedure}
                      </span>
                    </div>
                  </figure>
                );
              })}
            </div>
          </div>
          {loop ? (
            <div className="mt-4 flex flex-wrap justify-center gap-1" role="group" aria-label="Фото">
              {cases.map((item, itemIndex) => {
                const selected = itemIndex === active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`${item.procedure}, фото ${itemIndex + 1}`}
                    aria-current={selected ? "true" : undefined}
                    onClick={() => {
                      setMotion(true);
                      setIndex(itemIndex);
                    }}
                    className="inline-flex h-11 items-center px-1.5"
                  >
                    <span
                      className={`block h-2 rounded-full transition-all ${
                        selected ? "w-8 bg-primary" : "w-2 bg-border"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
