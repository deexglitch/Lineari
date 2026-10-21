import { useEffect, useRef } from "react";
import { animate } from "animejs";

/** Counts from the previous value to `value`. Writes to the DOM directly so it doesn't re-render every frame. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(value);
      from.current = value;
      return;
    }
    const counter = { v: from.current };
    const anim = animate(counter, {
      v: value,
      duration: 900,
      ease: "outExpo",
      onUpdate: () => {
        el.textContent = String(Math.round(counter.v));
      },
      onComplete: () => {
        from.current = value;
      },
    });
    return () => {
      anim.pause();
    };
  }, [value]);

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      {value}
    </span>
  );
}