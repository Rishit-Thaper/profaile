import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { fetchProfile } from "../api/profile-client";

export function useProfileQuery() {
  return useQuery({ queryKey: queryKeys.profile, queryFn: fetchProfile });
}
