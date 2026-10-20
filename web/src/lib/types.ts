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