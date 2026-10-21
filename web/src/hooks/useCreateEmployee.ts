import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, fetchJson } from "@/lib/api";

export type EmployeeCreate = object;

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation<{ id: string }, ApiError, EmployeeCreate>({
    mutationFn: (body) =>
      fetchJson<{ id: string }>("/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["hierarchy"] });
    },
  });
}