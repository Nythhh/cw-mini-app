export interface Offer {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  code?: string;
  highlighted?: boolean;
}

export const OFFERS: Offer[] = [
  {
    id: "offer-1",
    title: "Evening Calm Pack",
    description: "2 flowers + 1 infusion selected for a smoother evening routine.",
    discountLabel: "-15%",
    code: "CW15",
    highlighted: true
  },
  {
    id: "offer-2",
    title: "Local Delivery Tuesday",
    description: "Free local delivery above 70 EUR every Tuesday.",
    discountLabel: "Free delivery"
  },
  {
    id: "offer-3",
    title: "Starter Oil Bundle",
    description: "Bundle any two oils and get a premium dropper accessory included.",
    discountLabel: "Accessory included"
  }
];
