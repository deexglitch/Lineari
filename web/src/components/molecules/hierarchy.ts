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

export const fullName = (n: HierarchyNode) => `${n.name} ${n.surname}`;

export const initials = (n: HierarchyNode) =>
  `${n.name[0] ?? ""}${n.surname[0] ?? ""}`.toUpperCase();

/** Keeps matches and the managers above them, so results stay in context. */
export function filterTree(nodes: HierarchyNode[], query: string): HierarchyNode[] {
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

export const countAll = (nodes: HierarchyNode[]): number =>
  nodes.reduce((sum, n) => sum + 1 + countAll(n.children), 0);

export const depthOf = (nodes: HierarchyNode[]): number =>
  nodes.reduce((max, n) => Math.max(max, 1 + depthOf(n.children)), 0);