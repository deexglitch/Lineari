import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CaretRight, MagnifyingGlass, Table } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Matches HierarchyNode in the Lineari OpenAPI spec (GET /hierarchy). */
export type HierarchyNode = {
  id: string;
  name: string;
  surname: string;
  role: string;
  avatar_url: string;
  direct_report_count: number;
  children: HierarchyNode[];
};

type OrganisationPageProps = {
  roots?: HierarchyNode[];
  isLoading?: boolean;
  isError?: boolean;
};

const fullName = (n: HierarchyNode) => `${n.name} ${n.surname}`;

const initials = (n: HierarchyNode) =>
  `${n.name[0] ?? ""}${n.surname[0] ?? ""}`.toUpperCase();

/** Keeps matches and the managers above them, so results stay in context. */
function filterTree(nodes: HierarchyNode[], query: string): HierarchyNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;
  const out: HierarchyNode[] = [];
  for (const node of nodes) {
    const children = filterTree(node.children, query);
    const self = `${fullName(node)} ${node.role}`.toLowerCase().includes(q);
    if (self || children.length) {
      out.push({ ...node, children: self ? node.children : children });
    }
  }
  return out;
}

const countAll = (nodes: HierarchyNode[]): number =>
  nodes.reduce((sum, n) => sum + 1 + countAll(n.children), 0);

const depthOf = (nodes: HierarchyNode[]): number =>
  nodes.reduce((max, n) => Math.max(max, 1 + depthOf(n.children)), 0);

function PersonRow({
  node,
  depth,
  forceOpen,
}: {
  node: HierarchyNode;
  depth: number;
  forceOpen: boolean;
}) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = node.children.length > 0;
  const expanded = hasChildren && (open || forceOpen);
  const reports = node.direct_report_count;

  return (
    <li>
      <div className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-[#e0d6ec]/10">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={!hasChildren}
          aria-expanded={hasChildren ? expanded : undefined}
          aria-label={
            hasChildren
              ? `${expanded ? "Collapse" : "Expand"} ${fullName(node)}'s reports`
              : `${fullName(node)} has no reports`
          }
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-full text-[#e0d6ec] transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0d6ec]/60",
            hasChildren ? "hover:bg-[#e0d6ec]/15" : "opacity-0",
          )}
        >
          <CaretRight
            size={14}
            weight="bold"
            aria-hidden
            className={cn("transition-transform duration-200", expanded && "rotate-90")}
          />
        </button>

        <Avatar className="size-10 rounded-xl">
          <AvatarImage src={node.avatar_url} alt="" />
          <AvatarFallback className="rounded-xl bg-[#e0d6ec]/20 font-bold text-[#e0d6ec] ring-1 ring-[#e0d6ec]/25">
            {initials(node)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate font-bold leading-tight">{fullName(node)}</p>
          <p className="truncate text-sm text-[#e0d6ec]/70">{node.role}</p>
        </div>

        {reports > 0 && (
          <span className="shrink-0 rounded-full bg-[#e0d6ec]/12 px-3 py-1 text-xs font-semibold tabular-nums text-[#e0d6ec] ring-1 ring-[#e0d6ec]/20">
            {reports} {reports === 1 ? "report" : "reports"}
          </span>
        )}
      </div>

      {expanded && (
        <ul className="ml-6 border-l border-[#e0d6ec]/20 pl-3">
          {node.children.map((child) => (
            <PersonRow key={child.id} node={child} depth={depth + 1} forceOpen={forceOpen} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function OrganisationPage({ roots, isLoading, isError }: OrganisationPageProps) {
  const [query, setQuery] = useState("");
  const tree = roots ?? [];
  const visible = useMemo(() => filterTree(tree, query), [tree, query]);

  const total = countAll(tree);
  const levels = depthOf(tree);
  const searching = query.trim().length > 0;

  const buttonClass = cn(
    buttonVariants({ size: "lg" }),
    "rounded-full bg-[#e0d6ec] font-bold text-[#1a1424] hover:bg-[#e0d6ec]/90",
  );

  return (
    <div className="space-y-4">
      <section className="glass-panel rounded-[2rem] text-[#e0d6ec]">
        <div className="flex flex-col gap-8 p-6 md:p-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              Who reports to whom.
            </h1>
            <p className="mt-5 max-w-lg text-base text-[#e0d6ec]/85">
              Open any manager to see their team. Search by name or role to jump to a person.
            </p>
          </div>

          <dl className="flex gap-8">
            <div>
              <dt className="text-sm text-[#e0d6ec]/70">People</dt>
              <dd className="text-4xl font-extrabold tabular-nums">{isLoading ? "–" : total}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#e0d6ec]/70">Levels</dt>
              <dd className="text-4xl font-extrabold tabular-nums">{isLoading ? "–" : levels}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] text-[#e0d6ec]">
        <div className="space-y-5 p-4 md:p-6">
          <label className="glass-panel glass-panel--inset flex items-center gap-3 rounded-full px-5 py-3 focus-within:ring-2 focus-within:ring-[#e0d6ec]/50">
            <MagnifyingGlass size={20} weight="bold" aria-hidden />
            <span className="sr-only">Search the organisation</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or role"
              className="w-full bg-transparent text-base text-[#e0d6ec] outline-none placeholder:text-[#e0d6ec]/55"
            />
          </label>

          {isLoading ? (
            <div className="space-y-3" aria-busy="true">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-2xl bg-[#e0d6ec]/15" />
              ))}
            </div>
          ) : isError ? (
            <div className="px-2 py-6">
              <p className="text-lg font-bold">Couldn’t load the organisation.</p>
              <p className="mt-1 text-sm text-[#e0d6ec]/70">
                Check that the API is running at localhost:8000, then refresh.
              </p>
            </div>
          ) : visible.length > 0 ? (
            <ul aria-label="Organisation tree">
              {visible.map((node) => (
                <PersonRow key={node.id} node={node} depth={0} forceOpen={searching} />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-4 px-2 py-6">
              <p className="text-lg font-bold">
                {searching ? `No one matches “${query.trim()}”.` : "No employees to show yet."}
              </p>
              {searching ? (
                <button type="button" onClick={() => setQuery("")} className={buttonClass}>
                  Clear search
                </button>
              ) : (
                <Link to="/employees" className={buttonClass}>
                  <Table weight="bold" aria-hidden />
                  Add employees
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}