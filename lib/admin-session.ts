import { SignJWT, jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (s) return new TextEncoder().encode(s);
  if (process.env.NODE_ENV === "development") {
    return new TextEncoder().encode("cw-admin-dev-only");
  }
  throw new Error("ADMIN_SESSION_SECRET is required in production");
}

const COOKIE = "cw_admin_session";

export const ADMIN_SESSION_COOKIE = COOKIE;

export async function createAdminSessionToken(userId: number): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminSessionToken(token: string): Promise<number> {
  const { payload } = await jwtVerify(token, getSecret());
  const sub = payload.sub;
  if (typeof sub !== "string" || !/^\d+$/.test(sub)) throw new Error("Invalid token");
  return Number(sub);
}
