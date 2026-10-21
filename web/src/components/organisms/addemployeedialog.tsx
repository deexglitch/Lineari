import { useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { UserPlus, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useCreateEmployee } from "@/hooks/useCreateEmployee";

export type ManagerOption = { id: string; label: string };

const FRIENDLY_ERRORS: Record<string, string> = {
  duplicate_email: "That email address is already used by another employee.",
  duplicate_employee_number: "That employee number is already in use.",
  not_found: "The selected manager no longer exists. Pick another one.",
};

const inputClass =
  "rounded-xl bg-[#e0d6ec]/10 px-3 py-2.5 text-base font-normal text-[#e0d6ec] ring-1 ring-[#e0d6ec]/25 outline-none placeholder:text-[#e0d6ec]/45 focus:ring-2 focus:ring-[#e0d6ec]/60 [color-scheme:dark]";

function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm font-semibold", className)}>
      {label}
      {children}
    </label>
  );
}

export function AddEmployeeDialog({
  open,
  onClose,
  managers,
}: {
  open: boolean;
  onClose: () => void;
  managers: ManagerOption[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const create = useCreateEmployee();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => {
    create.reset();
    formRef.current?.reset();
    onClose();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    create.mutate(
      {
        name: text("name"),
        surname: text("surname"),
        email: text("email"),
        birth_date: text("birth_date"),
        emp_number: text("emp_number"),
        salary: Number(text("salary")),
        role: text("role"),
        manager_id: text("manager_id") || null,
      },
      { onSuccess: close },
    );
  };

  const error = create.error
    ? (FRIENDLY_ERRORS[create.error.code ?? ""] ?? create.error.message)
    : null;

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      onClick={(e) => e.target === e.currentTarget && close()}
      aria-labelledby="add-employee-title"
      className="m-auto w-[min(40rem,calc(100%-2rem))] max-h-[calc(100%-2rem)] overflow-y-auto rounded-[2rem] bg-linear-to-br from-[#2c2638]/90 to-[#0e0a16]/90 p-0 text-[#e0d6ec] shadow-2xl ring-1 ring-[#e0d6ec]/15 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="add-employee-title" className="text-2xl font-extrabold tracking-tight">
            Add employee
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full hover:bg-[#e0d6ec]/15 focus-visible:outline-2 focus-visible:outline-[#e0d6ec]/60"
          >
            <X size={18} weight="bold" aria-hidden />
          </button>
        </div>

        <form ref={formRef} onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <input name="name" required maxLength={100} autoComplete="off" className={inputClass} />
          </Field>
          <Field label="Surname">
            <input name="surname" required maxLength={100} autoComplete="off" className={inputClass} />
          </Field>
          <Field label="Email" className="sm:col-span-2">
            <input name="email" type="email" required autoComplete="off" className={inputClass} />
          </Field>
          <Field label="Employee number">
            <input name="emp_number" required maxLength={32} autoComplete="off" className={inputClass} />
          </Field>
          <Field label="Role">
            <input name="role" required maxLength={100} autoComplete="off" className={inputClass} />
          </Field>
          <Field label="Date of birth">
            <input name="birth_date" type="date" required className={inputClass} />
          </Field>
          <Field label="Salary">
            <input name="salary" type="number" required min={0} step="0.01" inputMode="decimal" className={inputClass} />
          </Field>
          <Field label="Reports to" className="sm:col-span-2">
            <select name="manager_id" defaultValue="" className={inputClass}>
              <option value="">No manager</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </Field>

          {error && (
            <p role="alert" className="rounded-xl bg-[#e0d6ec]/10 px-4 py-3 text-sm font-semibold ring-1 ring-[#e0d6ec]/30 sm:col-span-2">
              {error}
            </p>
          )}

          <div className="mt-2 flex flex-wrap justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={close}
              className="rounded-full px-5 py-2.5 font-bold ring-1 ring-[#e0d6ec]/30 hover:bg-[#e0d6ec]/10 focus-visible:outline-2 focus-visible:outline-[#e0d6ec]/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={create.isPending}
              className="inline-flex items-center gap-2 rounded-full bg-[#e0d6ec] px-5 py-2.5 font-bold text-[#1a1424] hover:bg-[#e0d6ec]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0d6ec] disabled:opacity-60"
            >
              <UserPlus weight="bold" aria-hidden />
              {create.isPending ? "Adding employee…" : "Add employee"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}