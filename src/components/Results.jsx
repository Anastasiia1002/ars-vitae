import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resultCases } from "../data.js";
import { useReveal } from "../hooks.js";
import BeforeAfter from "./BeforeAfter.jsx";

const hint = "Потягніть повзунок, щоб порівняти фото до і після.";

export default function Results() {
  const cases = resultCases.filter((item) => item?.before && item?.after && item?.procedure);
  const count = cases.length;
  const [index, setIndex] = useState(0);
  const safeIndex = count ? Math.min(index, count - 1) : 0;
  useReveal([count]);

  if (!count) return null;

  const go = (next) => setIndex((next + count) % count);

  const onKeyDown = (event) => {
    if (count < 2) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(safeIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(safeIndex - 1);
    }
  };

  const current = cases[safeIndex];

  return (
    <section id="results" className="border-t border-border py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 max-w-2xl">
            <p className="eyebrow">Результати</p>
            <h2 className="mt-3 font-display text-[2.15rem] leading-[0.95] sm:text-6xl md:text-[5vw]">
              До і після
            </h2>
            <p className="mt-4 max-w-lg text-sm text-muted-foreground">
              На фото — назва процедури. Потягніть повзунок, щоб побачити різницю.
            </p>
          </div>
          {count > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(safeIndex - 1)}
                aria-label="Попередня процедура"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-accent"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </button>
              <p className="min-w-14 text-center text-xs tracking-[0.18em] text-muted-foreground tabular-nums">
                {String(safeIndex + 1).padStart(2, "0")}
                <span className="mx-1 opacity-40" aria-hidden>
                  /
                </span>
                {String(count).padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={() => go(safeIndex + 1)}
                aria-label="Наступна процедура"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-accent"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          ) : null}
        </div>

        <div
          className="reveal mx-auto mt-8 max-w-4xl sm:mt-10"
          role="region"
          aria-roledescription="карусель"
          aria-label="Фото до і після за процедурами"
          onKeyDown={onKeyDown}
        >
          <p className="sr-only" aria-live="polite">
            {current.procedure}. Фото {safeIndex + 1} з {count}.
          </p>
          <div className="overflow-hidden rounded-[calc(var(--radius)+8px)]">
            <div
              className="results-track"
              style={{ transform: `translate3d(-${safeIndex * 100}%, 0, 0)` }}
            >
              {cases.map((item, itemIndex) => {
                const active = itemIndex === safeIndex;
                return (
                  <div key={item.id} className="w-full shrink-0" inert={active ? undefined : true}>
                    <BeforeAfter
                      before={item.before}
                      after={item.after}
                      procedure={item.procedure}
                      caption={hint}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {count > 1 ? (
            <div className="mt-4 flex flex-wrap justify-center gap-1" role="group" aria-label="Процедури">
              {cases.map((item, itemIndex) => {
                const active = itemIndex === safeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={item.procedure}
                    aria-current={active ? "true" : undefined}
                    onClick={() => setIndex(itemIndex)}
                    className="inline-flex h-11 items-center px-1.5"
                  >
                    <span
                      className={`block h-2 rounded-full transition-all ${
                        active ? "w-8 bg-primary" : "w-2 bg-border"
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
