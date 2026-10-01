import { useRef, useState } from "react";

export default function BeforeAfter({ before, after, caption }) {
  const [position, setPosition] = useState(52);
  const frame = useRef(null);
  const dragging = useRef(false);

  const move = (clientX) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box) return;
    setPosition(Math.min(100, Math.max(0, ((clientX - box.left) / box.width) * 100)));
  };

  return (
    <figure className="bento-card overflow-hidden">
      <div
        ref={frame}
        className="relative aspect-[4/3] cursor-ew-resize touch-none select-none"
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event.clientX);
        }}
        onPointerMove={(event) => dragging.current && move(event.clientX)}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        <img
          src={after}
          alt="Результат після курсу процедур"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          src={before}
          alt="Стан до початку курсу"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            clipPath: `inset(0 ${100 - position}% 0 0)`,
            filter: "saturate(0.75) contrast(0.95)",
          }}
        />
        <div
          className="absolute inset-y-0 w-px bg-background/90"
          style={{ left: `${position}%` }}
          aria-hidden
        >
          <span className="glass-panel absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] tracking-widest">
            ↔
          </span>
        </div>
        <span className="absolute bottom-3 left-3 rounded-full bg-background/80 px-3 py-1 text-[10px] tracking-[0.2em] uppercase">
          до
        </span>
        <span className="absolute right-3 bottom-3 rounded-full bg-background/80 px-3 py-1 text-[10px] tracking-[0.2em] uppercase">
          після
        </span>
      </div>
      <figcaption className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
