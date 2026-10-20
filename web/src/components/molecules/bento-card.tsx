import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { animate, stagger } from "animejs";
import { cn } from "@/lib/utils";
import "./bento.css";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Lays cards out in a grid and drives the shared pointer effects:
 * cards rise in one by one, and the glow follows the cursor across neighbours.
 */
export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    const reduced = prefersReducedMotion();
    const cards = grid.querySelectorAll<HTMLElement>(".bento-card");

    const intro = reduced
      ? null
      : animate(cards, {
          opacity: [0, 1],
          translateY: [18, 0],
          duration: 700,
          ease: "outExpo",
          delay: stagger(80, { start: 250 }),
        });

    // Glow is pointer-only and skipped when the person asks for less motion.
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (reduced || !canHover) return () => void intro?.pause();

    let frame = 0;
    let x = -1e5;
    let y = -1e5;

    const update = () => {
      frame = 0;
      const g = grid.getBoundingClientRect();
      const reach = 160;
      const near =
        x > g.left - reach && x < g.right + reach && y > g.top - reach && y < g.bottom + reach;
      grid.style.setProperty("--bento-near", near ? "1" : "0");
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
        card.style.setProperty("--bento-x", `${x - r.left}px`);
        card.style.setProperty("--bento-y", `${y - r.top}px`);
        card.style.setProperty("--bento-hot", inside ? "1" : "0");
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType === "touch") return;
      x = event.clientX;
      y = event.clientY;
      schedule();
    };
    const onLeave = () => {
      x = -1e5;
      y = -1e5;
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      intro?.pause();
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={cn("bento-grid grid gap-4", className)}>
      {children}
    </div>
  );
}

type BentoCardProps = {
  tone?: "paper" | "teal";
  /** Makes the whole card a link. */
  to?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function BentoCard({ tone = "paper", to, className, style, children }: BentoCardProps) {
  const ref = useRef<HTMLElement | null>(null);

  // A ring of light spreads from wherever the card was pressed.
  const ripple = (event: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const rect = el.getBoundingClientRect();
    const size = Math.hypot(rect.width, rect.height) * 2;
    const dot = document.createElement("span");
    dot.className = "bento-ripple";
    Object.assign(dot.style, {
      left: `${event.clientX - rect.left}px`,
      top: `${event.clientY - rect.top}px`,
      width: `${size}px`,
      height: `${size}px`,
    });
    el.appendChild(dot);
    animate(dot, {
      scale: [0, 1],
      opacity: [0.9, 0],
      duration: 750,
      ease: "outCubic",
      onComplete: () => dot.remove(),
    });
  };

  const classes = cn(
    "bento-card flex flex-col rounded-3xl p-6",
    tone === "teal"
      ? "bg-brand-teal text-white"
      : "bg-card text-card-foreground ring-1 ring-border",
    to &&
      "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal",
    className,
  );

  if (to) {
    return (
      <Link
        to={to}
        ref={(el) => {
          ref.current = el;
        }}
        className={classes}
        style={style}
        data-tone={tone}
        onPointerDown={ripple}
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      ref={(el) => {
        ref.current = el;
      }}
      className={classes}
      style={style}
      data-tone={tone}
      onPointerDown={ripple}
    >
      {children}
    </div>
  );
}