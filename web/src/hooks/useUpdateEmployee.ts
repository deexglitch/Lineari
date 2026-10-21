import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, fetchJson } from "@/lib/api";

export type EmployeeUpdateBody = {
  name?: string;
  surname?: string;
  email?: string;
  birth_date?: string;
  emp_number?: string;
  salary?: number;
  role?: string;
  manager_id?: string | null;
};

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation<
    { id: string },
    ApiError,
    { id: string; body: EmployeeUpdateBody }
  >({
    mutationFn: ({ id, body }) =>
      fetchJson<{ id: string }>(`/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["hierarchy"] });
    },
  });
}