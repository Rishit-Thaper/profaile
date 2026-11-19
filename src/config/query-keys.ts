export const queryKeys = {
  profile: ["profile"] as const,
  usernameCheck: (username: string) => ["usernameCheck", username] as const,
};
