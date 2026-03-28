"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  max?: number;
  onChange: (quantity: number) => void;
  /** Unité affichée (quantités produit = grammes). */
  unit?: string;
}

export function QuantitySelector({
  quantity,
  max,
  onChange,
  unit = "g"
}: QuantitySelectorProps): JSX.Element {
  const atMin = quantity <= 1;
  const atMax = max !== undefined && quantity >= max;

  return (
    <div
      role="group"
      aria-label={`Quantité en ${unit === "g" ? "grammes" : unit}`}
      className="inline-flex items-center rounded-full bg-surface-raised neon-border"
    >
      <button
        onClick={() => onChange(quantity - 1)}
        disabled={atMin}
        aria-label={`Retirer 1 ${unit}`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted transition-colors hover:text-accent disabled:opacity-30"
      >
        <Minus size={14} strokeWidth={2} />
      </button>
      <span
        aria-live="polite"
        className="min-w-[3.25rem] text-center text-sm font-bold tabular-nums text-foreground"
      >
        {quantity}
        {unit ? <span className="text-2xs font-semibold text-foreground-muted"> {unit}</span> : null}
      </span>
      <button
        onClick={() => onChange(quantity + 1)}
        disabled={atMax}
        aria-label={`Ajouter 1 ${unit}`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted transition-colors hover:text-accent disabled:opacity-30"
      >
        <Plus size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
