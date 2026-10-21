import type { ReactNode } from "react";
import GhostFibers from "@/components/vendor/GhostFibers";
import { Logo } from "@/components/atoms/logo";
import "./auth.css";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-[#050f0e] px-4 py-10 text-[#d5e3df]">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <GhostFibers
          glowColor="#0b6e6a"
          lineColor="#d5e3df"
          secondaryColor="#b6d777"
          gradient="across"
          threads={64}
          speed={0.4}
          glow={0.9}
          particles={0.4}
          vignette={0.35}
          pulseOnClick={false}
        />
      </div>

      <main className="relative z-10 w-full max-w-md">
        <section className="auth-glass rounded-[2rem] p-6 md:p-8" aria-labelledby="auth-title">
            <div className="flex justify-center">
                <Logo variant="light" className="h-10" />
            </div>
          <h1
            id="auth-title"
            className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white"
          >
          {title}
        </h1>
    <p className="mt-2 text-center text-[#d5e3df]/80">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </section>
        <p className="mt-5 text-center text-sm text-[#d5e3df]/85">{footer}</p>
      </main>
    </div>
  );
}

export const authLinkClass =
  "font-bold text-[#b6d777] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b6d777]";

export const authButtonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-teal px-5 py-3 font-bold text-white ring-1 ring-white/25 transition-colors hover:bg-[#0e857f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b6d777] disabled:opacity-60";