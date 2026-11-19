import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { checkUsername } from "../api/profile-client";

export function useCheckUsernameQuery(username: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.usernameCheck(username),
    queryFn: () => checkUsername(username),
    enabled: enabled && username.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
