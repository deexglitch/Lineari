import { useMemo, useState, useEffect, useRef } from "react";
import Tree from "react-d3-tree";
import { Link } from "react-router-dom";
import { Table } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/atoms/button";
import { Skeleton } from "@/components/atoms/skeleton";
import { OrgChart } from "@/components/molecules/org-chart";
import type { HierarchyNode } from "@/lib/types";
import { cn } from "@/lib/utils";

export type TreeNodeDatum = {
  name: string;
  attributes?: Record<string, string | number | boolean>;
  children?: TreeNodeDatum[];
};

function mapToTreeData(node: HierarchyNode): TreeNodeDatum {
  return {
    name: `${node.name} ${node.surname}`,
    attributes: {
      id: node.id,
      role: node.role,
      avatar_url: node.avatar_url,
    },
    children: node.children?.map(mapToTreeData),
  };
}

export function OrganisationTreeGraph({
  roots,
  isLoading,
  isError,
  query,
  onClearSearch,
}: {
  roots: HierarchyNode[];
  isLoading?: boolean;
  isError?: boolean;
  query: string;
  onClearSearch: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Attach the resize observer once, and also re-measure whenever the
  // container goes from null -> element (which is what happens after the
  // skeleton is replaced by the real div).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);

    // First paint after mount: force a synchronous measure so the tree
    // appears without waiting for the first resize tick.
    setWidth(el.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, [isLoading, isError, roots.length]);

  const treeData = useMemo<TreeNodeDatum | null>(() => {
    if (roots.length === 0) return null;
    if (roots.length === 1) return mapToTreeData(roots[0]);
    return {
      name: "Organisation",
      attributes: { id: "root", role: "Root", avatar_url: "" },
      children: roots.map(mapToTreeData),
    };
  }, [roots]);

  const searching = query.trim().length > 0;

  if (isLoading) {
    return (
      <div className="grid gap-4 py-8 place-items-center" aria-busy="true">
        <Skeleton className="h-20 w-48 rounded-2xl bg-muted" />
        <Skeleton className="h-20 w-48 rounded-2xl bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-2 py-8 text-center">
        <p className="text-lg font-bold text-foreground">Couldn't load the organisation.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Check that the API is running at localhost:8000, then refresh.
        </p>
      </div>
    );
  }

  // Search filtered everything out — match the List view's empty state.
  if (!treeData) {
    return (
      <div className="flex flex-col items-start gap-4 px-2 py-6">
        <p className="text-lg font-bold text-foreground">
          {searching
            ? `No one matches "${query.trim()}".`
            : "No employees to show yet."}
        </p>
        {searching ? (
          <button
            type="button"
            onClick={onClearSearch}
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-primary font-bold text-primary-foreground hover:bg-[color-mix(in_srgb,var(--color-primary),white_12%)]",
            )}
          >
            Clear search
          </button>
        ) : (
          <Link
            to="/employees"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-primary font-bold text-primary-foreground hover:bg-[color-mix(in_srgb,var(--color-primary),white_12%)]",
            )}
          >
            <Table weight="bold" aria-hidden />
            Add employees
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[600px] w-full overflow-auto rounded-2xl border border-border/40 bg-card"
    >
      {width > 0 ? (
        <Tree
          // Force a fresh layout whenever the filtered data changes.
          // Without this, react-d3-tree keeps the previous internal nodes.
          key={JSON.stringify(treeData.name) + "-" + roots.length + "-" + query}
          data={treeData}
          orientation="vertical"
          pathFunc="step"
          translate={{ x: width / 2, y: 80 }}
          nodeSize={{ x: 220, y: 160 }}
          separation={{ siblings: 1.2, nonSiblings: 1.5 }}
          renderCustomNodeElement={(rd3tProps) => <OrgChart {...rd3tProps} />}
          zoomable
          draggable
          collapsible
          pathClassFunc={() => "stroke-primary/50 stroke-2"}
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-muted/30" aria-busy="true" />
      )}
    </div>
  );
}