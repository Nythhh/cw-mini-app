import { NextRequest, NextResponse } from "next/server";

import { getCategories, saveCategories } from "@/lib/products-repository";

export async function GET(): Promise<NextResponse> {
  const categories = await getCategories();
  return NextResponse.json(
    { categories },
    { headers: { "Cache-Control": "no-store, must-revalidate" } }
  );
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    if (!Array.isArray(body.categories) || body.categories.some((c: unknown) => typeof c !== "string")) {
      return NextResponse.json({ error: "Format invalide" }, { status: 400 });
    }
    const cleaned = (body.categories as string[])
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    const unique = [...new Set(cleaned)];
    await saveCategories(unique);
    return NextResponse.json({ categories: unique });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
