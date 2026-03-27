import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { productCreateSchema } from "@/lib/validations/product";
import { uniqueSlug } from "@/lib/slug";
import { canPersistProducts, getProducts, saveProducts } from "@/lib/products-repository";
import { requireAdmin } from "@/lib/require-admin";
import type { Product } from "@/types/product";

export async function GET(): Promise<NextResponse> {
  const a = await requireAdmin();
  if (!a.ok) return a.response;
  const products = await getProducts();
  return NextResponse.json({ products, persist: canPersistProducts() });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const a = await requireAdmin();
  if (!a.ok) return a.response;

  if (!canPersistProducts()) {
    return NextResponse.json(
      { error: "Persistence unavailable: set Upstash Redis on Vercel or run dev locally." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = productCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const products = await getProducts();
  const taken = new Set(products.map((p) => p.slug));
  const slug = uniqueSlug(parsed.data.name, taken);
  const id = `p-${randomUUID()}`;

  const newProduct: Product = {
    id,
    slug,
    name: parsed.data.name,
    category: parsed.data.category,
    shortDescription: parsed.data.shortDescription,
    longDescription: parsed.data.longDescription,
    price: parsed.data.price,
    image: parsed.data.image,
    stock: parsed.data.stock,
    featured: parsed.data.featured,
    format: parsed.data.format,
    tags: parsed.data.tags
  };

  products.push(newProduct);
  await saveProducts(products);
  return NextResponse.json({ product: newProduct });
}
