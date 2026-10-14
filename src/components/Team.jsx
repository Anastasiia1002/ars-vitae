import { plainText, staffPortrait } from "../altegio.js";
import { useReveal } from "../hooks.js";
import { usePublicStaff } from "../useAltegio.js";
import BookingDialog from "./BookingDialog.jsx";

export default function Team() {
  const { status, staff } = usePublicStaff();
  useReveal([status, staff.length]);

  return (
    <section id="team" className="mx-auto max-w-[1500px] px-5 py-20 sm:py-24 md:px-10 md:py-32">
      <div className="reveal flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Команда</p>
          <h2 className="mt-3 font-display text-[2.15rem] leading-[0.95] sm:text-6xl md:text-[5vw]">Фахівці Sanctum</h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Лікарі та практики простору. Онлайн-запис відкриває вільні вікна саме до обраної людини.
        </p>
      </div>

      {status === "loading" ? <p className="mt-10 text-sm text-muted-foreground">Завантажуємо команду…</p> : null}
      {status === "error" ? (
        <p className="mt-10 text-sm text-muted-foreground">
          Список фахівців зараз недоступний. Запис на послугу все одно можна оформити через кнопку «Запис».
        </p>
      ) : null}

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {staff.map((member) => (
          <li key={member.id} className="reveal bento-card flex min-w-0 gap-4 p-4 sm:p-6">
            <Portrait member={member} />
            <div className="min-w-0 flex-1">
              <p className="eyebrow">{member.position?.title || "Фахівець"}</p>
              <h3 className="mt-2 font-display text-2xl leading-tight">{member.name}</h3>
              {member.specialization ? (
                <p className="mt-2 text-sm text-muted-foreground">{member.specialization}</p>
              ) : null}
              {plainText(member.information) ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plainText(member.information)}</p>
              ) : null}
              <div className="mt-4">
                {member.bookable ? (
                  <BookingDialog
                    staffId={member.id}
                    staffName={member.name}
                    trigger={({ onClick }) => (
                      <button
                        type="button"
                        onClick={onClick}
                        data-magnetic
                        className="min-h-11 rounded-full border border-primary px-4 py-2 text-sm transition-colors duration-500 hover:bg-primary hover:text-primary-foreground"
                      >
                        Записатися
                      </button>
                    )}
                  />
                ) : (
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">Немає онлайн-вікон</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Portrait({ member }) {
  const src = staffPortrait(member);
  if (!src) return <Initials name={member.name} />;
  return (
    <img
      src={src}
      alt=""
      width={88}
      height={88}
      loading="lazy"
      className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-full object-cover"
    />
  );
}

function Initials({ name }) {
  const letters = String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return (
    <span className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full bg-secondary font-display text-xl">
      {letters || "•"}
    </span>
  );
}
