"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  max?: number;
  onChange: (quantity: number) => void;
}

export function QuantitySelector({ quantity, max, onChange }: QuantitySelectorProps): JSX.Element {
  const atMin = quantity <= 1;
  const atMax = max !== undefined && quantity >= max;

  return (
    <div role="group" aria-label="Quantity" className="inline-flex items-center rounded-full bg-surface-raised neon-border">
      <button
        onClick={() => onChange(quantity - 1)}
        disabled={atMin}
        aria-label="Decrease quantity"
        className="flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted transition-colors hover:text-accent disabled:opacity-30"
      >
        <Minus size={14} strokeWidth={2} />
      </button>
      <span aria-live="polite" className="min-w-[32px] text-center text-sm font-bold text-foreground">
        {quantity}
      </span>
      <button
        onClick={() => onChange(quantity + 1)}
        disabled={atMax}
        aria-label="Increase quantity"
        className="flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted transition-colors hover:text-accent disabled:opacity-30"
      >
        <Plus size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
