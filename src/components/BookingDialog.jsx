import { useEffect, useState } from "react";
import Dialog from "./Dialog.jsx";
import { site } from "../data.js";

export default function BookingDialog({ trigger, preset = "", open, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const shown = open ?? internalOpen;
  const setShown = (value) => {
    if (open === undefined) setInternalOpen(value);
    onOpenChange?.(value);
  };
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wish, setWish] = useState(preset);

  useEffect(() => {
    if (shown && preset) setWish(preset);
  }, [shown, preset]);

  const submit = (event) => {
    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent("sanctum-toast", {
        detail: {
          title: "Заявку прийнято",
          description: `${name || "Гість"}, ми зателефонуємо найближчим часом.`,
        },
      }),
    );
    setShown(false);
    setName("");
    setPhone("");
  };

  return (
    <>
      {trigger
        ? trigger({
            onClick: () => setShown(true),
          })
        : null}
      <Dialog
        open={shown}
        onClose={() => setShown(false)}
        title="Онлайн-запис"
        description="Залиште контакт — адміністратор підтвердить час протягом дня."
        className="max-w-md"
      >
        <form className="mt-4 space-y-4" onSubmit={submit}>
          <Field label="Ім'я">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full border-b border-border bg-transparent py-2 text-base outline-none transition-colors focus:border-accent"
              placeholder="Аліна"
            />
          </Field>
          <Field label="Телефон">
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              type="tel"
              className="w-full border-b border-border bg-transparent py-2 text-base outline-none transition-colors focus:border-accent"
              placeholder="+380 __ ___ __ __"
            />
          </Field>
          <Field label="Послуга / побажання">
            <textarea
              value={wish}
              onChange={(event) => setWish(event.target.value)}
              rows={2}
              className="w-full resize-none border-b border-border bg-transparent py-2 text-base outline-none transition-colors focus:border-accent"
              placeholder="Краніо-сакральна терапія"
            />
          </Field>
          <button
            type="submit"
            data-magnetic
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-transform duration-500 hover:scale-[1.02]"
          >
            Надіслати заявку
          </button>
          <p className="text-center text-xs text-muted-foreground">
            або напишіть у{" "}
            <a href={site.telegram} className="underline underline-offset-4">
              Telegram
            </a>{" "}
            /{" "}
            <a href={site.instagram} className="underline underline-offset-4">
              Instagram
            </a>
          </p>
        </form>
      </Dialog>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
