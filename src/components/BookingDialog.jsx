import { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Dialog from "./Dialog.jsx";
import {
  createBooking,
  fetchBookServices,
  fetchDates,
  fetchStaff,
  fetchTimes,
  formatDuration,
  formatPrice,
  formatVisit,
  isValidEmail,
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
  const [attempted, setAttempted] = useState(false);
  const [touched, setTouched] = useState({});
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

  const problems = {
    name: name.trim().length < 2 ? "Вкажіть ім'я" : "",
    phone: isValidPhone(phone) ? "" : "Вкажіть номер у форматі +380 і ще 9 цифр",
    email: isValidEmail(email) ? "" : "Вкажіть email, наприклад name@email.com",
  };
  const shownProblem = (key) => (attempted || touched[key] ? problems[key] : "");
  const markTouched = (key) => setTouched((current) => ({ ...current, [key]: true }));

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setAttempted(true);
    if (problems.name || problems.phone || problems.email) return;
    const fullname = name.trim();
    const normalizedEmail = email.trim();
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
          ? "Візит з'явився в розкладі фахівця."
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
        <div className="mt-5 flex max-h-[min(32rem,calc(100svh-14rem))] flex-col">
          <div className="mb-3 flex items-center justify-between gap-3">
            {step !== origin ? (
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium"
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
          <div className={`min-h-0 flex-1 pr-1 ${step === "details" ? "flex flex-col" : "overflow-y-auto"}`}>
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
              <form className="flex min-h-0 flex-1 flex-col" noValidate onSubmit={submit}>
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                  <div className="rounded-2xl bg-secondary/70 p-4 text-sm">
                    <p className="font-display text-xl leading-snug">{formatVisit(date, slot?.time)}</p>
                    <p className="mt-1">{serviceTitle}</p>
                    <p className="mt-1 text-muted-foreground">{staffName || anyLabel}</p>
                  </div>
                  <Field label="Ім'я" required error={shownProblem("name")}>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      onBlur={() => markTouched("name")}
                      autoComplete="name"
                      aria-invalid={Boolean(shownProblem("name"))}
                      className={inputClass(shownProblem("name"))}
                      placeholder="Аліна"
                    />
                  </Field>
                  <Field label="Телефон" required error={shownProblem("phone")}>
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      onBlur={() => markTouched("phone")}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={Boolean(shownProblem("phone"))}
                      className={inputClass(shownProblem("phone"))}
                      placeholder="099 123 45 67"
                    />
                  </Field>
                  <Field label="Email" required error={shownProblem("email")}>
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      onBlur={() => markTouched("email")}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      aria-invalid={Boolean(shownProblem("email"))}
                      className={inputClass(shownProblem("email"))}
                      placeholder="name@email.com"
                    />
                  </Field>
                  {company?.booking_comment_hidden ? null : (
                    <Field label={`${commentLabel} (необов'язково)`}>
                      <textarea
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        rows={2}
                        className={`${inputClass("")} resize-none`}
                      />
                    </Field>
                  )}
                </div>
                <div className="mt-3 border-t border-border bg-card pt-3">
                  {error ? <p className="mb-2 text-sm text-destructive">{error}</p> : null}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium tracking-wide text-primary-foreground disabled:opacity-60"
                  >
                    {submitting ? "Записуємо…" : "Підтвердити запис"}
                  </button>
                </div>
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
                    className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors hover:bg-secondary/45 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
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
                      <span className="text-xs leading-relaxed text-muted-foreground sm:shrink-0 sm:text-right">{meta}</span>
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
                  <span className="text-lg font-medium">{date.getDate()}</span>
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

function inputClass(error) {
  return `w-full rounded-xl border bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent ${
    error ? "border-destructive" : "border-border"
  }`;
}

function Field({ label, required = false, error = "", children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </span>
      <div className="mt-1.5">{children}</div>
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </label>
  );
}

function Status({ children }) {
  return <p className="py-6 text-sm text-muted-foreground">{children}</p>;
}
