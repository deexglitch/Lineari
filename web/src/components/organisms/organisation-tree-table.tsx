import { Link } from "react-router-dom";
import { Table } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { PersonRowTable } from "@/components/molecules/person-row-table";
import type { HierarchyNode } from "@/lib/types";
import { cn } from "@/lib/utils";

type OrganisationTreeTableProps = {
  roots: HierarchyNode[];
  isLoading?: boolean;
  isError?: boolean;
  query: string;
  focusId?: string;
  onClearSearch: () => void;
};

export function OrganisationTreeTable({
  roots,
  isLoading,
  isError,
  query,
  focusId,
  onClearSearch,
}: OrganisationTreeTableProps) {
  const searching = query.trim().length > 0;

  const buttonClass = cn(
    buttonVariants({ size: "lg" }),
    "rounded-full bg-primary font-bold text-primary-foreground hover:bg-[color-mix(in_srgb,var(--color-primary),white_12%)]",
  );

  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-2 py-6">
        <p className="text-lg font-bold">Couldn't load the organisation.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Check that the API is running at localhost:8000, then refresh.
        </p>
      </div>
    );
  }

  if (roots.length > 0) {
    return (
      <ul aria-label="Organisation tree" className="space-y-2">
        {roots.map((node) => (
          <PersonRowTable
            key={node.id}
            node={node}
            depth={0}
            forceOpen={searching || Boolean(focusId)}
            highlightId={focusId}
          />
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col items-start gap-4 px-2 py-6">
      <p className="text-lg font-bold">
        {searching ? `No one matches "${query.trim()}".` : "No employees to show yet."}
      </p>
      {searching ? (
        <button type="button" onClick={onClearSearch} className={buttonClass}>
          Clear search
        </button>
      ) : (
        <Link to="/employees" className={buttonClass}>
          <Table weight="bold" aria-hidden />
          Add employees
        </Link>
      )}
    </div>
  );
}