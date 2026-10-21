import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api";
import type { HierarchyNode } from "@/lib/types";

export function useHierarchy() {
  return useQuery<HierarchyNode[]>({
    queryKey: ["hierarchy"],
    queryFn: () => fetchJson<HierarchyNode[]>("/hierarchy"),
  });
}