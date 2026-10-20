import { useQuery } from "@tanstack/react-query";
import type { HierarchyNode } from "@/pages/organisationpage";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export function useHierarchy() {
  return useQuery<HierarchyNode[]>({
    queryKey: ["hierarchy"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/hierarchy`);
      if (!res.ok) throw new Error(`Hierarchy request failed: ${res.status}`);
      return res.json();
    },
  });
}