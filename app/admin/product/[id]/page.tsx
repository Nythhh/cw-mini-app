"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { ProductForm } from "@/components/admin/product-form";
import { SectionTitle } from "@/components/shared/section-title";
import type { Product } from "@/types/product";

export default function AdminEditProductPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/products", { cache: "no-store" });
      if (!r.ok) return;
      const data = (await r.json()) as { products: Product[] };
      const p = data.products.find((x) => x.id === params.id) ?? null;
      setProduct(p);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <p className="pt-8 text-sm text-foreground-muted">Chargement…</p>;
  }

  if (!product) {
    return (
      <div className="space-y-3 pt-8">
        <p className="text-sm text-foreground-muted">Produit introuvable.</p>
        <Link href="/admin" className="text-accent">
          ← Retour admin
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-4">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground-muted hover:text-accent">
        <ArrowLeft size={14} /> Liste
      </Link>
      <SectionTitle title="Modifier" subtitle={product.name} />
      <ProductForm mode="edit" initial={product} onSuccess={load} />
    </div>
  );
}
