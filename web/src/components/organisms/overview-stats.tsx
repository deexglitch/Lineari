import { ArrowUpRight, Table } from "@phosphor-icons/react";
import { BentoCard } from "@/components/molecules/bento-card";
import { BentoGrid } from "@/components/molecules/bento-grid";
import { CountUp } from "@/components/atoms/count-up";
import { Skeleton } from "@/components/atoms/skeleton";

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

export function OverviewStats({
  total,
  topLevel,
  links,
  isLoading,
}: {
  total: number;
  topLevel: number;
  links: number;
  isLoading?: boolean;
}) {
  return (
    <BentoGrid className="auto-rows-[minmax(9.5rem,auto)] grid-cols-1 md:grid-cols-6 lg:grid-cols-12">
      <BentoCard tone="clear" className="justify-between md:col-span-6 lg:col-span-5 lg:row-span-2">
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
  );
}