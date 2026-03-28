const EUR_FORMATTER = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR"
});

export function formatPrice(value: number): string {
  return EUR_FORMATTER.format(value);
}

/** Quantité produit (stock / panier) en grammes. */
export function formatGrams(value: number): string {
  return `${value.toLocaleString("fr-FR")}\u00a0g`;
}
