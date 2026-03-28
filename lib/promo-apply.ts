import type { PromoCodeRecord } from "@/types/promo";

export type PromoApplyResult =
  | {
      ok: true;
      code: string;
      discountAmount: number;
      totalAfter: number;
      label: string;
    }
  | { ok: false; error: string };

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Applique un code promo à partir de la liste persistée (codes actifs uniquement).
 */
export function applyPromoCode(
  subtotal: number,
  rawInput: string,
  records: PromoCodeRecord[]
): PromoApplyResult {
  const key = rawInput.trim().toUpperCase();
  if (!key) {
    return { ok: false, error: "Saisis un code." };
  }

  const def = records.find((r) => r.active && r.code.trim().toUpperCase() === key);
  if (!def) {
    return { ok: false, error: "Code invalide ou expiré." };
  }
  if (subtotal <= 0) {
    return { ok: false, error: "Panier vide." };
  }

  let discount = 0;
  if (def.kind === "percent") {
    discount = roundMoney((subtotal * def.value) / 100);
  } else {
    discount = roundMoney(Math.min(def.value, subtotal));
  }

  const totalAfter = roundMoney(Math.max(0, subtotal - discount));

  return {
    ok: true,
    code: key,
    discountAmount: discount,
    totalAfter,
    label: def.label
  };
}
