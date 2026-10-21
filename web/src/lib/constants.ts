export const FRIENDLY_ERRORS: Record<string, string> = {
  duplicate_email: "That email address is already used by another employee.",
  duplicate_employee_number: "That employee number is already in use.",
  not_found: "The selected manager no longer exists. Pick another one.",
  forbidden: "Only administrators can change employee records.",
  self_manager: "An employee cannot be their own manager.",
  circular_reporting_line: "That would create a circular reporting line.",
};

export const inputClass =
  "rounded-xl bg-[#e0d6ec]/10 px-3 py-2.5 text-base font-normal text-[#e0d6ec] ring-1 ring-[#e0d6ec]/25 outline-none placeholder:text-[#e0d6ec]/45 focus:ring-2 focus:ring-[#e0d6ec]/60 [color-scheme:dark]";