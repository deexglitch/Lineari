import { ProfilePanel, type ProfileUser } from "@/components/organisms/overview-profile-panel";
import type { HierarchyNode } from "@/lib/types";

export type OverviewEmployee = {
  id: string | number;
  managerId?: string | number | null;
};

export type { ProfileUser };

type OverviewPageProps = {
  employees?: OverviewEmployee[];
  isLoading?: boolean;
  user?: ProfileUser | null;
  hierarchy?: HierarchyNode[];
};

export default function OverviewPage({
  employees,
  isLoading,
  user,
  hierarchy,
}: OverviewPageProps) {
  const list = employees ?? [];
  const total = list.length;
  const topLevel = list.filter((e) => e.managerId == null).length;
  const links = total - topLevel;

  return (
    <div className="space-y-4">
      <ProfilePanel
        user={user}
        total={total}
        topLevel={topLevel}
        links={links}
        isLoading={isLoading}
        hierarchy={hierarchy}
      />
      <p className="px-1 text-sm text-muted-foreground">
        Overview based on currently loaded employee records.
      </p>
    </div>
  );
}