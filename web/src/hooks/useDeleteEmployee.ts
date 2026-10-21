import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, fetchJson } from "@/lib/api";

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    ApiError,
    { id: string; reassign_reports_to?: string | null; reassign_to_none?: boolean }
  >({
    mutationFn: ({ id, reassign_reports_to, reassign_to_none }) => {
      const params = new URLSearchParams();
      if (reassign_reports_to) params.set("reassign_reports_to", reassign_reports_to);
      if (reassign_to_none) params.set("reassign_to_none", "true");
      const qs = params.toString();
      return fetchJson<void>(`/employees/${id}${qs ? `?${qs}` : ""}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["hierarchy"] });
    },
  });
}