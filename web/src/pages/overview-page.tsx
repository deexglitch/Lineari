import { OverviewHero } from "@/components/organisms/overview-hero";
import { OverviewStats } from "@/components/organisms/overview-stats";
import type { ProfileUser } from "@/components/molecules/profile-card";

/**
 * Shape this page needs from your employee data. Map your API fields onto it
 * (e.g. `managerId: e.reportingLineManagerId`). Nothing here is mocked.
 */
export type OverviewEmployee = {
  id: string | number;
  managerId?: string | number | null;
};

export type { ProfileUser };

type OverviewPageProps = {
  employees?: OverviewEmployee[];
  isLoading?: boolean;
  user?: ProfileUser | null;
};

export default function OverviewPage({ employees, isLoading, user }: OverviewPageProps) {
  const list = employees ?? [];
  const total = list.length;
  const topLevel = list.filter((e) => e.managerId == null).length;
  const links = total - topLevel;

  return (
    <div className="space-y-4">
      <OverviewHero user={user} />
      <OverviewStats total={total} topLevel={topLevel} links={links} isLoading={isLoading} />
      <p className="px-1 text-sm text-muted-foreground">
        Overview based on currently loaded employee records.
      </p>
    </div>
  );
}