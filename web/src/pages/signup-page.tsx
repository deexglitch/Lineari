import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "@phosphor-icons/react";
import { AuthField } from "@/components/molecules/auth-field";
import { AuthLayout, authButtonClass, authLinkClass } from "@/components/templates/auth-layout";
import { useSignup } from "@/hooks/useAuth";
import { ApiError, messageFor, type FieldErrors } from "@/lib/api";

export default function SignupPage() {
  const signup = useSignup();
  const [localErrors, setLocalErrors] = useState<FieldErrors>({});

  const serverErrors = signup.error instanceof ApiError ? signup.error.fieldErrors : {};
  const errorFor = (name: string) => localErrors[name] ?? serverErrors[name];
  // Anything that is not tied to one field (duplicate email, server down) shows above the button.
  const generalError =
    signup.error && Object.keys(serverErrors).length === 0 ? messageFor(signup.error) : null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    const password = String(data.get("password") ?? "");

    const problems: FieldErrors = {};
    if (password !== String(data.get("confirm_password") ?? "")) {
      problems.confirm_password = "Passwords do not match";
    }
    if (!data.get("terms")) problems.terms = "You need to agree to continue";
    setLocalErrors(problems);
    if (Object.keys(problems).length > 0) return;

    signup.mutate({
      first_name: text("first_name"),
      last_name: text("last_name"),
      email: text("email"),
      password,
    });
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up access to your organisation's reporting lines."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className={authLinkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField
            label="First name"
            name="first_name"
            autoComplete="given-name"
            maxLength={100}
            required
            error={errorFor("first_name")}
          />
          <AuthField
            label="Last name"
            name="last_name"
            autoComplete="family-name"
            maxLength={100}
            required
            error={errorFor("last_name")}
          />
        </div>
        <AuthField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={errorFor("email")}
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          hint="At least 8 characters with upper and lower case letters, a number and a symbol."
          error={errorFor("password")}
        />
        <AuthField
          label="Confirm password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          required
          error={errorFor("confirm_password")}
        />

        <div>
  <div className="flex items-start gap-3 text-sm">
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        name="terms"
        aria-invalid={errorFor("terms") ? true : undefined}
        className="mt-0.5 size-4 shrink-0 accent-[#0b6e6a]"
      />
      <span>I agree to the</span>
    </label>
    <Link to="/terms" className={authLinkClass}>
      terms of use
    </Link>
  </div>
  {errorFor("terms") && (
    <p role="alert" className="mt-1.5 text-sm font-semibold text-[#ff8f77]">
      {errorFor("terms")}
    </p>
  )}
</div>

        {generalError && (
          <p role="alert" className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold ring-1 ring-[#ff8f77]/50">
            {generalError}
          </p>
        )}

        <button type="submit" disabled={signup.isPending} className={authButtonClass}>
          <UserPlus weight="bold" aria-hidden />
          {signup.isPending ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}