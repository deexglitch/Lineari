import type { HierarchyNode } from "@/lib/types";

export const fullName = (n: HierarchyNode) => `${n.name} ${n.surname}`;

export const initials = (n: HierarchyNode) =>
  `${n.name[0] ?? ""}${n.surname[0] ?? ""}`.toUpperCase();