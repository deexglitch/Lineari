import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Table,
  TreeStructure,
  UserCircle,
} from "@phosphor-icons/react";
import Silk from "@/components/vendor/Silk";
import { BentoCard, BentoGrid } from "@/components/molecules/bento-card";
import { CountUp } from "@/components/atoms/count-up";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shape this page needs from your employee data. Map your API fields onto it
 * (e.g. `managerId: e.reportingLineManagerId`). Nothing here is mocked.
 */
export type OverviewEmployee = {
  id: string | number;
  managerId?: string | number | null;
};

export type ProfileUser = {
  name: string;
  email?: string;
  role?: string;
  /** Gravatar URL once you build it from the user's email hash. */
  avatarUrl?: string;
};

type OverviewPageProps = {
  employees?: OverviewEmployee[];
  isLoading?: boolean;
  user?: ProfileUser | null;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function ProfileCard({ user }: { user?: ProfileUser | null }) {
  return (
    <aside
      aria-label="Signed-in profile"
      className="flex flex-col gap-5 rounded-3xl bg-brand-plum/45 p-6 ring-1 ring-white/20 backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-lime">
          Signed-in profile
        </h2>
        <Badge className="rounded-full bg-brand-lime px-3 text-brand-plum hover:bg-brand-lime">
          {user ? "Connected" : "Not connected"}
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="size-14 rounded-2xl">
          {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
          <AvatarFallback className="rounded-2xl bg-brand-lime text-lg font-bold text-brand-plum">
            {user ? initials(user.name) : <UserCircle size={28} weight="bold" aria-hidden />}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-xl font-extrabold leading-tight">
            {user ? user.name : "No user session connected"}
          </p>
          <p className="truncate text-sm text-white/80">
            {user?.email ?? "No email available"}
          </p>
        </div>
      </div>

      <p className="text-sm text-white/80">
        {user
          ? (user.role ?? "Role or access level unavailable")
          : "Connect authentication to display account details."}
      </p>

      <Link
        to="/account"
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-auto rounded-full bg-white font-bold text-brand-plum hover:bg-white/90",
        )}
      >
        Account settings
      </Link>
    </aside>
  );
}

function Stat({
  value,
  loading,
  className,
}: {
  value: number;
  loading?: boolean;
  className?: string;
}) {
  if (loading) return <Skeleton className="mt-3 h-12 w-24 bg-brand-mist" />;
  return <CountUp value={value} className={className} />;
}

export default function OverviewPage({ employees, isLoading, user }: OverviewPageProps) {
  const list = employees ?? [];
  const total = list.length;
  const topLevel = list.filter((e) => e.managerId == null).length;
  const links = total - topLevel;
  const firstName = user?.name.split(/\s+/)[0];

  return (
    <div className="space-y-4">
      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-brand-plum/50 text-white backdrop-blur-sm">
        
        {/* Keeps the headline readable over the brightest folds. */}
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-plum from-30% via-brand-plum/75 via-60% to-transparent" />

        <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-[1.7fr_1fr]">
          <div className="flex flex-col justify-between gap-10 py-2 lg:py-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-lime">
                {firstName ? `Welcome back, ${firstName}` : "Your people, connected"}
              </p>
              <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
                A clearer picture of every reporting line.
              </h1>
              <p className="mt-5 max-w-lg text-base text-white/85">
                Explore your organisation, follow the chain of command, and keep employee
                information in one thoughtful workspace.
              </p>~
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/organisation"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full bg-brand-lime font-bold text-brand-plum hover:bg-brand-lime/90",
                )}
              >
                <TreeStructure weight="bold" aria-hidden />
                Explore organisation
              </Link>
              <Link
                to="/employees"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full bg-white font-bold text-brand-plum hover:bg-white/90",
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

      {/* Bento stats */}
      <BentoGrid className="auto-rows-[minmax(9.5rem,auto)] grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
        <BentoCard tone="teal" className="justify-between md:col-span-6 lg:col-span-5 lg:row-span-2">
          <h2 className="text-sm font-semibold text-white/85">Employees</h2>
          {isLoading ? (
            <Skeleton className="h-24 w-40 bg-white/20" />
          ) : (
            <CountUp value={total} className="text-8xl font-extrabold tabular-nums leading-none" />
          )}
          <p className="text-sm text-white/85">People in the organisation right now.</p>
        </BentoCard>

        <BentoCard className="justify-between md:col-span-3 lg:col-span-4">
          <h2 className="text-sm font-semibold text-muted-foreground">Top-level roles</h2>
          <Stat value={topLevel} loading={isLoading} className="text-5xl font-extrabold tabular-nums" />
          <p className="text-sm text-muted-foreground">People who report to no one.</p>
        </BentoCard>

        <BentoCard className="justify-between md:col-span-3 lg:col-span-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Reporting links</h2>
          <Stat value={links} loading={isLoading} className="text-5xl font-extrabold tabular-nums" />
          <p className="text-sm text-muted-foreground">Manager and report pairs.</p>
        </BentoCard>

        <BentoCard to="/employees" className="justify-between md:col-span-6 lg:col-span-7">
          <div className="flex items-start justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-mist text-brand-teal">
              <Table size={22} weight="bold" aria-hidden />
            </span>
            <ArrowUpRight size={22} weight="bold" aria-hidden />
          </div>
          <div>
            <h2 className="text-xl font-bold">Browse the directory</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sort and filter by any field, then edit or remove a record.
            </p>
          </div>
        </BentoCard>
      </BentoGrid>

      <p className="px-1 text-sm text-muted-foreground">
        Overview based on currently loaded employee records.
      </p>
    </div>
  );
}