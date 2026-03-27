/**
 * Codes promo côté client (mock). À remplacer plus tard par une validation admin / API.
 * Ex.: POST /api/promo/validate { code, subtotalCents }
 */

export type PromoKind = "percent" | "fixed";

export interface PromoDefinition {
  kind: PromoKind;
  /** Pourcentage (ex. 10 = 10 %) ou montant fixe en € */
  value: number;
  /** Libellé court pour l’UI */
  label: string;
}

/** Codes normalisés en MAJUSCULES */
export const PROMO_CODES: Record<string, PromoDefinition> = {
  CW10: { kind: "percent", value: 10, label: "−10 %" },
  WELCOME15: { kind: "percent", value: 15, label: "−15 %" },
  CBD5: { kind: "fixed", value: 5, label: "−5 €" }
};

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

export function applyPromoCode(subtotal: number, rawInput: string): PromoApplyResult {
  const key = rawInput.trim().toUpperCase();
  if (!key) {
    return { ok: false, error: "Saisis un code." };
  }
  const def = PROMO_CODES[key];
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
