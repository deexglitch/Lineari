import { useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass, Plus, TreeStructure } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/atoms/button";
import { AddEmployeeDialog } from "@/components/organisms/addemployeedialog";
import { DeleteEmployeeDialog } from "@/components/organisms/delete-employee-dialog";
import { EmployeeTable } from "@/components/organisms/employee-table";
import { useEmployees } from "@/hooks/useEmployees";
import { EditEmployeeDialog } from "@/components/organisms/edit-employee-dialog";
import {
  useEmployeeDirectory,
  type Employee,
} from "@/hooks/useEmployeeDirectory";
import { cn } from "@/lib/utils";

export default function EmployeesPage() {
  const { data, isLoading, isError } = useEmployees();
  const directory = useEmployeeDirectory(data ?? []);
  const [addOpen, setAddOpen] = useState(false);
  const [deleting, setDeleting] = useState<Employee | null>(null);
  const [editing, setEditing] = useState<Employee | null>(null);

  return (
    <div className="space-y-4">
      <section className="glass-panel rounded-[2rem] text-foreground">
        <div className="flex flex-col gap-6 p-6 md:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Directory
            </p>
            <h1 className="mt-2 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              Everyone, in one table.
            </h1>
            <p className="mt-3 max-w-lg text-base text-muted-foreground">
              Search, sort, and keep the directory accurate. Add a person or jump into their
              reporting line.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-primary font-bold text-primary-foreground hover:bg-[color-mix(in_srgb,var(--color-primary),white_12%)]",
              )}
            >
              <Plus weight="bold" aria-hidden />
              Add employee
            </button>
            <Link
              to="/organisation"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-secondary font-bold text-foreground ring-1 ring-border hover:bg-[color-mix(in_srgb,var(--color-secondary),var(--color-foreground)_8%)]",
              )}
            >
              <TreeStructure weight="bold" aria-hidden />
              View organisation
            </Link>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] text-foreground">
        <div className="space-y-4 p-4 md:p-6">
          <label className="flex items-center gap-3 rounded-full border border-border/60 bg-[color-mix(in_srgb,var(--color-card),transparent_30%)] px-5 py-3 focus-within:ring-2 focus-within:ring-ring/50">
            <MagnifyingGlass
              size={20}
              weight="bold"
              aria-hidden
              className="text-muted-foreground"
            />
            <span className="sr-only">Search employees</span>
            <input
              type="search"
              value={directory.query}
              onChange={(e) => directory.setQuery(e.target.value)}
              placeholder="Search by name, role, email or employee number"
              className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            {directory.query && (
              <button
                type="button"
                onClick={() => directory.setQuery("")}
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </label>

          <EmployeeTable
            rows={directory.filtered}
            total={data?.length ?? 0}
            query={directory.query}
            isLoading={isLoading}
            isError={isError}
            sortKey={directory.sortKey}
            sortDir={directory.sortDir}
            onSort={directory.toggleSort}
            onClearSearch={() => directory.setQuery("")}
            onAddFirst={() => setAddOpen(true)}
            onDelete={(employee) => setDeleting(employee)}
            onEdit={(employee) => setEditing(employee)}
          />
        </div>
      </section>

      <AddEmployeeDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        managers={directory.managers}
      />

      <DeleteEmployeeDialog
        employee={deleting}
        all={data ?? []}
        onClose={() => setDeleting(null)}
      />
      <EditEmployeeDialog
        employee={editing}
        managers={directory.managers}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}