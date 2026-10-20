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
      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/25 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-lime disabled:opacity-60"
    >
      <SignOut weight="bold" aria-hidden />
      Sign out
    </button>
  );
}