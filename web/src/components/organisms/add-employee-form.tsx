import { type FormEvent, type Ref } from "react";
import { UserPlus } from "@phosphor-icons/react";
import { Field } from "@/components/molecules/employee-form-field";
import { inputClass } from "@/lib/constants";

export type ManagerOption = { id: string; label: string };

export type EmployeeFormValues = {
  name: string;
  surname: string;
  email: string;
  birth_date: string;
  emp_number: string;
  salary: number;
  role: string;
  manager_id: string | null;
};

export function AddEmployeeForm({
  managers,
  onSubmit,
  onCancel,
  isPending,
  error,
  formRef,
}: {
  managers: ManagerOption[];
  onSubmit: (values: EmployeeFormValues) => void;
  onCancel: () => void;
  isPending: boolean;
  error: string | null;
  formRef?: Ref<HTMLFormElement>;
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    onSubmit({
      name: text("name"),
      surname: text("surname"),
      email: text("email"),
      birth_date: text("birth_date"),
      emp_number: text("emp_number"),
      salary: Number(text("salary")),
      role: text("role"),
      manager_id: text("manager_id") || null,
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
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
          onClick={onCancel}
          className="rounded-full px-5 py-2.5 font-bold ring-1 ring-[#e0d6ec]/30 hover:bg-[#e0d6ec]/10 focus-visible:outline-2 focus-visible:outline-[#e0d6ec]/60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-[#e0d6ec] px-5 py-2.5 font-bold text-[#1a1424] hover:bg-[#e0d6ec]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0d6ec] disabled:opacity-60"
        >
          <UserPlus weight="bold" aria-hidden />
          {isPending ? "Adding employee…" : "Add employee"}
        </button>
      </div>
    </form>
  );
}