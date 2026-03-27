import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";

import { PRODUCTS as SEED } from "@/data/products";
import type { Product } from "@/types/product";

const REDIS_KEY = "cw:products:v1";
const DEV_FILE = path.join(process.cwd(), "data", "products-store.json");

let redis: Redis | null = null;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!redis) redis = new Redis({ url, token });
  return redis;
}

export function hasRedis(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/** Persistance écrivable (Redis prod ou fichier en dev local). */
export function canPersistProducts(): boolean {
  if (hasRedis()) return true;
  return process.env.NODE_ENV === "development";
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
 * Catalogue courant : Upstash si configuré (partagé entre instances), sinon fichier en dev, sinon seed statique.
 */
export async function getProducts(): Promise<Product[]> {
  const r = getRedis();
  if (r) {
    const raw = await r.get<string>(REDIS_KEY);
    if (raw) {
      try {
        const arr = JSON.parse(raw) as unknown;
        if (Array.isArray(arr) && arr.length > 0) return arr as Product[];
      } catch {
        /* seed */
      }
    }
    await r.set(REDIS_KEY, JSON.stringify(SEED));
    return [...SEED];
  }

  if (process.env.NODE_ENV === "development") {
    const fromFile = await readDevFile();
    if (fromFile && fromFile.length > 0) return fromFile;
  }

  return [...SEED];
}

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
  throw new Error("PERSISTENCE_UNAVAILABLE");
}
