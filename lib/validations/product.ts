import { z } from "zod";

import type { ProductCategory, ProductTag } from "@/types/product";

const categories: [ProductCategory, ...ProductCategory[]] = [
  "Flowers",
  "Resins",
  "Oils",
  "Infusions",
  "Vape",
  "Packs",
  "Accessories"
];

const tags: [ProductTag, ...ProductTag[]] = [
  "Premium",
  "Local",
  "Relax",
  "Evening",
  "Daytime",
  "Starter",
  "Best Seller",
  "Limited"
];

export const productPatchSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  category: z.enum(categories).optional(),
  shortDescription: z.string().max(2000).optional(),
  longDescription: z.string().max(8000).optional(),
  price: z.number().min(0).max(100_000).optional(),
  image: z.string().min(1).max(2000).optional(),
  stock: z.number().int().min(0).max(1_000_000).optional(),
  featured: z.boolean().optional(),
  format: z.string().min(1).max(120).optional(),
  tags: z.array(z.enum(tags)).optional()
});

export const productCreateSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.enum(categories),
  shortDescription: z.string().max(2000).default(""),
  longDescription: z.string().max(8000).default(""),
  price: z.number().min(0).max(100_000),
  image: z.string().min(1).max(2000),
  stock: z.number().int().min(0).max(1_000_000).default(0),
  featured: z.boolean().default(false),
  format: z.string().min(1).max(120),
  tags: z.array(z.enum(tags)).default([])
});
