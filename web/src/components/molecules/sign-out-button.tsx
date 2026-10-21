import { SignOut } from "@phosphor-icons/react";
import { useLogout } from "@/hooks/useAuth";

/** Once the session is cleared, RequireAuth sends the person back to /login. */
export function SignOutButton() {
  const logout = useLogout();
  return (
    <button
      type="button"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-bold text-foreground ring-1 ring-border hover:bg-[color-mix(in_srgb,var(--color-secondary),var(--color-foreground)_6%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
    >
      <SignOut weight="bold" aria-hidden />
      Sign out
    </button>
  );
}