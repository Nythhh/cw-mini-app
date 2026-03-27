"use client";

import { X } from "lucide-react";

import type { CartItem as CartItemType } from "@/types/cart";
import { formatPrice } from "@/lib/format";
import { QuantitySelector } from "./quantity-selector";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps): JSX.Element {
  return (
    <div className="flex gap-3 rounded-2xl bg-surface p-3 neon-border">
      <div className="h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-surface-raised">
        <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent/60">
              {item.product.category}
            </p>
            <h4 className="truncate font-display text-sm tracking-wide text-foreground">
              {item.product.name}
            </h4>
          </div>
          <button
            onClick={onRemove}
            aria-label={`Remove ${item.product.name}`}
            className="shrink-0 rounded-full p-1 text-foreground-muted transition-colors hover:bg-red-500/15 hover:text-red-400"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <QuantitySelector quantity={item.quantity} max={item.product.stock} onChange={onQuantityChange} />
          <span className="text-sm font-bold text-accent neon-text">
            {formatPrice(item.product.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
