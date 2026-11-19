export const routes = {
  dashboard: "/",
  editProfile: "/edit",
  login: "/login",
  portfolio: (username: string) => `/p/${username}`,
} as const;
