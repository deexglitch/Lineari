import { Navigate } from "react-router-dom";
import { LineariMark } from "@/components/atoms/lineari-mark";
import { AccountProfileCard } from "@/components/organisms/account-profile-card";
import { AccountPasswordCard } from "@/components/organisms/account-pasword-card";
import { useMe } from "@/hooks/useAuth";

export default function AccountPage() {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="grid min-h-[40vh] place-items-center" role="status" aria-label="Loading">
        <LineariMark className="size-14 animate-pulse" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="space-y-4">
      <section className="glass-panel rounded-[2rem] text-foreground">
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Account
          </p>
          <h1 className="mt-2 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
            Manage your account.
          </h1>
          <p className="mt-3 max-w-lg text-base text-muted-foreground">
            Update the name and email shown across the app, or change your password.
            Employee records are edited separately from the Employees page.
          </p>
        </div>
      </section>

      <AccountProfileCard user={user} />
      <AccountPasswordCard />
    </div>
  );
}