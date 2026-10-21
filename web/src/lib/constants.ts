export const FRIENDLY_ERRORS: Record<string, string> = {
  duplicate_email: "That email address is already used by another employee.",
  duplicate_employee_number: "That employee number is already in use.",
  not_found: "The selected manager no longer exists. Pick another one.",
  forbidden: "Only administrators can change employee records.",
  self_manager: "An employee cannot be their own manager.",
  circular_reporting_line: "That would create a circular reporting line.",
};

export const inputClass =
  "rounded-xl border border-border bg-[color-mix(in_srgb,var(--color-card),transparent_30%)] px-3 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground shadow-[inset_0_1px_0_var(--glass-shine)] backdrop-blur-sm focus:ring-2 focus:ring-ring/60 [color-scheme:light] dark:[color-scheme:dark]";