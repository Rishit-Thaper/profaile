export const usernamePattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

export function getUsernameValidationError(username: unknown): string | null {
  if (typeof username !== "string" || username.length < 3 || username.length > 30) {
    return "Username must be 3-30 characters using lowercase letters, numbers, and hyphens";
  }
  if (!usernamePattern.test(username)) {
    return "Username must be 3-30 characters using lowercase letters, numbers, and hyphens";
  }
  return null;
}
