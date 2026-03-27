"use client";

import { useCallback, useEffect, useState } from "react";

import type { Product } from "@/types/product";

type UseProductsOptions = {
  /** Rafraîchissement automatique (catalogue / stock). */
  refreshMs?: number;
};

export function useProducts(options?: UseProductsOptions): {
  products: Product[] | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
} {
  const [products, setProducts] = useState<Product[] | null>(null);
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

  useEffect(() => {
    const ms = options?.refreshMs;
    if (!ms || ms < 3000) return;
    const t = window.setInterval(() => void reload(), ms);
    return () => window.clearInterval(t);
  }, [options?.refreshMs, reload]);

  return { products, loading, error, reload };
}
