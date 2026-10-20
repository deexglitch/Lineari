import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { OrganisationSearch } from "@/components/molecules/organisation-search";
import { OrganisationTree } from "@/components/organisms/organisation-tree";
import { countAll, depthOf, filterTree } from "@/lib/tree";
import type { HierarchyNode } from "@/lib/types";

type OrganisationPageProps = {
  roots?: HierarchyNode[];
  isLoading?: boolean;
  isError?: boolean;
};

/** Returns the path of nodes from the root down to the node with `id`, or null. */
function pathTo(
  nodes: HierarchyNode[],
  id: string,
): HierarchyNode[] | null {
  for (const node of nodes) {
    if (node.id === id) return [node];
    const deeper = pathTo(node.children, id);
    if (deeper) return [node, ...deeper];
  }
  return null;
}

/** Keeps only the branches that lead to the target id. */
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

export default function OrganisationPage({ roots, isLoading, isError }: OrganisationPageProps) {
  const [params] = useSearchParams();
  const focusId = params.get("focus") ?? "";
  const [query, setQuery] = useState("");
  const tree = roots ?? [];

  const searched = useMemo(() => filterTree(tree, query), [tree, query]);
  const visible = useMemo(() => {
    if (!focusId) return searched;
    if (query.trim()) return searched; // search wins over focus
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
                ? `${focusNode.role}`
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
          <OrganisationSearch value={query} onChange={setQuery} />
          <OrganisationTree
            roots={visible}
            isLoading={isLoading}
            isError={isError}
            query={query}
            focusId={focusId}
            onClearSearch={() => setQuery("")}
          />
        </div>
      </section>
    </div>
  );
}