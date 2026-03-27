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
    featured: false,
    format: "20 sachets",
    tags: ["Evening", "Relax"]
  },
  {
    id: "p-5",
    slug: "mint-vape-alt",
    name: "Mint Vape Alternative",
    category: "Vape",
    shortDescription: "CBD vape alternative with fresh mint profile.",
    longDescription:
      "Mint Vape Alternative provides a discreet and clean experience with food-grade aromas and lab-tested CBD formulation.",
    price: 29.9,
    image: "https://images.unsplash.com/photo-1565708097881-bbfaa65fa2d0?auto=format&fit=crop&w=1200&q=80",
    stock: 14,
    featured: false,
    format: "1ml",
    tags: ["Premium", "Daytime"]
  },
  {
    id: "p-6",
    slug: "starter-pack-cw",
    name: "CW Starter Pack",
    category: "Packs",
    shortDescription: "Curated intro kit across flowers, oils, and infusion.",
    longDescription:
      "CW Starter Pack brings together top beginner-friendly items in one premium bundle, built for customers discovering CBD routines.",
    price: 59,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
    stock: 8,
    featured: true,
    format: "3 items",
    tags: ["Starter", "Best Seller", "Limited"]
  },
  {
    id: "p-7",
    slug: "glass-dropper-pro",
    name: "Glass Dropper Pro",
    category: "Accessories",
    shortDescription: "Replacement premium dropper for CBD oils.",
    longDescription:
      "Glass Dropper Pro improves dosage precision with a premium soft-touch cap and high-resistance borosilicate stem.",
    price: 8.5,
    image: "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?auto=format&fit=crop&w=1200&q=80",
    stock: 42,
    featured: false,
    format: "single piece",
    tags: ["Local", "Premium"]
  },
  {
    id: "p-8",
    slug: "reserve-flower-16",
    name: "Reserve Flower 16%",
    category: "Flowers",
    shortDescription: "Dense premium CBD flower with pine and citrus notes.",
    longDescription:
      "Reserve Flower 16% is selected for users who prefer richer aromatic expression while keeping a smooth legal CBD-only profile.",
    price: 27.5,
    image: "https://images.unsplash.com/photo-1562873657-1f43df0ec685?auto=format&fit=crop&w=1200&q=80",
    stock: 12,
    featured: true,
    format: "5g",
    tags: ["Premium", "Limited", "Best Seller"]
  }
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((product) => product.featured);
