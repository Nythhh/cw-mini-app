import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-session";

export type AdminAuth = { ok: true; userId: number } | { ok: false; response: NextResponse };

export async function requireAdmin(): Promise<AdminAuth> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!raw) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  try {
    const userId = await verifyAdminSessionToken(raw);
    return { ok: true, userId };
  } catch {
    return { ok: false, response: NextResponse.json({ error: "Invalid session" }, { status: 401 }) };
  }
}
