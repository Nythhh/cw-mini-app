"use client";

import { useCallback, useEffect, useState } from "react";

import type { Product } from "@/types/product";

export function useProducts(): {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
} {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const r = await fetch("/api/products", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = (await r.json()) as { products?: Product[] };
      if (!Array.isArray(data.products)) throw new Error("Invalid payload");
      setProducts(data.products);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { products, loading, error, reload };
}
