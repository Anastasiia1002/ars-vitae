import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className = "max-w-lg",
}) {
  const titleId = useId();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const onKey = (event) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = panelRef.current?.querySelector("input, textarea, button");
    focusable?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`modal-panel glass-panel rounded-3xl p-6 sm:p-8 ${className}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          aria-label="Закрити"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex flex-col gap-1.5 pr-6 text-left">
          <h2 id={titleId} className="font-display text-3xl font-normal">
            {title}
          </h2>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {children}
      </div>
    </div>
  );
}
