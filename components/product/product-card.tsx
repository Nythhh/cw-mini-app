"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import type { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps): JSX.Element {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface neon-border">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          {product.featured && (
            <Badge className="absolute left-2 top-2 text-[10px]">Featured</Badge>
          )}
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            aria-label={`Add ${product.name} to cart`}
            className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-background shadow-neon transition-all duration-200 hover:shadow-neon-lg hover:scale-110 active:scale-95 disabled:opacity-30"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
        <div className="mt-2.5 space-y-0.5 px-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent/60">
            {product.category}
          </p>
          <h3 className="font-display text-base tracking-wide text-foreground">
            {product.name}
          </h3>
          <p className="text-sm font-bold text-accent neon-text">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
