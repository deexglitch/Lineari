import { Link } from "react-router-dom";
import { UserCircle } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { buttonVariants } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

export type ProfileUser = {
  name: string;
  email?: string;
  role?: string;
  /** Gravatar URL once you build it from the user's email hash. */
  avatarUrl?: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ProfileCard({ user }: { user?: ProfileUser | null }) {
  return (
    <aside
      aria-label="Signed-in profile"
      className="glass-panel glass-panel--inset flex flex-col gap-5 rounded-3xl p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#e0d6ec]">
          Signed-in profile
        </h2>
        <Badge className="rounded-full bg-[#e0d6ec] px-3 text-[#1a1424] hover:bg-[#e0d6ec]">
          {user ? "Connected" : "Not connected"}
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="size-14 rounded-2xl">
          {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
          <AvatarFallback className="rounded-2xl bg-[#e0d6ec] text-lg font-bold text-[#1a1424]">
            {user ? initials(user.name) : <UserCircle size={28} weight="bold" aria-hidden />}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-xl font-extrabold leading-tight">
            {user ? user.name : "No user session connected"}
          </p>
          <p className="truncate text-sm text-[#e0d6ec]/80">
            {user?.email ?? "No email available"}
          </p>
        </div>
      </div>

      <p className="text-sm text-[#e0d6ec]/80">
        {user
          ? (user.role ?? "Role or access level unavailable")
          : "Connect authentication to display account details."}
      </p>

      <Link
        to="/account"
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-auto rounded-full bg-[#e0d6ec] font-bold text-[#1a1424] hover:bg-[#e0d6ec]/90",
        )}
      >
        Account settings
      </Link>
    </aside>
  );
}