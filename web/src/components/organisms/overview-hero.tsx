import { Link } from "react-router-dom";
import { ArrowRight, TreeStructure } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/atoms/button";
import { cn } from "@/lib/utils";
import { ProfileCard, type ProfileUser } from "@/components/molecules/profile-card";

export function OverviewHero({ user }: { user?: ProfileUser | null }) {
  const firstName = user?.name.split(/\s+/)[0];

  return (
    <section className="glass-panel rounded-[2rem] text-[#e0d6ec]">
      <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1.7fr_1fr]">
        <div className="flex flex-col justify-between gap-10 py-2 lg:py-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e0d6ec]/80">
              {firstName ? `Welcome back, ${firstName}` : "Your people, connected"}
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              A clearer picture of every reporting line.
            </h1>
            <p className="mt-5 max-w-lg text-base text-[#e0d6ec]/85">
              Explore your organisation, follow the chain of command, and keep employee
              information in one thoughtful workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/organisation"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-[#e0d6ec] font-bold text-[#1a1424] hover:bg-[#e0d6ec]/90",
              )}
            >
              <TreeStructure weight="bold" aria-hidden />
              Explore organisation
            </Link>
            <Link
              to="/employees"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-[#e0d6ec]/15 font-bold text-[#e0d6ec] ring-1 ring-[#e0d6ec]/30 backdrop-blur-md hover:bg-[#e0d6ec]/25",
              )}
            >
              View employees
              <ArrowRight weight="bold" aria-hidden />
            </Link>
          </div>
        </div>

        <ProfileCard user={user} />
      </div>
    </section>
  );
}