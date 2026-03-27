import { NextRequest, NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from "@/lib/admin-session";
import { isAdminPasswordConfigured, verifyAdminPassword } from "@/lib/admin-password";

/** Session « admin » : sujet fixe 1 (mot de passe partagé). */
const ADMIN_SUBJECT_ID = 1;

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD non défini ou trop court (min. 6 caractères) sur le serveur." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const password =
    typeof body === "object" && body !== null && "password" in body ? (body as { password: unknown }).password : undefined;

  if (typeof password !== "string") {
    return NextResponse.json({ error: "Mot de passe manquant" }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  const token = await createAdminSessionToken(ADMIN_SUBJECT_ID);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}
