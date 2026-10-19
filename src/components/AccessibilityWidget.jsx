import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Accessibility, RotateCcw, X } from "lucide-react";
import { A11Y_STORAGE_KEY, applyA11y, defaultA11y, readA11y, writeA11y } from "../a11y.js";

const SCALES = [
  { value: 100, label: "Звичайний", mark: 14 },
  { value: 115, label: "Середній", mark: 20 },
  { value: 130, label: "Великий", mark: 28 },
  { value: 150, label: "Дуже великий", mark: 36 },
];

const CONTRASTS = [
  { value: "default", label: "Звичайна", className: "bg-[#f7f4ee] text-[#2c2a28] border-[#cfc6b8]" },
  { value: "light", label: "Чорним по білому", className: "bg-white text-black border-black" },
  { value: "dark", label: "Білим по чорному", className: "bg-black text-white border-white" },
  { value: "yellow", label: "Синім по жовтому", className: "bg-[#fff36b] text-[#062a9a] border-[#062a9a]" },
];

const TOGGLES = [
  { key: "readable", label: "Зручний шрифт", hint: "Без декоративних накреслень" },
  { key: "links", label: "Підкреслити посилання", hint: "Так легше відрізнити їх від тексту" },
  { key: "spacing", label: "Збільшити інтервали", hint: "Більше повітря між рядками і літерами" },
  { key: "motion", label: "Зупинити анімацію", hint: "Без руху, паралаксу і плавної прокрутки" },
  { key: "cursor", label: "Великий курсор", hint: "Помітніший вказівник миші" },
  { key: "hideImages", label: "Приховати зображення", hint: "Лишаються текст і кнопки" },
];

export default function AccessibilityWidget({ onOpen }) {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(readA11y);
  const [message, setMessage] = useState("");
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== A11Y_STORAGE_KEY) return;
      setPrefs(applyA11y(readA11y()));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.focus({ preventScroll: true });
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onPointer = (event) => {
      const target = event.target;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const commit = (patch, announcement) => {
    const next = writeA11y({ ...prefsRef.current, ...patch });
    prefsRef.current = next;
    setPrefs(next);
    setMessage(announcement);
  };

  const reset = () => {
    const next = writeA11y(defaultA11y);
    prefsRef.current = next;
    setPrefs(next);
    setMessage("Налаштування доступності скинуто");
  };

  const scaleLabel = SCALES.find((item) => item.value === prefs.scale)?.label ?? "Звичайний";
  const contrastLabel = CONTRASTS.find((item) => item.value === prefs.contrast)?.label ?? "Звичайна";

  const panel = open
    ? createPortal(
        <section
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="a11y-panel fixed top-[4.75rem] right-3 z-[70] max-h-[calc(100svh-10.5rem)] w-[min(22.5rem,calc(100vw-1.5rem))] overflow-y-auto rounded-3xl border border-border bg-card p-4 text-foreground shadow-[var(--shadow-lift)] outline-none sm:p-5 md:max-h-[calc(100svh-7rem)] lg:top-[5.5rem] lg:right-10"
        >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id={titleId} className="font-display text-3xl leading-none font-normal">
                  Доступність
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Вигляд сайту можна підлаштувати під себе.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border"
                aria-label="Закрити налаштування доступності"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="mt-5" role="group" aria-label="Розмір тексту">
              <p className="text-sm font-medium">Розмір тексту</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {SCALES.map((item) => {
                  const active = prefs.scale === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      aria-pressed={active}
                      aria-label={item.label}
                      onClick={() => commit({ scale: item.value }, `Розмір тексту: ${item.label.toLowerCase()}`)}
                      className={`flex h-12 items-center justify-center rounded-2xl border ${
                        active ? "border-foreground bg-secondary" : "border-border bg-card"
                      }`}
                    >
                      <span aria-hidden style={{ fontSize: item.mark }} className="leading-none font-medium">
                        A
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{scaleLabel}</p>
            </div>

            <div className="mt-5" role="group" aria-label="Контраст">
              <p className="text-sm font-medium">Контраст</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {CONTRASTS.map((item) => {
                  const active = prefs.contrast === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      aria-pressed={active}
                      aria-label={item.label}
                      onClick={() => commit({ contrast: item.value }, `Контраст: ${item.label.toLowerCase()}`)}
                      className={`flex h-14 items-center justify-center rounded-2xl border text-base font-medium ${item.className} ${
                        active ? "outline-2 outline-solid outline-offset-2 outline-foreground" : ""
                      }`}
                    >
                      <span aria-hidden>Аа</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{contrastLabel}</p>
            </div>

            <div className="mt-4 border-t border-border pt-3">
              {TOGGLES.map((item) => (
                <Switch
                  key={item.key}
                  label={item.label}
                  hint={item.hint}
                  checked={prefs[item.key]}
                  onChange={(checked) =>
                    commit(
                      { [item.key]: checked },
                      `${item.label} ${checked ? "увімкнено" : "вимкнено"}`,
                    )
                  }
                />
              ))}
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-sm"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Скинути налаштування
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Зберігається на цьому пристрої</p>
          </section>,
        document.body,
      )
    : null;

  return (
    <div ref={rootRef}>
      {panel}
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground lg:w-auto lg:gap-2 lg:px-4"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-haspopup="dialog"
        onClick={() => {
          if (!open) onOpen?.();
          setOpen((value) => !value);
        }}
      >
        <Accessibility className="h-5 w-5" aria-hidden />
        <span className="sr-only lg:not-sr-only lg:text-sm">Доступність</span>
      </button>
      <p className="sr-only" role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}

function Switch({ checked, onChange, label, hint }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl px-1 py-2.5 text-left"
    >
      <span className="min-w-0">
        <span className="block text-base leading-snug">{label}</span>
        <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{hint}</span>
      </span>
      <span
        aria-hidden
        className={`flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 ${
          checked ? "bg-primary" : "border border-border bg-secondary"
        }`}
      >
        <span
          className={`block h-6 w-6 rounded-full ${
            checked ? "translate-x-5 bg-primary-foreground" : "bg-foreground"
          }`}
        />
      </span>
    </button>
  );
}
