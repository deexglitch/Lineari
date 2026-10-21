import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, fetchJson } from "@/lib/api";

export type AuthUser = { email: string; first_name: string; last_name: string; role: string; created_at: string; };
export type LoginInput = { email: string; password: string };
export type SignupInput = LoginInput & { first_name: string; last_name: string };

const ME = ["me"] as const;
const post = <T,>(path: string, body?: unknown) =>
  fetchJson<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

/** The signed-in user, or null when there is no valid session. */
export function useMe() {
  return useQuery<AuthUser | null>({
    queryKey: ME,
    queryFn: async () => {
      try {
        return await fetchJson<AuthUser>("/auth/me");
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<AuthUser, ApiError, LoginInput>({
    mutationFn: (body) => post<AuthUser>("/auth/login", body),
    onSuccess: (user) => queryClient.setQueryData(ME, user),
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation<AuthUser, ApiError, SignupInput>({
    mutationFn: (body) => post<AuthUser>("/auth/signup", body),
    onSuccess: (user) => queryClient.setQueryData(ME, user),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError>({
    mutationFn: () => post("/auth/logout"),
    onSettled: () => {
      // Drop everything the last person could see, then mark the session as gone.
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== ME[0] });
      queryClient.setQueryData(ME, null);
    },
  });
}

export type ProfileUpdateInput = {
  first_name?: string;
  last_name?: string;
  email?: string;
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<AuthUser, ApiError, ProfileUpdateInput>({
    mutationFn: (body) =>
      fetchJson<AuthUser>("/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    onSuccess: (user) => queryClient.setQueryData(ME, user),
  });
}

export type PasswordChangeInput = {
  current_password: string;
  new_password: string;
};

export function useChangePassword() {
  return useMutation<{ message: string }, ApiError, PasswordChangeInput>({
    mutationFn: (body) =>
      fetchJson<{ message: string }>("/auth/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
  });
}