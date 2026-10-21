import { useMemo, useState } from "react";
import type { components } from "@/api/schema";

export type Employee = components["schemas"]["Employee"];
export type SortKey = "name" | "surname" | "role" | "email" | "manager_name";
export type SortDir = "asc" | "desc";

export function useEmployeeDirectory(employees: Employee[]) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("surname");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = q
      ? employees.filter((e) =>
          `${e.name} ${e.surname} ${e.role} ${e.email} ${e.emp_number}`
            .toLowerCase()
            .includes(q),
        )
      : employees;
    return [...rows].sort((a, b) => {
      const av = (a[sortKey] ?? "").toString().toLowerCase();
      const bv = (b[sortKey] ?? "").toString().toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [employees, query, sortKey, sortDir]);

  const managers = useMemo(
    () =>
      employees.map((e) => ({
        id: e.id,
        label: `${e.name} ${e.surname} — ${e.role}`,
      })),
    [employees],
  );

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return { query, setQuery, sortKey, sortDir, toggleSort, filtered, managers };
}