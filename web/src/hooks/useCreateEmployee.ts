import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

/** Matches EmployeeCreate in the Lineari OpenAPI spec. */
export type EmployeeCreate = {
  name: string;
  surname: string;
  email: string;
  birth_date: string; // YYYY-MM-DD
  emp_number: string;
  salary: number;
  role: string;
  manager_id: string | null;
};

export class ApiError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, ApiError, EmployeeCreate>({
    mutationFn: async (body) => {
      const res = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new ApiError(err?.message ?? `Request failed (${res.status})`, err?.code);
      }
      return res.json();
    },
    // Refresh the chart, the overview counts and anything else showing employees.
    onSuccess: () => queryClient.invalidateQueries(),
  });
}