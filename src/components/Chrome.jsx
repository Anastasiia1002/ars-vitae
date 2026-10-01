import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Instagram, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { site } from "../data.js";
import BookingDialog from "./BookingDialog.jsx";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-4 sm:px-5 md:px-10 md:py-6">
        <NavLink to="/" data-magnetic className="group min-w-0">
          <span className="font-display text-base tracking-[0.14em] sm:text-lg sm:tracking-[0.18em] md:text-xl">
            ARS VITAE
          </span>
          <span className="eyebrow ml-2 hidden md:inline">sanctum</span>
        </NavLink>
        <nav className="glass-panel hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex">
          <NavItem to="/" label="Головна" end />
          <NavItem to="/price" label="Прайс-лист" />
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            data-magnetic
            className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Instagram
          </a>
        </nav>
        <BookingDialog
          trigger={({ onClick }) => (
            <button
              type="button"
              onClick={onClick}
              data-magnetic
              className="shrink-0 rounded-full bg-primary px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] text-primary-foreground uppercase transition-transform duration-500 hover:scale-[1.04] sm:px-5 sm:text-xs"
            >
              Запис
            </button>
          )}
        />
      </div>
    </header>
  );
}

function NavItem({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      data-magnetic
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm transition-colors hover:text-foreground ${
          isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border px-5 py-12 pb-32 md:px-10 md:pb-16">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-4xl leading-none md:text-6xl">ARS VITAE SANCTUM</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {site.address} · Ліцензія МОЗ України
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <a href={site.instagram} className="underline underline-offset-4">
            @ars.vitae.sanctum
          </a>
          <a href={site.telegram} className="underline underline-offset-4">
            Telegram
          </a>
          <NavLink to="/price" className="underline underline-offset-4">
            Прайс
          </NavLink>
        </div>
      </div>
    </footer>
  );
}

const dock = [
  { href: site.telegram, icon: Send, label: "Telegram" },
  { href: site.instagram, icon: Instagram, label: "Direct" },
  { href: site.whatsapp, icon: MessageCircle, label: "WhatsApp" },
  { href: site.phone, icon: Phone, label: "Дзвінок" },
  { href: site.maps, icon: MapPin, label: "Маршрут" },
];

export function MobileDock() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:hidden">
      <nav className="glass-panel flex items-center justify-between rounded-3xl px-1 py-2">
        {dock.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("tel:") ? undefined : "_blank"}
            rel="noreferrer"
            aria-label={label === "Дзвінок" ? `Дзвінок (${site.phoneLabel})` : label}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 transition-colors active:bg-secondary"
          >
            <Icon className="h-[18px] w-[18px] text-foreground" strokeWidth={1.4} />
            <span className="max-w-full truncate text-[10px] tracking-wide text-muted-foreground">
              {label}
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
}

export function Cursor() {
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const narrow = window.matchMedia("(max-width: 767px)");
    if (coarse.matches || narrow.matches) return undefined;

    const dot = document.createElement("div");
    const ring = document.createElement("div");
    const layer = document.createElement("div");
    layer.className = "pointer-events-none fixed inset-0 z-[100] hidden md:block";
    layer.setAttribute("aria-hidden", "true");
    ring.className =
      "absolute top-0 left-0 h-9 w-9 rounded-full border border-accent transition-opacity duration-300";
    dot.className = "absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-foreground";
    layer.append(ring, dot);
    document.body.append(layer);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let magnet = null;
    let frame = 0;

    const onMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      magnet = event.target?.closest?.("[data-magnetic]") ?? null;
    };

    const tick = () => {
      let targetX = x;
      let targetY = y;
      let scale = 1;
      if (magnet) {
        const box = magnet.getBoundingClientRect();
        targetX = box.left + box.width / 2;
        targetY = box.top + box.height / 2;
        scale = Math.max(box.width, box.height) / 36;
      }
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0) scale(${scale.toFixed(2)})`;
      ring.style.opacity = magnet ? "0.28" : "0.7";
      dot.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
      document.body.style.cursor = previousCursor;
      layer.remove();
    };
  }, []);

  return null;
}

export function ToastHost() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let timer = 0;
    const onToast = (event) => {
      setToast(event.detail);
      clearTimeout(timer);
      timer = window.setTimeout(() => setToast(null), 4200);
    };
    window.addEventListener("sanctum-toast", onToast);
    return () => {
      window.removeEventListener("sanctum-toast", onToast);
      clearTimeout(timer);
    };
  }, []);

  if (!toast) return null;

  return (
    <div className="toast glass-panel rounded-2xl px-5 py-4" role="status">
      <p className="font-display text-xl">{toast.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p>
    </div>
  );
}
