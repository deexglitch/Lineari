import { Link } from "react-router-dom";
import { Table } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { PersonRow } from "@/components/molecules/person-row";
import type { HierarchyNode } from "@/lib/types";
import { cn } from "@/lib/utils";

type OrganisationTreeProps = {
  roots: HierarchyNode[];
  isLoading?: boolean;
  isError?: boolean;
  /** Search term used to force-open matches and to tune the empty message. */
  query: string;
  onClearSearch: () => void;
};

export function OrganisationTree({
  roots,
  isLoading,
  isError,
  query,
  onClearSearch,
}: OrganisationTreeProps) {
  const searching = query.trim().length > 0;

  const buttonClass = cn(
    buttonVariants({ size: "lg" }),
    "rounded-full bg-[#e0d6ec] font-bold text-[#1a1424] hover:bg-[#e0d6ec]/90",
  );

  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-2xl bg-[#e0d6ec]/15" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-2 py-6">
        <p className="text-lg font-bold">Couldn’t load the organisation.</p>
        <p className="mt-1 text-sm text-[#e0d6ec]/70">
          Check that the API is running at localhost:8000, then refresh.
        </p>
      </div>
    );
  }

  if (roots.length > 0) {
    return (
      <ul aria-label="Organisation tree">
        {roots.map((node) => (
          <PersonRow key={node.id} node={node} depth={0} forceOpen={searching} />
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col items-start gap-4 px-2 py-6">
      <p className="text-lg font-bold">
        {searching ? `No one matches “${query.trim()}”.` : "No employees to show yet."}
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