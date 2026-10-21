import { Link } from "react-router-dom";
import { PencilSimple, Trash, TreeStructure } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { fullName, initials } from "@/lib/format";
import type { Employee } from "@/hooks/useEmployeeDirectory";

export function EmployeeRow({
  employee,
  onEdit,
  onDelete,
}: {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
}) {
  return (
    <li className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-border/60 bg-[color-mix(in_srgb,var(--color-card),transparent_40%)] px-4 py-3 md:grid-cols-[2.2fr_1.6fr_1.6fr_1fr_6rem] md:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-10 rounded-xl">
          <AvatarImage src={employee.avatar_url} alt="" />
          <AvatarFallback className="rounded-xl bg-primary/15 font-bold text-foreground ring-1 ring-border">
            {initials(employee)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-bold leading-tight text-foreground">
            {fullName(employee)}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {employee.emp_number} · {employee.role}
          </p>
        </div>
      </div>

      <div className="min-w-0 text-sm text-foreground">
        <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground md:hidden">
          Role{" "}
        </span>
        {employee.role}
      </div>

      <div className="min-w-0 text-sm text-muted-foreground">
        <span className="text-xs uppercase tracking-[0.14em] md:hidden">Manager </span>
        {employee.manager_name ?? "—"}
      </div>

      <div className="min-w-0 truncate text-sm text-muted-foreground">
        <span className="text-xs uppercase tracking-[0.14em] md:hidden">Email </span>
        {employee.email}
      </div>

      <div className="flex items-center gap-1 md:justify-end">
        <Link
          to={`/organisation?focus=${employee.id}`}
          className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label={`View ${fullName(employee)} in the organisation`}
          title="View in organisation"
        >
          <TreeStructure size={16} weight="bold" aria-hidden />
        </Link>

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(employee)}
            className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label={`Edit ${fullName(employee)}`}
            title="Edit"
          >
            <PencilSimple size={16} weight="bold" aria-hidden />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(employee)}
            className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Delete ${fullName(employee)}`}
            title="Delete"
          >
            <Trash size={16} weight="bold" aria-hidden />
          </button>
        )}
      </div>
    </li>
  );
}