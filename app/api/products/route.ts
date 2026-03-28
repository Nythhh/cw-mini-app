import { NextResponse } from "next/server";

import { PRODUCTS } from "@/data/products";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { products: PRODUCTS },
    { headers: { "Cache-Control": "public, max-age=60" } }
  );
}
