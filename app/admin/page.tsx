"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PackagePlus, RefreshCw } from "lucide-react";

import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { getTelegramWebApp } from "@/lib/telegram";
import type { Product } from "@/types/product";

function haptic(ok: boolean): void {
  getTelegramWebApp()?.HapticFeedback?.notificationOccurred(ok ? "success" : "error");
}

export default function AdminHomePage(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [persist, setPersist] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [stockDraft, setStockDraft] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const r = await fetch("/api/admin/products", { cache: "no-store" });
      if (r.status === 401) {
        setLoadError("Session expirée — rouvre depuis Telegram.");
        return;
      }
      if (!r.ok) {
        setLoadError(`Erreur (${r.status})`);
        return;
      }
      const data = (await r.json()) as { products: Product[]; persist?: boolean };
      setProducts(data.products);
      setPersist(data.persist !== false);
    } catch {
      setLoadError("Réseau indisponible");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const t = window.setInterval(() => void load(), 12_000);
    return () => window.clearInterval(t);
  }, [load]);

  const patchStock = async (id: string, stock: number): Promise<void> => {
    const r = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock })
    });
    haptic(r.ok);
    if (r.ok) void load();
  };

  return (
    <div className="space-y-5 pt-4">
      <div className="flex items-start justify-between gap-2">
        <SectionTitle title="Admin stock" subtitle="Produits & inventaire" />
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => void load()} aria-label="Rafraîchir">
            <RefreshCw size={16} />
          </Button>
          <Button type="button" size="sm" asChild>
            <Link href="/admin/product/new">
              <PackagePlus size={16} className="mr-1 inline" />
              Nouveau
            </Link>
          </Button>
        </div>
      </div>

      {loadError && (
        <p className="rounded-2xl bg-red-500/10 px-3 py-2 text-xs text-red-300 neon-border">{loadError}</p>
      )}

      {!persist && (
        <p className="rounded-2xl bg-amber-500/10 px-3 py-2 text-xs text-amber-200 neon-border">
          Persistance désactivée : configure <code className="text-accent">UPSTASH_REDIS_REST_URL</code> + token sur Vercel. En dev, les données vont dans{" "}
          <code className="text-accent">data/products-store.json</code>.
        </p>
      )}

      {loading && <p className="text-sm text-foreground-muted">Chargement…</p>}

      <div className="space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-2xl bg-surface p-3 neon-border sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <Link href={`/admin/product/${p.id}`} className="font-display text-base text-foreground hover:text-accent">
                {p.name}
              </Link>
              <p className="text-2xs text-foreground-muted/70">{p.slug}</p>
              <p className="mt-1 text-sm font-bold text-accent">{formatPrice(p.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-semibold uppercase text-foreground-muted">Stock</span>
              <Input
                className="h-9 w-20 font-mono text-sm"
                inputMode="numeric"
                value={stockDraft[p.id] ?? String(p.stock)}
                onChange={(e) => setStockDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                onBlur={() => {
                  const raw = stockDraft[p.id];
                  if (raw === undefined) return;
                  const n = Number.parseInt(raw, 10);
                  if (!Number.isFinite(n) || n < 0) {
                    setStockDraft((d) => {
                      const next = { ...d };
                      delete next[p.id];
                      return next;
                    });
                    return;
                  }
                  void patchStock(p.id, n);
                  setStockDraft((d) => {
                    const next = { ...d };
                    delete next[p.id];
                    return next;
                  });
                }}
              />
              <Button type="button" variant="outline" size="sm" asChild>
                <Link href={`/admin/product/${p.id}`}>Éditer</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pb-6">
        <Button type="button" variant="outline" asChild>
          <Link href="/catalog">Voir le shop</Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-foreground-muted"
          onClick={() => void fetch("/api/admin/logout", { method: "POST" }).then(() => window.location.reload())}
        >
          Déconnexion session
        </Button>
      </div>
    </div>
  );
}
