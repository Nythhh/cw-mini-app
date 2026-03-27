const EUR_FORMATTER = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR"
});

export function formatPrice(value: number): string {
  return EUR_FORMATTER.format(value);
}
