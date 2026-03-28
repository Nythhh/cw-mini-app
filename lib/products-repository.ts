import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";

import { PRODUCTS as SEED } from "@/data/products";
import type { Product } from "@/types/product";

const REDIS_KEY = "cw:products:v1";
const DEV_FILE = path.join(process.cwd(), "data", "products-store.json");

let redis: Redis | null = null;

function getRedisCredentials(): { url: string; token: string } | null {
  const url = (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL)?.trim();
  const token = (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN)?.trim();
  if (!url || !token) return null;
  return { url, token };
}

function getRedis(): Redis | null {
  const creds = getRedisCredentials();
  if (!creds) return null;
  if (!redis) redis = new Redis({ url: creds.url, token: creds.token });
  return redis;
}

export function hasRedis(): boolean {
  return getRedisCredentials() !== null;
}

async function readDevFile(): Promise<Product[] | null> {
  try {
    const raw = await fs.readFile(DEV_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed as Product[];
  } catch {
    return null;
  }
}

async function writeDevFile(products: Product[]): Promise<void> {
  await fs.mkdir(path.dirname(DEV_FILE), { recursive: true });
  await fs.writeFile(DEV_FILE, JSON.stringify(products, null, 2), "utf-8");
}

/**
 * Read products: Redis → dev file → static seed.
 */
export async function getProducts(): Promise<Product[]> {
  const r = getRedis();
  if (r) {
    const raw = await r.get<string>(REDIS_KEY);
    if (raw) {
      try {
        const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (Array.isArray(arr) && arr.length > 0) return arr as Product[];
      } catch {
        /* fall through to seed */
      }
    }
    // Seed Redis on first access
    await r.set(REDIS_KEY, JSON.stringify(SEED));
    return [...SEED];
  }

  // Dev: try local file
  if (process.env.NODE_ENV === "development") {
    const fromFile = await readDevFile();
    if (fromFile && fromFile.length > 0) return fromFile;
  }

  return [...SEED];
}

/**
 * Save products: Redis in prod, JSON file in dev.
 */
export async function saveProducts(products: Product[]): Promise<void> {
  const r = getRedis();
  if (r) {
    await r.set(REDIS_KEY, JSON.stringify(products));
    return;
  }
  if (process.env.NODE_ENV === "development") {
    await writeDevFile(products);
    return;
  }
  throw new Error("No persistence available — configure KV_REST_API_URL and KV_REST_API_TOKEN");
}
