import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarBlank,
  CaretRight,
  EnvelopeSimple,
  IdentificationCard,
  TreeStructure,
  UserCircle,
  Users,
} from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { buttonVariants } from "@/components/atoms/button";
import { cn } from "@/lib/utils";
import type { HierarchyNode } from "@/lib/types";

export type ProfileUser = {
  name: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  created_at?: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function flatten(nodes: HierarchyNode[]): HierarchyNode[] {
  const out: HierarchyNode[] = [];
  const walk = (list: HierarchyNode[]) => {
    for (const n of list) {
      out.push(n);
      walk(n.children);
    }
  };
  walk(nodes);
  return out;
}

function findWithPath(
  nodes: HierarchyNode[],
  name: string,
  email?: string,
): { node: HierarchyNode; ancestors: HierarchyNode[] } | null {
  const target = name.trim().toLowerCase();
  const mail = email?.trim().toLowerCase();
  const walk = (list: HierarchyNode[], path: HierarchyNode[]): ReturnType<typeof findWithPath> => {
    for (const n of list) {
      const full = `${n.name} ${n.surname}`.trim().toLowerCase();
      const match =
        (mail && n.avatar_url?.toLowerCase().includes(mail)) || false || full === target;
      if (match) return { node: n, ancestors: path };
      const deeper = walk(n.children, [...path, n]);
      if (deeper) return deeper;
    }
    return null;
  };
  return walk(nodes, []);
}

function Stat({
  label,
  value,
  loading,
}: {
  label: string;
  value: string | number;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-[color-mix(in_srgb,var(--color-card),transparent_30%)] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums text-foreground">
        {loading ? "–" : value}
      </p>
    </div>
  );
}

function PersonChip({
  node,
  onClick,
  label,
}: {
  node: HierarchyNode;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-[color-mix(in_srgb,var(--color-card),transparent_40%)] px-3 py-2 text-left transition-colors",
        onClick && "hover:border-border hover:bg-[color-mix(in_srgb,var(--color-card),transparent_20%)]",
      )}
    >
      <Avatar className="size-9 rounded-xl">
        <AvatarImage src={node.avatar_url} alt="" />
        <AvatarFallback className="rounded-xl bg-primary/15 font-bold text-foreground ring-1 ring-border">
          {`${node.name[0] ?? ""}${node.surname[0] ?? ""}`.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        {label && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>
        )}
        <p className="truncate text-sm font-bold leading-tight text-foreground">
          {node.name} {node.surname}
        </p>
        <p className="truncate text-xs text-muted-foreground">{node.role}</p>
      </div>
      {onClick && <CaretRight size={14} weight="bold" className="shrink-0 text-muted-foreground" />}
    </button>
  );
}

export function ProfilePanel({
  user,
  total,
  topLevel,
  links,
  isLoading,
  hierarchy,
}: {
  user?: ProfileUser | null;
  total: number;
  topLevel: number;
  links: number;
  isLoading?: boolean;
  hierarchy?: HierarchyNode[];
}) {
  const firstName = user?.name.split(/\s+/)[0];
  const tree = hierarchy ?? [];
  const me = user ? findWithPath(tree, user.name, user.email) : null;

  const manager = me?.ancestors.length ? me.ancestors[me.ancestors.length - 1] : null;
  const reports = me?.node.children ?? [];
  const reportsTotal = me?.node.direct_report_count ?? reports.length;
  const chain = me?.ancestors ?? [];

  return (
    <section className="glass-panel rounded-[2rem] text-foreground">
      <div className="flex flex-col gap-8 p-6 md:p-10">
        {/* ---- Top block: the one and only identity block ---- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="size-16 shrink-0 rounded-2xl">
              {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
              <AvatarFallback className="rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
                {user ? initials(user.name) : <UserCircle size={28} weight="bold" aria-hidden />}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {firstName ? `Welcome back,` : "Your workspace"}
              </p>
              <h1 className="truncate text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
                {user ? user.name : "Not signed in"}
              </h1>
              <p className="truncate text-sm text-muted-foreground">
                {user?.role ?? "Role unavailable"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/organisation"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-primary font-bold text-primary-foreground hover:bg-[color-mix(in_srgb,var(--color-primary),white_12%)]",
              )}
            >
              <TreeStructure weight="bold" aria-hidden />
              Organisation
            </Link>
            <Link
              to="/employees"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-secondary font-bold text-foreground ring-1 ring-border hover:bg-[color-mix(in_srgb,var(--color-secondary),var(--color-foreground)_8%)]",
              )}
            >
              Employees
              <ArrowRight weight="bold" aria-hidden />
            </Link>
          </div>
        </div>

        {/* ---- Small facts row, no second avatar ---- */}
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <EnvelopeSimple size={16} weight="bold" aria-hidden />
            <span className="truncate">{user?.email ?? "No email"}</span>
          </li>
          <li className="flex items-center gap-2">
            <IdentificationCard size={16} weight="bold" aria-hidden />
            <span>Lineari account</span>
          </li>
          {user?.created_at && (
            <li className="flex items-center gap-2">
              <CalendarBlank size={16} weight="bold" aria-hidden />
              <span>
                Member since{" "}
                {new Date(user.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </li>
          )}
        </ul>

        {/* ---- Team summary ---- */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Reporting line
            </h2>

            {isLoading ? (
              <div className="h-24 animate-pulse rounded-2xl bg-muted" />
            ) : !me ? (
              <p className="rounded-2xl border border-border/60 px-4 py-3 text-sm text-muted-foreground">
                {tree.length === 0
                  ? "No employees in the directory yet."
                  : "Couldn't match your account to an employee record."}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {manager ? (
                  <PersonChip node={manager} label="Reports to" />
                ) : (
                  <div className="rounded-2xl border border-border/60 px-4 py-3 text-sm text-muted-foreground">
                    {chain.length === 0 ? "No manager — top of the tree." : "Manager not shown."}
                  </div>
                )}

                <div className="rounded-2xl border border-border/60 bg-[color-mix(in_srgb,var(--color-card),transparent_40%)] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    You
                  </p>
                  <p className="truncate text-sm font-bold text-foreground">
                    {me.node.name} {me.node.surname}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{me.node.role}</p>
                </div>

                {chain.length > 1 && (
                  <div className="rounded-2xl border border-dashed border-border/70 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Chain above
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {chain
                        .slice(0, -1)
                        .map((a) => `${a.name} ${a.surname}`)
                        .join(" → ")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Your team
              </h2>
              <span className="text-xs font-semibold text-muted-foreground">
                {reportsTotal} {reportsTotal === 1 ? "report" : "reports"}
              </span>
            </div>

            {isLoading ? (
              <div className="h-24 animate-pulse rounded-2xl bg-muted" />
            ) : !me || reports.length === 0 ? (
              <p className="rounded-2xl border border-border/60 px-4 py-3 text-sm text-muted-foreground">
                {me
                  ? "No direct reports yet."
                  : "Sign-in data not available for this workspace."}
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {reports.slice(0, 6).map((r) => (
                  <li key={r.id}>
                    <PersonChip node={r} />
                  </li>
                ))}
                {reports.length > 6 && (
                  <li>
                    <Link
                      to="/organisation"
                      className="flex items-center justify-between rounded-2xl border border-border/60 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                    >
                      {reports.length - 6} more
                      <CaretRight size={14} weight="bold" />
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* ---- Workspace stats ---- */}
        <div className="grid grid-cols-3 gap-3">
          <Stat label="People" value={total} loading={isLoading} />
          <Stat label="Top-level" value={topLevel} loading={isLoading} />
          <Stat label="Links" value={links} loading={isLoading} />
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Users size={16} weight="bold" aria-hidden />
            You are part of this workspace
          </span>
          <Link to="/account" className="font-bold text-primary hover:underline">
            Account settings
          </Link>
        </div>
      </div>
    </section>
  );
}