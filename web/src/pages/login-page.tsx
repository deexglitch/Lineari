import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { SignIn } from "@phosphor-icons/react";
import { AuthField } from "@/components/molecules/auth-field";
import { AuthLayout, authButtonClass, authLinkClass } from "@/components/templates/auth-layout";
import { useLogin } from "@/hooks/useAuth";
import { messageFor } from "@/lib/api";

export default function LoginPage() {
  const login = useLogin();

  // On success useLogin stores the user and RedirectIfAuthed moves the page on.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    login.mutate({
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
    });
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Use your Lineari account to open the organisation."
      footer={
  <>
    New to Lineari?{" "}
    <Link to="/signup" className={authLinkClass}>
      Create an account
    </Link>
    {" · "}
    <Link to="/terms" className={authLinkClass}>
      Terms
    </Link>
  </>
}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate={false}>
        <AuthField label="Email" name="email" type="email" autoComplete="email" required />
        <AuthField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />

        {login.error && (
          <p role="alert" className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold ring-1 ring-[#ff8f77]/50">
            {messageFor(login.error)}
          </p>
        )}

        <button type="submit" disabled={login.isPending} className={authButtonClass}>
          <SignIn weight="bold" aria-hidden />
          {login.isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>

    
  );
}