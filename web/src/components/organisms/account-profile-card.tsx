import { useState, type FormEvent } from "react";
import { Check } from "@phosphor-icons/react";
import { AuthField } from "@/components/molecules/auth-field";
import { useUpdateProfile } from "@/hooks/useAuth";
import { ApiError, messageFor } from "@/lib/api";
import type { AuthUser } from "@/hooks/useAuth";

export function AccountProfileCard({ user }: { user: AuthUser }) {
  const update = useUpdateProfile();
  const [saved, setSaved] = useState(false);

  const fieldErrors =
    update.error instanceof ApiError ? update.error.fieldErrors : {};

  const generalError =
    update.error && Object.keys(fieldErrors).length === 0
      ? messageFor(update.error)
      : null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "").trim();

    const next = {
      first_name: text("first_name"),
      last_name: text("last_name"),
      email: text("email"),
    };

    // Only send fields that actually changed; the backend uses exclude_unset.
    const body: Record<string, string> = {};
    if (next.first_name !== user.first_name) body.first_name = next.first_name;
    if (next.last_name !== user.last_name) body.last_name = next.last_name;
    if (next.email !== user.email) body.email = next.email;

    if (Object.keys(body).length === 0) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      return;
    }

    update.mutate(body, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      },
    });
  };

  return (
    <section className="glass-panel rounded-[2rem] text-foreground">
      <div className="p-6 md:p-8">
        <h2 className="text-xl font-extrabold tracking-tight">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The name shown across Lineari and the email you use to sign in.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <AuthField
            label="First name"
            name="first_name"
            defaultValue={user.first_name}
            maxLength={100}
            autoComplete="given-name"
            required
            error={fieldErrors.first_name}
            variant="themed"
          />
          <AuthField
            label="Last name"
            name="last_name"
            defaultValue={user.last_name}
            maxLength={100}
            autoComplete="family-name"
            required
            error={fieldErrors.last_name}
            variant="themed"
          />
          <AuthField
            label="Email"
            name="email"
            type="email"
            defaultValue={user.email}
            autoComplete="email"
            className="sm:col-span-2"
            required
            error={fieldErrors.email}
            variant="themed"
          />

          {generalError && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive ring-1 ring-destructive/30 sm:col-span-2"
            >
              {generalError}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center justify-end gap-3 sm:col-span-2">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                <Check size={16} weight="bold" aria-hidden />
                Saved
              </span>
            )}
            <button
              type="submit"
              disabled={update.isPending}
              className="rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground hover:bg-[color-mix(in_srgb,var(--color-primary),white_12%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
            >
              {update.isPending ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}