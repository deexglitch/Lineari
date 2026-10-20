import { ArrowsDownUp, Plus } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { EmployeeRow } from "@/components/molecules/employee-row";
import { cn } from "@/lib/utils";
import type { Employee, SortKey, SortDir } from "@/hooks/useEmployeeDirectory";

function SortHeader({
  label,
  k,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  k: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSort(k)}
      aria-sort={
        sortKey === k ? (sortDir === "asc" ? "ascending" : "descending") : "none"
      }
      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
    >
      {label}
      <ArrowsDownUp
        size={12}
        weight="bold"
        aria-hidden
        className={cn(sortKey === k ? "text-foreground" : "opacity-40")}
      />
    </button>
  );
}

export function EmployeeTable({
  rows,
  total,
  query,
  isLoading,
  isError,
  sortKey,
  sortDir,
  onSort,
  onClearSearch,
  onAddFirst,
  onDelete,
  onEdit,
}: {
  rows: Employee[];
  total: number;
  query: string;
  isLoading?: boolean;
  isError?: boolean;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  onClearSearch: () => void;
  onAddFirst: () => void;
  onDelete?: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
}) {
  const searching = query.trim().length > 0;

  if (isLoading) {
    return (
      <div className="space-y-2" aria-busy="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-2 py-8">
        <p className="text-lg font-bold">Couldn’t load the directory.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Check that the API is running at localhost:8000, then refresh.
        </p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 px-2 py-8">
        <p className="text-lg font-bold">
          {searching ? `No one matches “${query.trim()}”.` : "No employees yet."}
        </p>
        {searching ? (
          <button
            type="button"
            onClick={onClearSearch}
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-primary font-bold text-primary-foreground hover:bg-[color-mix(in_srgb,var(--color-primary),white_12%)]",
            )}
          >
            Clear search
          </button>
        ) : (
          <button
            type="button"
            onClick={onAddFirst}
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-primary font-bold text-primary-foreground hover:bg-[color-mix(in_srgb,var(--color-primary),white_12%)]",
            )}
          >
            <Plus weight="bold" aria-hidden />
            Add the first employee
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="hidden grid-cols-[2.2fr_1.6fr_1.6fr_1fr_6rem] items-center gap-4 px-4 pb-2 md:grid">
        <SortHeader label="Name" k="surname" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        <SortHeader label="Role" k="role" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        <SortHeader
          label="Manager"
          k="manager_name"
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={onSort}
        />
        <SortHeader label="Email" k="email" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Actions
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {rows.map((e) => (
          <EmployeeRow
            key={e.id}
            employee={e}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ul>

      <p className="px-2 pt-2 text-xs text-muted-foreground">
        {rows.length} of {total} {total === 1 ? "person" : "people"}
        {searching ? " matching your search." : "."}
      </p>
    </>
  );
}