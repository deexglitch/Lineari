import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { List, TreeStructure } from "@phosphor-icons/react";
import { OrganisationSearch } from "@/components/molecules/organisation-search";
import { OrganisationTree } from "@/components/organisms/organisation-tree";
import { OrganisationTreeGraph } from "@/components/organisms/organisation-tree-graph";
import { countAll, depthOf, filterTree } from "@/lib/tree";
import type { HierarchyNode } from "@/lib/types";
import { cn } from "@/lib/utils";

type OrganisationPageProps = {
  roots?: HierarchyNode[];
  isLoading?: boolean;
  isError?: boolean;
};

type ViewMode = "list" | "graph";

const VIEW_KEY = "lineari_org_view";

function usePersistedView(): [ViewMode, (v: ViewMode) => void] {
  const [view, setView] = useState<ViewMode>(() => {
    try {
      const v = localStorage.getItem(VIEW_KEY);
      return v === "graph" ? "graph" : "list";
    } catch {
      return "list";
    }
  });
  const set = (v: ViewMode) => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      // Ignore storage errors; the in-memory view still updates.
    }
  };
  return [view, set];
}

function pathTo(nodes: HierarchyNode[], id: string): HierarchyNode[] | null {
  for (const node of nodes) {
    if (node.id === id) return [node];
    const deeper = pathTo(node.children, id);
    if (deeper) return [node, ...deeper];
  }
  return null;
}

function pruneToPath(nodes: HierarchyNode[], id: string): HierarchyNode[] {
  const out: HierarchyNode[] = [];
  for (const node of nodes) {
    if (node.id === id) {
      out.push(node);
      continue;
    }
    const children = pruneToPath(node.children, id);
    if (children.length) out.push({ ...node, children });
  }
  return out;
}

const VIEWS: { key: ViewMode; label: string; icon: React.ReactNode }[] = [
  { key: "list", label: "List", icon: <List size={16} weight="bold" /> },
  { key: "graph", label: "Graph", icon: <TreeStructure size={16} weight="bold" /> },
];

export default function OrganisationPage({ roots, isLoading, isError }: OrganisationPageProps) {
  const [params] = useSearchParams();
  const focusId = params.get("focus") ?? "";
  const [query, setQuery] = useState("");
  const [view, setView] = usePersistedView();
  const tree = roots ?? [];

  const searched = useMemo(() => filterTree(tree, query), [tree, query]);
  const visible = useMemo(() => {
    if (!focusId) return searched;
    if (query.trim()) return searched;
    return pruneToPath(searched, focusId);
  }, [searched, focusId, query]);

  const total = countAll(tree);
  const levels = depthOf(tree);
  const focusPath = focusId ? pathTo(tree, focusId) : null;
  const focusNode = focusPath?.[focusPath.length - 1] ?? null;

  return (
    <div className="space-y-4">
      <section className="glass-panel rounded-[2rem] text-foreground">
        <div className="flex flex-col gap-8 p-6 md:p-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              {focusNode ? `${focusNode.name} ${focusNode.surname}` : "Who reports to whom."}
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground">
              {focusNode
                ? `${focusNode.role} · focused view. Clear the filter to see the whole tree.`
                : "Open any manager to see their team. Search by name or role to jump to a person."}
            </p>
          </div>

          <dl className="flex gap-8">
            <div>
              <dt className="text-sm text-muted-foreground">People</dt>
              <dd className="text-4xl font-extrabold tabular-nums text-foreground">
                {isLoading ? "–" : total}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Levels</dt>
              <dd className="text-4xl font-extrabold tabular-nums text-foreground">
                {isLoading ? "–" : levels}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] text-foreground">
        <div className="space-y-5 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <OrganisationSearch value={query} onChange={setQuery} />

            <div
              role="tablist"
              aria-label="Organisation view"
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border/60 bg-[color-mix(in_srgb,var(--color-card),transparent_40%)] p-1"
            >
              {VIEWS.map((v) => {
                const active = v.key === view;
                return (
                  <button
                    key={v.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setView(v.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {v.icon}
                    {v.label}
                  </button>
                );
              })}
            </div>
          </div>

          {view === "list" ? (
            <OrganisationTree
              roots={visible}
              isLoading={isLoading}
              isError={isError}
              query={query}
              focusId={focusId}
              onClearSearch={() => setQuery("")}
            />
          ) : (
            <OrganisationTreeGraph
              roots={visible}
              isLoading={isLoading}
              isError={isError}
              query={query}
              onClearSearch={() => setQuery("")}
            />
          )}
        </div>
      </section>
    </div>
  );
}