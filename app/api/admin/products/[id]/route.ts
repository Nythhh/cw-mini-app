import { NextRequest, NextResponse } from "next/server";

import { productPatchSchema } from "@/lib/validations/product";
import { uniqueSlug } from "@/lib/slug";
import { canPersistProducts, getProducts, saveProducts } from "@/lib/products-repository";
import { requireAdmin } from "@/lib/require-admin";
import type { Product } from "@/types/product";

type RouteCtx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: RouteCtx): Promise<NextResponse> {
  const a = await requireAdmin();
  if (!a.ok) return a.response;

  if (!canPersistProducts()) {
    return NextResponse.json(
      { error: "Persistence unavailable: set Upstash Redis on Vercel or run dev locally." },
      { status: 503 }
    );
  }

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = productPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const patch = parsed.data;
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Empty patch" }, { status: 400 });
  }

  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const current = products[idx];

  let nextSlug = current.slug;
  if (patch.slug !== undefined && patch.slug !== current.slug) {
    const taken = new Set(products.filter((p) => p.id !== id).map((p) => p.slug));
    nextSlug = uniqueSlug(patch.slug, taken);
  }

  const merged: Product = {
    ...current,
    ...patch,
    slug: nextSlug,
    tags: patch.tags ?? current.tags
  };

  products[idx] = merged;
  await saveProducts(products);
  return NextResponse.json({ product: merged });
}
