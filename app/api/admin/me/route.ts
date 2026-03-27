import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/require-admin";

export async function GET(): Promise<NextResponse> {
  const a = await requireAdmin();
  if (!a.ok) return a.response;
  return NextResponse.json({ userId: a.userId });
}
