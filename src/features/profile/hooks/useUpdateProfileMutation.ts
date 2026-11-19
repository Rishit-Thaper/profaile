import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { updateProfile } from "../api/profile-client";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => queryClient.setQueryData(queryKeys.profile, updatedProfile),
  });
}
