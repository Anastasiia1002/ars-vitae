import { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Dialog from "./Dialog.jsx";
import { site } from "../data.js";
import {
  createBooking,
  fetchBookServices,
  fetchDates,
  fetchStaff,
  fetchTimes,
  formatDuration,
  formatPrice,
  formatVisit,
  isValidPhone,
  normalizePhone,
  servicesInCategory,
} from "../altegio.js";
import { useCatalog, useCompany } from "../useAltegio.js";

const STEP_LABEL = {
  service: "Послуга",
  staff: "Фахівець",
  date: "Дата",
  time: "Час",
  details: "Контакти",
};

export default function BookingDialog({
  trigger,
  open,
  onOpenChange,
  serviceIds: presetServiceIds = [],
  staffId: presetStaffId = null,
  staffName: presetStaffName = "",
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const shown = open ?? internalOpen;
  const setShown = (value) => {
    if (open === undefined) setInternalOpen(value);
    onOpenChange?.(value);
  };

  return (
    <>
      {trigger ? trigger({ onClick: () => setShown(true) }) : null}
      {shown ? (
        <BookingForm
          presetServiceIds={presetServiceIds}
          presetStaffId={presetStaffId}
          presetStaffName={presetStaffName}
          onClose={() => setShown(false)}
        />
      ) : null}
    </>
  );
}

function BookingForm({ presetServiceIds, presetStaffId, presetStaffName, onClose }) {
  const catalog = useCatalog();
  const { company } = useCompany();
  const [session] = useState(() => {
    const serviceIds = [...new Set(presetServiceIds.map(Number).filter(Boolean))];
    const origin =
      serviceIds.length && presetStaffId != null ? "date" : serviceIds.length ? "staff" : "service";
    return {
      serviceIds,
      staffId: presetStaffId,
      staffName: presetStaffName,
      multi: serviceIds.length > 1,
      origin,
    };
  });
  const { multi, origin } = session;

  const [step, setStep] = useState(origin);
  const [serviceIds, setServiceIds] = useState(session.serviceIds);
  const [staffId, setStaffId] = useState(session.staffId);
  const [staffName, setStaffName] = useState(session.staffName);
  const [offeredIds, setOfferedIds] = useState(null);
  const [offersReady, setOffersReady] = useState(session.staffId == null || session.staffId === 0);
  const [staffOptions, setStaffOptions] = useState({ status: "idle", items: [] });
  const [dates, setDates] = useState({ status: "idle", items: [] });
  const [date, setDate] = useState("");
  const [times, setTimes] = useState({ status: "idle", items: [] });
  const [slot, setSlot] = useState(null);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (staffId == null || staffId === 0) {
      setOfferedIds(null);
      setOffersReady(true);
      return undefined;
    }
    let cancel = false;
    setOffersReady(false);
    fetchBookServices({ staffId })
      .then((data) => {
        if (cancel) return;
        setOfferedIds(new Set((data?.services || []).map((service) => service.id)));
        setOffersReady(true);
      })
      .catch(() => {
        if (cancel) return;
        setOfferedIds(null);
        setOffersReady(true);
      });
    return () => {
      cancel = true;
    };
  }, [staffId]);

  useEffect(() => {
    if (step !== "staff" || !serviceIds.length) return undefined;
    let cancel = false;
    setStaffOptions({ status: "loading", items: [] });
    fetchStaff({ serviceIds })
      .then((items) => {
        if (!cancel) setStaffOptions({ status: "ready", items: Array.isArray(items) ? items : [] });
      })
      .catch(() => {
        if (!cancel) setStaffOptions({ status: "error", items: [] });
      });
    return () => {
      cancel = true;
    };
  }, [step, serviceIds]);

  useEffect(() => {
    if (step !== "date" || !serviceIds.length || staffId == null) return undefined;
    let cancel = false;
    setDates({ status: "loading", items: [] });
    fetchDates({ staffId, serviceIds })
      .then((data) => {
        if (!cancel) setDates({ status: "ready", items: data?.booking_dates || [] });
      })
      .catch(() => {
        if (!cancel) setDates({ status: "error", items: [] });
      });
    return () => {
      cancel = true;
    };
  }, [step, staffId, serviceIds]);

  useEffect(() => {
    if (step !== "time" || !date || staffId == null) return undefined;
    let cancel = false;
    setTimes({ status: "loading", items: [] });
    fetchTimes({ staffId, date, serviceIds })
      .then((items) => {
        if (!cancel) setTimes({ status: "ready", items: Array.isArray(items) ? items : [] });
      })
      .catch(() => {
        if (!cancel) setTimes({ status: "error", items: [] });
      });
    return () => {
      cancel = true;
    };
  }, [step, date, staffId, serviceIds]);

  const chosen = serviceIds
    .map((id) => catalog.services.find((service) => service.id === id))
    .filter(Boolean);
  const serviceTitle = chosen.length
    ? chosen.map((service) => service.title).join(" + ")
    : serviceIds.length
      ? "Обрані послуги"
      : "";

  const visibleServices = useMemo(() => {
    const base = offeredIds
      ? catalog.services.filter((service) => offeredIds.has(service.id))
      : catalog.services;
    const needle = query.trim().toLowerCase();
    if (!needle) return base;
    return base.filter((service) => `${service.title} ${service.comment}`.toLowerCase().includes(needle));
  }, [catalog.services, offeredIds, query]);

  const anyLabel = company?.master_name ? `Будь-який ${company.master_name}` : "Будь-який фахівець";
  const commentLabel = company?.booking_comment_input_name || "Коментар";

  const chooseService = (id) => {
    setServiceIds([id]);
    setDate("");
    setSlot(null);
    setError("");
    setStep(staffId != null ? "date" : "staff");
  };

  const toggleService = (id) => {
    setServiceIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    setDate("");
    setSlot(null);
    setStaffId(session.staffId);
    setStaffName(session.staffName);
    setError("");
  };

  const chooseStaff = (id, label) => {
    setStaffId(id);
    setStaffName(label);
    setDate("");
    setSlot(null);
    setError("");
    setStep("date");
  };

  const chooseDate = (value) => {
    setDate(value);
    setSlot(null);
    setError("");
    setStep("time");
  };

  const chooseSlot = (value) => {
    setSlot(value);
    setError("");
    setStep("details");
  };

  const back = () => {
    setError("");
    if (step === "details") setStep("time");
    else if (step === "time") {
      setSlot(null);
      setStep("date");
    } else if (step === "date") {
      setDate("");
      setSlot(null);
      setStep("staff");
    } else if (step === "staff") {
      setStaffId(session.staffId);
      setStaffName(session.staffName);
      setDate("");
      setSlot(null);
      setStep("service");
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const fullname = name.trim();
    if (fullname.length < 2) {
      setError("Вкажіть ім'я.");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("Вкажіть телефон у форматі +380.");
      return;
    }
    const normalizedEmail = email.trim();
    if ((company?.booking_email_required || normalizedEmail) && !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("Вкажіть коректний email.");
      return;
    }
    if (company?.booking_comment_required && !comment.trim()) {
      setError(`Заповніть поле «${commentLabel}».`);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const records = await createBooking({
        phone: normalizePhone(phone),
        fullname,
        email: normalizedEmail,
        comment: comment.trim(),
        notify_by_sms: company?.reminds_sms_disabled ? 0 : Number(company?.reminds_sms_default ?? 24),
        appointments: [
          {
            id: 1,
            services: serviceIds,
            staff_id: staffId,
            datetime: slot.datetime,
          },
        ],
      });
      const record = Array.isArray(records) ? records[0] : null;
      setSuccess({
        recordId: record?.record_id,
        when: formatVisit(date, slot.time),
        service: serviceTitle,
        staff: staffName || anyLabel,
      });
      window.dispatchEvent(
        new CustomEvent("sanctum-toast", {
          detail: {
            title: "Запис створено",
            description: `${formatVisit(date, slot.time)}. Чекаємо на вас.`,
          },
        }),
      );
    } catch (reason) {
      setError(reason.message || "Не вдалося створити запис.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title={success ? "Ви записані" : "Онлайн-запис"}
      description={
        success
          ? "Візит з'явився в розкладі Altegio."
          : serviceTitle || "Оберіть послугу, фахівця і вільне вікно."
      }
    >
      {success ? (
        <div className="mt-6 space-y-3 text-sm">
          <p className="font-display text-2xl leading-snug">{success.when}</p>
          <p>{success.service}</p>
          <p className="text-muted-foreground">{success.staff}</p>
          {success.recordId ? <p className="text-xs text-muted-foreground">Номер запису {success.recordId}</p> : null}
          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground"
          >
            Добре
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            {step !== origin ? (
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-1 text-xs tracking-wide text-muted-foreground uppercase"
              >
                <ChevronLeft className="h-4 w-4" /> Назад
              </button>
            ) : (
              <span />
            )}
            <p className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
              {STEP_LABEL[step]}
            </p>
          </div>
          <div className="max-h-[min(32rem,calc(100svh-14rem))] overflow-y-auto pr-1">
            {step === "service" ? (
              <ServiceStep
                catalog={offersReady ? catalog : { ...catalog, status: catalog.status === "error" ? "error" : "loading" }}
                services={visibleServices}
                query={query}
                onQuery={setQuery}
                multi={multi}
                selected={serviceIds}
                onChoose={chooseService}
                onToggle={toggleService}
                onContinue={() => setStep(staffId != null ? "date" : "staff")}
              />
            ) : null}
            {step === "staff" ? (
              <StaffStep
                state={staffOptions}
                anyLabel={anyLabel}
                showAny={company?.show_any_master !== false}
                onChoose={chooseStaff}
              />
            ) : null}
            {step === "date" ? <DateStep state={dates} onChoose={chooseDate} /> : null}
            {step === "time" ? <TimeStep state={times} onChoose={chooseSlot} /> : null}
            {step === "details" ? (
              <form className="space-y-4" onSubmit={submit}>
                <div className="rounded-2xl bg-secondary/70 p-4 text-sm">
                  <p className="font-display text-xl leading-snug">{formatVisit(date, slot?.time)}</p>
                  <p className="mt-1">{serviceTitle}</p>
                  <p className="mt-1 text-muted-foreground">{staffName || anyLabel}</p>
                </div>
                <Field label="Ім'я">
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    autoComplete="name"
                    className="field-input"
                    placeholder="Аліна"
                  />
                </Field>
                <Field label="Телефон">
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    type="tel"
                    autoComplete="tel"
                    className="field-input"
                    placeholder="+380 __ ___ __ __"
                  />
                </Field>
                {company?.booking_email_hidden ? null : (
                  <Field label={company?.booking_email_required ? "Email" : "Email, якщо зручно"}>
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                      autoComplete="email"
                      required={Boolean(company?.booking_email_required)}
                      className="field-input"
                      placeholder="name@email.com"
                    />
                  </Field>
                )}
                {company?.booking_comment_hidden ? null : (
                  <Field label={commentLabel}>
                    <textarea
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      required={Boolean(company?.booking_comment_required)}
                      rows={2}
                      className="field-input resize-none"
                    />
                  </Field>
                )}
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-primary px-6 py-3 text-sm tracking-wide text-primary-foreground transition-transform duration-500 hover:scale-[1.02] disabled:opacity-60"
                >
                  {submitting ? "Записуємо…" : "Підтвердити запис"}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  або напишіть у{" "}
                  <a href={site.telegram} className="underline underline-offset-4">
                    Telegram
                  </a>
                </p>
              </form>
            ) : null}
            {error && step !== "details" ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
          </div>
        </div>
      )}
    </Dialog>
  );
}

function ServiceStep({ catalog, services, query, onQuery, multi, selected, onChoose, onToggle, onContinue }) {
  if (catalog.status === "loading") return <Status>Завантажуємо послуги…</Status>;
  if (catalog.status === "error") return <Status>Не вдалося завантажити послуги. Оновіть сторінку.</Status>;

  const groups = catalog.categories
    .map((category) => ({ category, items: servicesInCategory(services, category) }))
    .filter((group) => group.items.length);

  return (
    <div className="space-y-3">
      <input
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder="Пошук послуги"
        className="w-full rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
      />
      {groups.length === 0 ? <Status>Нічого не знайдено.</Status> : null}
      {groups.map((group) => (
        <section key={group.category.id} className="overflow-hidden rounded-2xl border border-border">
          <h3 className="bg-secondary px-4 py-2.5 text-sm font-medium text-foreground">{group.category.title}</h3>
          <ul>
            {group.items.map((service) => {
              const active = selected.includes(service.id);
              const meta = [formatDuration(service.duration), formatPrice(service)].filter(Boolean).join(" · ");
              return (
                <li key={service.id} className="border-t border-border">
                  <button
                    type="button"
                    onClick={() => (multi ? onToggle(service.id) : onChoose(service.id))}
                    className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-secondary/45 ${
                      active ? "bg-secondary/70" : "bg-card"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium leading-snug">{service.title}</span>
                      {multi ? (
                        <span className="mt-1 block text-xs text-muted-foreground">{active ? "Обрано" : "Додати"}</span>
                      ) : null}
                    </span>
                    {meta ? (
                      <span className="shrink-0 text-right text-xs leading-relaxed text-muted-foreground">{meta}</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      {multi ? (
        <button
          type="button"
          disabled={!selected.length}
          onClick={onContinue}
          className="w-full rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground disabled:opacity-50"
        >
          Далі
        </button>
      ) : null}
    </div>
  );
}

function StaffStep({ state, anyLabel, showAny, onChoose }) {
  if (state.status === "loading") return <Status>Шукаємо фахівців…</Status>;
  if (state.status === "error") return <Status>Не вдалося завантажити фахівців.</Status>;
  if (!state.items.length && !showAny) return <Status>На цю послугу зараз немає фахівця з вільними вікнами.</Status>;

  return (
    <ul className="space-y-2">
      {showAny ? (
        <li>
          <button
            type="button"
            onClick={() => onChoose(0, anyLabel)}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-secondary/60"
          >
            <span className="block text-sm font-medium">{anyLabel}</span>
            <span className="mt-1 block text-xs text-muted-foreground">Перше вільне вікно</span>
          </button>
        </li>
      ) : null}
      {state.items.map((member) => (
        <li key={member.id}>
          <button
            type="button"
            onClick={() => onChoose(member.id, member.name)}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-secondary/60"
          >
            <span className="block text-sm font-medium">{member.name}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {[member.position?.title, member.specialization].filter(Boolean).join(" · ")}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function DateStep({ state, onChoose }) {
  if (state.status === "loading") return <Status>Шукаємо вільні дати…</Status>;
  if (state.status === "error") return <Status>Не вдалося завантажити дати.</Status>;
  if (!state.items.length) return <Status>Вільних дат немає. Оберіть іншого фахівця або напишіть нам.</Status>;

  const groups = new Map();
  for (const iso of state.items) {
    const date = new Date(`${iso}T12:00:00`);
    const label = date.toLocaleDateString("uk-UA", { month: "long", year: "numeric" });
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(iso);
  }

  return (
    <div className="space-y-4">
      {[...groups].map(([label, items]) => (
        <div key={label}>
          <h3 className="mb-2 text-sm font-medium capitalize">{label}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {items.map((iso) => {
              const date = new Date(`${iso}T12:00:00`);
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => onChoose(iso)}
                  className="rounded-2xl border border-border px-3 py-2 text-left text-xs transition-colors hover:border-accent"
                >
                  <span className="block text-muted-foreground">
                    {date.toLocaleDateString("uk-UA", { weekday: "short" })}
                  </span>
                  <span className="font-display text-lg">{date.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function TimeStep({ state, onChoose }) {
  if (state.status === "loading") return <Status>Шукаємо вільні години…</Status>;
  if (state.status === "error") return <Status>Не вдалося завантажити години.</Status>;
  if (!state.items.length) return <Status>На цю дату вільних годин немає.</Status>;

  return (
    <div className="flex flex-wrap gap-2">
      {state.items.map((item) => (
        <button
          key={item.datetime}
          type="button"
          onClick={() => onChoose(item)}
          className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-accent hover:text-foreground"
        >
          {item.time}
          {item.seance_length ? (
            <span className="ml-2 text-xs text-muted-foreground">{formatDuration(item.seance_length)}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Status({ children }) {
  return <p className="py-6 text-sm text-muted-foreground">{children}</p>;
}
