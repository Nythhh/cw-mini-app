import type { Product } from "@/types/product";

export const PRODUCTS: Product[] = [
  {
    id: "p-1",
    slug: "urban-flower-12",
    name: "Urban Flower 12%",
    category: "Flowers",
    shortDescription: "Premium greenhouse CBD flower with clean aroma notes.",
    longDescription:
      "Urban Flower 12% offers a balanced profile with subtle herbal and citrus notes. Hand-trimmed batches are selected for consistency and smooth use.",
    price: 19.9,
    image: "https://images.unsplash.com/photo-1593182442784-955f8f2f3449?auto=format&fit=crop&w=1200&q=80",
    stock: 18,
    featured: true,
    format: "3.5g",
    tags: ["Premium", "Best Seller", "Evening"]
  },
  {
    id: "p-2",
    slug: "city-resin-gold",
    name: "City Resin Gold",
    category: "Resins",
    shortDescription: "Soft-pressed CBD resin with warm earthy profile.",
    longDescription:
      "City Resin Gold is crafted for users looking for rich texture and rounded aromatic notes. Recommended for calm late-day sessions.",
    price: 24.5,
    image: "https://images.unsplash.com/photo-1615486363977-7f89f4208f3e?auto=format&fit=crop&w=1200&q=80",
    stock: 10,
    featured: true,
    format: "2g",
    tags: ["Premium", "Relax", "Evening"]
  },
  {
    id: "p-3",
    slug: "daily-cbd-oil-10",
    name: "Daily CBD Oil 10%",
    category: "Oils",
    shortDescription: "Balanced everyday oil in MCT base.",
    longDescription:
      "Daily CBD Oil 10% is made for regular routines. Neutral taste with precise dropper control for easy daily usage.",
    price: 34,
    image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=1200&q=80",
    stock: 22,
    featured: true,
    format: "10ml",
    tags: ["Daytime", "Starter", "Local"]
  },
  {
    id: "p-4",
    slug: "infusion-night-herbal",
    name: "Night Herbal Infusion",
    category: "Infusions",
    shortDescription: "CBD herbal tea blend for evening wind-down.",
    longDescription:
      "Night Herbal Infusion combines hemp, chamomile, and lemon balm. Best enjoyed after dinner with a small fatty snack for better absorption.",
    price: 14.9,
    image: "https://images.unsplash.com/photo-1542444459-db63c47c4a6c?auto=format&fit=crop&w=1200&q=80",
    stock: 35,
    featured: true,
    format: "20 sachets",
    tags: ["Evening", "Relax"]
  }
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((product) => product.featured);
