"use client";

import { PRODUCTS } from "@/data/products";
import type { Product } from "@/types/product";

export function useProducts(): {
  products: Product[];
  loading: false;
  error: null;
} {
  return { products: PRODUCTS, loading: false, error: null };
}
