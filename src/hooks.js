import { useCallback, useEffect, useRef, useState } from "react";

export function useReveal(deps = []) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll(".reveal:not(.is-visible)"));
    if (!nodes.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, deps);
}

export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return y;
}

export function useTilt(amount = 6) {
  const ref = useRef(null);
  const onMouseMove = useCallback(
    (event) => {
      const node = ref.current;
      if (!node || window.matchMedia("(pointer: coarse)").matches) return;
      const box = node.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      node.style.transform = `perspective(900px) rotateX(${(-y * amount).toFixed(2)}deg) rotateY(${(x * amount).toFixed(2)}deg) translateY(-6px)`;
    },
    [amount],
  );
  const onMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);
  return { ref, onMouseMove, onMouseLeave };
}
