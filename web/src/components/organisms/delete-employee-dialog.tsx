import { useEffect, useMemo, useRef, useState } from "react";
import { Trash, X } from "@phosphor-icons/react";
import { FRIENDLY_ERRORS } from "@/lib/constants";
import { useDeleteEmployee } from "@/hooks/useDeleteEmployee";
import type { Employee } from "@/hooks/useEmployeeDirectory";
import { cn } from "@/lib/utils";

export function DeleteEmployeeDialog({
  employee,
  all,
  onClose,
}: {
  employee: Employee | null;
  all: Employee[];
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const remove = useDeleteEmployee();
  const [mode, setMode] = useState<"none" | "reassign">("none");
  const [managerId, setManagerId] = useState<string>("");

  const open = employee !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!employee) return;
    setMode("none");
    setManagerId("");
    remove.reset();
  }, [employee?.id]);

  const reports = useMemo(
    () => (employee ? all.filter((e) => e.manager_id === employee.id) : []),
    [employee, all],
  );

  const forbidden = useMemo(() => {
    const set = new Set<string>();
    if (!employee) return set;
    set.add(employee.id);
    let frontier = [employee.id];
    while (frontier.length) {
      const next: string[] = [];
      for (const e of all) {
        if (e.manager_id && frontier.includes(e.manager_id)) {
          if (!set.has(e.id)) {
            set.add(e.id);
            next.push(e.id);
          }
        }
      }
      frontier = next;
    }
    return set;
  }, [employee, all]);

  const managerOptions = useMemo(
    () => all.filter((e) => !forbidden.has(e.id)),
    [all, forbidden],
  );

  const close = () => {
    remove.reset();
    onClose();
  };

  const submit = () => {
    if (!employee) return;
    remove.mutate(
      {
        id: employee.id,
        reassign_reports_to: mode === "reassign" ? managerId || null : null,
        reassign_to_none: mode === "none" && reports.length > 0,
      },
      { onSuccess: close },
    );
  };

  const error = remove.error
    ? (FRIENDLY_ERRORS[remove.error.code ?? ""] ?? remove.error.message)
    : null;

  const canSubmit =
    !remove.isPending &&
    (reports.length === 0 || mode === "none" || (mode === "reassign" && managerId));

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      onClick={(e) => e.target === e.currentTarget && close()}
      aria-labelledby="delete-employee-title"
      className="m-auto w-[min(34rem,calc(100%-2rem))] max-h-[calc(100%-2rem)] overflow-y-auto rounded-[2rem] bg-[color-mix(in_srgb,var(--color-card),var(--color-background)_40%)] p-0 text-foreground shadow-2xl ring-1 ring-border backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="delete-employee-title" className="text-2xl font-extrabold tracking-tight">
            Delete employee
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
          >
            <X size={18} weight="bold" aria-hidden />
          </button>
        </div>

        {employee && (
          <p className="mt-3 text-sm text-muted-foreground">
            You are about to permanently delete{" "}
            <span className="font-bold text-foreground">
              {employee.name} {employee.surname}
            </span>{" "}
            ({employee.role}). This cannot be undone.
          </p>
        )}

        {reports.length > 0 && (
          <div className="mt-5 space-y-3">
            <p className="text-sm font-bold text-foreground">
              This person has {reports.length}{" "}
              {reports.length === 1 ? "direct report" : "direct reports"}. What should happen to
              them?
            </p>

            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3",
                mode === "none" ? "border-primary bg-primary/5" : "border-border/60",
              )}
            >
              <input
                type="radio"
                name="delete-mode"
                checked={mode === "none"}
                onChange={() => setMode("none")}
                className="mt-0.5 accent-[var(--color-primary)]"
              />
              <span>
                <span className="block text-sm font-bold text-foreground">
                  Leave them with no manager
                </span>
                <span className="block text-xs text-muted-foreground">
                  They stay in the directory as top-level employees.
                </span>
              </span>
            </label>

            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3",
                mode === "reassign" ? "border-primary bg-primary/5" : "border-border/60",
              )}
            >
              <input
                type="radio"
                name="delete-mode"
                checked={mode === "reassign"}
                onChange={() => setMode("reassign")}
                className="mt-0.5 accent-[var(--color-primary)]"
              />
              <span className="flex-1">
                <span className="block text-sm font-bold text-foreground">
                  Move them to another manager
                </span>
                <span className="block text-xs text-muted-foreground">
                  Pick someone in the directory who doesn't sit under this employee.
                </span>
                <select
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  disabled={mode !== "reassign"}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50"
                >
                  <option value="">Choose a manager…</option>
                  {managerOptions.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.surname} — {m.role}
                    </option>
                  ))}
                </select>
              </span>
            </label>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive ring-1 ring-destructive/30"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={close}
            className="rounded-full px-5 py-2.5 font-bold ring-1 ring-border hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-2.5 font-bold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive disabled:opacity-60"
          >
            <Trash weight="bold" aria-hidden />
            {remove.isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </dialog>
  );
}