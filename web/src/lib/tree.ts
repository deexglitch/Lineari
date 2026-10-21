import type { HierarchyNode } from "@/lib/types";

/** Keeps matches and the managers above them, so results stay in context. */
export function filterTree(nodes: HierarchyNode[], query: string): HierarchyNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;
  const out: HierarchyNode[] = [];
  for (const node of nodes) {
    const children = filterTree(node.children, query);
    const self = `${node.name} ${node.surname} ${node.role}`.toLowerCase().includes(q);
    if (self || children.length) {
      out.push({ ...node, children: self ? node.children : children });
    }
  }
  return out;
}

export const countAll = (nodes: HierarchyNode[]): number =>
  nodes.reduce((sum, n) => sum + 1 + countAll(n.children), 0);

export const depthOf = (nodes: HierarchyNode[]): number =>
  nodes.reduce((max, n) => Math.max(max, 1 + depthOf(n.children)), 0);