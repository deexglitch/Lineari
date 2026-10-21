import { useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { PencilSimple, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useUpdateEmployee } from "@/hooks/useUpdateEmployee";
import type { Employee } from "@/hooks/useEmployeeDirectory";
import { FRIENDLY_ERRORS } from "@/lib/constants";

export type ManagerOption = { id: string; label: string };



const inputClass =
  "rounded-xl border border-border bg-background px-3 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/60 [color-scheme:light] dark:[color-scheme:dark]";

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm font-semibold", className)}>
      {label}
      {children}
    </label>
  );
}

export function EditEmployeeDialog({
  employee,
  managers,
  onClose,
}: {
  employee: Employee | null;
  managers: ManagerOption[];
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const update = useUpdateEmployee();

  const open = employee !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!employee) return;
    update.reset();
    formRef.current?.reset();
  }, [employee?.id]);

  const close = () => {
    update.reset();
    onClose();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!employee) return;
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    update.mutate(
      {
        id: employee.id,
        body: {
          name: text("name"),
          surname: text("surname"),
          email: text("email"),
          birth_date: text("birth_date"),
          emp_number: text("emp_number"),
          salary: Number(text("salary")),
          role: text("role"),
          manager_id: text("manager_id") || null,
        },
      },
      { onSuccess: close },
    );
  };

  const error = update.error
    ? (FRIENDLY_ERRORS[update.error.code ?? ""] ?? update.error.message)
    : null;

  // Exclude the person being edited from the manager list so they can't pick themselves.
  const managerOptions = managers.filter((m) => m.id !== employee?.id);

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      onClick={(e) => e.target === e.currentTarget && close()}
      aria-labelledby="edit-employee-title"
      className="m-auto w-[min(40rem,calc(100%-2rem))] max-h-[calc(100%-2rem)] overflow-y-auto rounded-[2rem] bg-card p-0 text-foreground shadow-2xl ring-1 ring-border backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="edit-employee-title" className="text-2xl font-extrabold tracking-tight">
            Edit employee
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
          <p className="mt-2 text-sm text-muted-foreground">
            Editing{" "}
            <span className="font-bold text-foreground">
              {employee.name} {employee.surname}
            </span>
            . Only the fields you change are updated on the server.
          </p>
        )}

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="mt-6 grid gap-4 sm:grid-cols-2"
          key={employee?.id ?? "none"}
        >
          <Field label="First name">
            <input
              name="name"
              required
              maxLength={100}
              autoComplete="off"
              defaultValue={employee?.name ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Surname">
            <input
              name="surname"
              required
              maxLength={100}
              autoComplete="off"
              defaultValue={employee?.surname ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Email" className="sm:col-span-2">
            <input
              name="email"
              type="email"
              required
              autoComplete="off"
              defaultValue={employee?.email ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Employee number">
            <input
              name="emp_number"
              required
              maxLength={32}
              autoComplete="off"
              defaultValue={employee?.emp_number ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Role">
            <input
              name="role"
              required
              maxLength={100}
              autoComplete="off"
              defaultValue={employee?.role ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Date of birth">
            <input
              name="birth_date"
              type="date"
              required
              defaultValue={employee?.birth_date ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Salary">
            <input
              name="salary"
              type="number"
              required
              min={0}
              step="0.01"
              inputMode="decimal"
              defaultValue={employee?.salary ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Reports to" className="sm:col-span-2">
            <select
              name="manager_id"
              defaultValue={employee?.manager_id ?? ""}
              className={inputClass}
            >
              <option value="">No manager</option>
              {managerOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </Field>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive ring-1 ring-destructive/30 sm:col-span-2"
            >
              {error}
            </p>
          )}

          <div className="mt-2 flex flex-wrap justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={close}
              className="rounded-full px-5 py-2.5 font-bold ring-1 ring-border hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={update.isPending}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground hover:bg-[color-mix(in_srgb,var(--color-primary),white_12%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
            >
              <PencilSimple weight="bold" aria-hidden />
              {update.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}