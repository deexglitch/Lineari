import { useState, type FormEvent } from "react";
import { Check } from "@phosphor-icons/react";
import { AuthField } from "@/components/molecules/auth-field";
import { useChangePassword } from "@/hooks/useAuth";
import { ApiError, messageFor } from "@/lib/api";

export function AccountPasswordCard() {
  const change = useChangePassword();
  const [saved, setSaved] = useState(false);
  const [mismatch, setMismatch] = useState<string | undefined>();

  const fieldErrors =
    change.error instanceof ApiError ? change.error.fieldErrors : {};

  const generalError =
    change.error && Object.keys(fieldErrors).length === 0
      ? messageFor(change.error)
      : null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMismatch(undefined);

    const form = event.currentTarget;
    const data = new FormData(form);
    const current = String(data.get("current_password") ?? "");
    const next = String(data.get("new_password") ?? "");
    const confirm = String(data.get("confirm_password") ?? "");

    if (next !== confirm) {
      setMismatch("Passwords do not match");
      return;
    }

    change.mutate(
      { current_password: current, new_password: next },
      {
        onSuccess: () => {
          form.reset();
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        },
      },
    );
  };

  return (
    <section className="glass-panel rounded-[2rem] text-foreground">
      <div className="p-6 md:p-8">
        <h2 className="text-xl font-extrabold tracking-tight">Password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a new password. Other devices stay signed in until their current session expires.
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <AuthField
            label="Current password"
            name="current_password"
            type="password"
            autoComplete="current-password"
            required
            error={fieldErrors.current_password}
            variant="themed"
          />
          <AuthField
            label="New password"
            name="new_password"
            type="password"
            autoComplete="new-password"
            required
            hint="At least 8 characters with upper and lower case letters, a number and a symbol."
            error={fieldErrors.new_password}
            variant="themed"
          />
          <AuthField
            label="Confirm new password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            required
            error={mismatch}
            variant="themed"
          />

          {generalError && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive ring-1 ring-destructive/30"
            >
              {generalError}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                <Check size={16} weight="bold" aria-hidden />
                Password updated
              </span>
            )}
            <button
              type="submit"
              disabled={change.isPending}
              className="rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground hover:bg-[color-mix(in_srgb,var(--color-primary),white_12%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
            >
              {change.isPending ? "Updating…" : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}