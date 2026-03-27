export type ProductCategory =
  | "Flowers"
  | "Resins"
  | "Oils"
  | "Infusions"
  | "Vape"
  | "Packs"
  | "Accessories";

export type ProductTag =
  | "Premium"
  | "Local"
  | "Relax"
  | "Evening"
  | "Daytime"
  | "Starter"
  | "Best Seller"
  | "Limited";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  longDescription: string;
  price: number;
  image: string;
  stock: number;
  featured: boolean;
  format: string;
  tags: ProductTag[];
}
