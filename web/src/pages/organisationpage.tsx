import { useMemo, useState } from "react";
import { OrganisationSearch } from "@/components/molecules/organisation-search";
import { OrganisationTree } from "@/components/organisms/organisation-tree";
import { countAll, depthOf, filterTree } from "@/lib/tree";
import type { HierarchyNode } from "@/lib/types";

type OrganisationPageProps = {
  roots?: HierarchyNode[];
  isLoading?: boolean;
  isError?: boolean;
};

export default function OrganisationPage({ roots, isLoading, isError }: OrganisationPageProps) {
  const [query, setQuery] = useState("");
  const tree = roots ?? [];
  const visible = useMemo(() => filterTree(tree, query), [tree, query]);

  const total = countAll(tree);
  const levels = depthOf(tree);

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
          <OrganisationSearch value={query} onChange={setQuery} />
          <OrganisationTree
            roots={visible}
            isLoading={isLoading}
            isError={isError}
            query={query}
            onClearSearch={() => setQuery("")}
          />
        </div>
      </section>
    </div>
  );
}