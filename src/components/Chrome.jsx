import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Instagram, MapPin, Menu, MessageCircle, Phone, Send, X } from "lucide-react";
import { images, site } from "../data.js";
import { useScrollY } from "../hooks.js";
import BookingDialog from "./BookingDialog.jsx";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const scrollY = useScrollY();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const solid = menuOpen || scrollY > 8;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 max-lg:bg-background/90 max-lg:backdrop-blur-md ${
        solid ? "bg-background/90 backdrop-blur-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-10 lg:py-5">
        <NavLink to="/" aria-label="ARS VITAE Sanctum" className="shrink-0">
          <img
            src={images.logo}
            alt="ARS VITAE Sanctum — свідома косметологія, здоров'я та відновлення"
            className="h-11 w-auto sm:h-12 lg:h-14"
          />
        </NavLink>
        <nav className="glass-panel hidden items-center gap-1 rounded-full px-2 py-1.5 lg:flex">
          <NavItem to="/" label="Головна" end />
          <NavItem to="/price" label="Прайс-лист" />
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Instagram
          </a>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <BookingDialog
            trigger={({ onClick }) => (
              <button
                type="button"
                onClick={onClick}
                className="shrink-0 rounded-full bg-primary px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] text-primary-foreground uppercase sm:px-5 sm:text-xs"
              >
                Запис
              </button>
            )}
          />
        </div>
      </div>
      {menuOpen ? (
        <nav className="border-t border-border px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-[1500px] flex-col">
            <MobileLink to="/" end>
              Головна
            </MobileLink>
            <MobileLink to="/price">Прайс-лист</MobileLink>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl px-3 py-3 text-base"
            >
              Instagram
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function MobileLink({ to, end = false, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `rounded-2xl px-3 py-3 text-base ${isActive ? "bg-secondary text-foreground" : "text-foreground"}`
      }
    >
      {children}
    </NavLink>
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
    <footer className="border-t border-border px-5 py-12 pb-32 md:px-10 lg:pr-24 lg:pb-16">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <img src={images.logo} alt="ARS VITAE Sanctum" className="h-16 w-auto sm:h-20 lg:h-24" />
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

const corner = [
  { href: site.telegram, icon: Send, label: "Telegram" },
  { href: site.whatsapp, icon: MessageCircle, label: "WhatsApp" },
  { href: site.instagram, icon: Instagram, label: "Instagram" },
  { href: site.phone, icon: Phone, label: "Подзвонити", call: true },
];

export function ContactCorner() {
  return (
    <nav
      aria-label="Месенджери та дзвінок"
      className="fixed right-6 bottom-6 z-50 hidden flex-col items-end gap-2 md:flex"
    >
      {corner.map(({ href, icon: Icon, label, call }) => {
        const external = !href.startsWith("tel:");
        return (
          <a
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            data-magnetic
            aria-label={call ? `Подзвонити (${site.phoneLabel})` : label}
            className="corner-link group relative"
          >
            <span className="corner-label pointer-events-none absolute top-1/2 right-full mr-2 hidden -translate-y-1/2 rounded-full bg-primary px-3 py-1.5 text-xs tracking-wide whitespace-nowrap text-primary-foreground shadow-[var(--shadow-soft)] transition-opacity duration-300 md:block">
              {label}
            </span>
            <span
              className={
                call
                  ? "flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-lift)] transition-transform duration-500 group-hover:scale-105 md:h-12 md:w-12"
                  : "glass-panel flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-transform duration-500 group-hover:scale-105 md:h-12 md:w-12"
              }
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </span>
          </a>
        );
      })}
    </nav>
  );
}

export function MobileDock() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
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
            <span className="max-w-full text-[10px] leading-tight text-muted-foreground">
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
