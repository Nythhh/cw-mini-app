export type AdminEnv = {
  username: string;
  password: string;
  sessionSecret: string;
};

let cached: AdminEnv | null | undefined;

/**
 * Returns null if admin auth is not configured (missing password or secret).
 */
export function getAdminEnv(): AdminEnv | null {
  if (cached !== undefined) return cached;

  const username = (process.env.ADMIN_USERNAME?.trim() || "Admin") as string;
  const password = process.env.ADMIN_PASSWORD ?? "";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? "";

  if (password.length < 1 || sessionSecret.length < 16) {
    cached = null;
    return null;
  }

  cached = { username, password, sessionSecret };
  return cached;
}
