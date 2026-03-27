"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, PackageX, ArrowLeft, PackageSearch } from "lucide-react";

import { ProductGrid } from "@/components/product/product-grid";
import { QuantitySelector } from "@/components/cart/quantity-selector";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionTitle } from "@/components/shared/section-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/format";

export default function ProductDetailPage(): JSX.Element {
  const params = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { products, loading } = useProducts({ refreshMs: 8000 });

  const product = products?.find((p) => p.slug === params.slug);

  const relatedProducts = useMemo(() => {
    if (!product || !products) return [];
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product, products]);

  if (loading && !products) {
    return <p className="pt-8 text-sm text-foreground-muted">Chargement…</p>;
  }

  if (!product) {
    return <EmptyState icon={PackageSearch} title="Produit introuvable" description="Ce produit n'existe pas ou n'est plus disponible." />;
  }

  const inStock = product.stock > 0;

  return (
    <motion.div
      className="space-y-5"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link href="/catalog" className="inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-foreground-muted transition-colors hover:text-accent">
        <ArrowLeft size={14} /> Retour
      </Link>

      <div className="relative -mx-4 aspect-square overflow-hidden rounded-b-3xl bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element -- URLs dynamiques (admin) */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="space-y-2">
        <Badge>{product.category}</Badge>
        <h1 className="font-display text-2xl tracking-wide text-foreground">
          {product.name}
        </h1>
        <p className="font-display text-xl text-accent neon-text">{formatPrice(product.price)}</p>
        <p className="text-sm leading-relaxed text-foreground-muted">{product.shortDescription}</p>
      </div>

      <div className="space-y-3 rounded-2xl bg-surface p-4 neon-border">
        <h2 className="font-display text-base tracking-wide text-accent">Details</h2>
        <p className="text-sm leading-relaxed text-foreground-muted">{product.longDescription}</p>
        <div className="flex gap-4 border-t border-accent/10 pt-3">
          <div>
            <span className="text-xs font-semibold text-foreground-muted">Format</span>
            <p className="text-sm font-bold text-foreground">{product.format}</p>
          </div>
          <div className="border-l border-accent/10 pl-4">
            <span className="text-xs font-semibold text-foreground-muted">Stock</span>
            <div className="flex items-center gap-1.5">
              {inStock ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  <span className="text-sm font-bold text-accent">{product.stock}</span>
                </>
              ) : (
                <>
                  <PackageX className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                  <span className="text-sm font-bold text-red-400">Rupture</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-surface p-4 neon-border">
        <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} />
        <Button onClick={() => addItem(product, quantity)} disabled={!inStock}>
          Ajouter au panier 🛒
        </Button>
      </div>

      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-baseline justify-between">
            <SectionTitle title="Similaires" />
            <Link href="/catalog" className="text-sm font-bold text-accent">
              Voir tout →
            </Link>
          </div>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </motion.div>
  );
}
