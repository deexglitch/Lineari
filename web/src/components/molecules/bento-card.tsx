import {
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { animate } from "animejs";
import { cn } from "@/lib/utils";
import "./bento.css";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type BentoCardProps = {
  tone?: "clear" | "smoke";
  /** Makes the whole card a link. */
  to?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function BentoCard({ tone = "clear", to, className, style, children }: BentoCardProps) {
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
    tone === "smoke" ? "text-white" : "text-foreground",
    to &&
      "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/60",
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