"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Package } from "lucide-react";

import { SectionTitle } from "@/components/shared/section-title";
import { EmptyState } from "@/components/shared/empty-state";
import { CategoryManager } from "@/components/admin/category-manager";
import { PromoManager } from "@/components/admin/promo-manager";
import { Badge } from "@/components/ui/badge";
import { formatGrams, formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

function stockColor(stock: number): string {
  if (stock === 0) return "text-red-400";
  if (stock <= 20) return "text-orange-400";
  return "text-accent";
}

function stockLabel(stock: number): string {
  if (stock === 0) return "Rupture";
  return `${formatGrams(stock)} dispo`;
}

export default function AdminPage(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { products?: Product[] }) => {
        if (Array.isArray(data.products)) setProducts(data.products);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4 px-4 pt-2 pb-24">
      <SectionTitle title="Admin" subtitle="Gestion des produits" />

      <CategoryManager />

      <PromoManager />

      {loading && <p className="text-sm text-foreground-muted">Chargement…</p>}

      {!loading && products.length === 0 && (
        <EmptyState
          icon={Package}
          title="Aucun produit"
          description="Ajoute ton premier produit pour commencer."
        />
      )}

      <div className="space-y-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/admin/product/${product.id}`}
            className="flex items-center gap-3 rounded-2xl bg-surface p-3 neon-border transition-colors hover:bg-surface/80"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-background">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-6 w-6 text-foreground-muted/30" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-display text-sm tracking-wide text-foreground">
                  {product.name}
                </h3>
                {product.featured && (
                  <Badge className="shrink-0 text-[9px]">Featured</Badge>
                )}
              </div>
              <p className="text-xs text-foreground-muted">{product.category}</p>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-sm font-bold text-accent">
                  {formatPrice(product.price)}
                </span>
                <span className={`text-xs font-semibold ${stockColor(product.stock)}`}>
                  {stockLabel(product.stock)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/admin/product/new"
        aria-label="Ajouter un produit"
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-background shadow-neon transition-transform hover:scale-110 active:scale-95"
      >
        <Plus size={24} strokeWidth={2.5} />
      </Link>
    </div>
  );
}
