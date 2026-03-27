"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/data/categories";
import { getTelegramWebApp } from "@/lib/telegram";
import type { Product, ProductCategory, ProductTag } from "@/types/product";

function haptic(ok: boolean): void {
  getTelegramWebApp()?.HapticFeedback?.notificationOccurred(ok ? "success" : "error");
}

const ALL_TAGS: ProductTag[] = [
  "Premium",
  "Local",
  "Relax",
  "Evening",
  "Daytime",
  "Starter",
  "Best Seller",
  "Limited"
];

type Mode = "create" | "edit";

interface ProductFormProps {
  mode: Mode;
  initial?: Product;
  onSuccess?: () => void;
}

export function ProductForm({ mode, initial, onSuccess }: ProductFormProps): JSX.Element {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState<ProductCategory>(initial?.category ?? "Flowers");
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? "");
  const [longDescription, setLongDescription] = useState(initial?.longDescription ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [image, setImage] = useState(initial?.image ?? "");
  const [stock, setStock] = useState(String(initial?.stock ?? 0));
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [format, setFormat] = useState(initial?.format ?? "");
  const [tags, setTags] = useState<ProductTag[]>(initial?.tags ?? []);

  const toggleTag = (t: ProductTag): void => {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const submit = async (): Promise<void> => {
    setErr(null);
    setPending(true);
    try {
      const priceNum = Number(price);
      const stockNum = Number.parseInt(stock, 10);
      if (!Number.isFinite(priceNum) || priceNum < 0) throw new Error("Prix invalide");
      if (!Number.isFinite(stockNum) || stockNum < 0) throw new Error("Stock invalide");

      if (mode === "create") {
        const r = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            category,
            shortDescription,
            longDescription,
            price: priceNum,
            image,
            stock: stockNum,
            featured,
            format,
            tags
          })
        });
        if (!r.ok) {
          const j = (await r.json().catch(() => ({}))) as { error?: unknown };
          throw new Error(typeof j.error === "string" ? j.error : `Erreur ${r.status}`);
        }
        const j = (await r.json()) as { product: Product };
        haptic(true);
        onSuccess?.();
        router.push(`/admin/product/${j.product.id}`);
        return;
      }

      if (!initial) return;
      const body: Record<string, unknown> = {
        name,
        category,
        shortDescription,
        longDescription,
        price: priceNum,
        image,
        stock: stockNum,
        featured,
        format,
        tags
      };
      if (slug.trim() && slug !== initial.slug) body.slug = slug.trim();

      const r = await fetch(`/api/admin/products/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { error?: unknown };
        throw new Error(typeof j.error === "string" ? j.error : `Erreur ${r.status}`);
      }
      haptic(true);
      onSuccess?.();
      router.refresh();
    } catch (e) {
      haptic(false);
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-4">
      {err && <p className="text-sm text-red-400">{err}</p>}

      <label className="block space-y-1">
        <span className="text-xs font-semibold text-foreground-muted">Nom</span>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      {mode === "edit" && (
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-foreground-muted">Slug (URL)</span>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="font-mono text-sm" />
        </label>
      )}

      <label className="block space-y-1">
        <span className="text-xs font-semibold text-foreground-muted">Catégorie</span>
        <select
          className="flex h-10 w-full rounded-xl border border-accent/20 bg-background px-3 text-sm text-foreground"
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategory)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-semibold text-foreground-muted">Description courte</span>
        <Textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-semibold text-foreground-muted">Description longue</span>
        <Textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} rows={5} />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-foreground-muted">Prix (€)</span>
          <Input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-foreground-muted">Stock</span>
          <Input inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} />
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-xs font-semibold text-foreground-muted">Image (URL https ou chemin /public)</span>
        <Input value={image} onChange={(e) => setImage(e.target.value)} className="font-mono text-xs" />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-semibold text-foreground-muted">Format</span>
        <Input value={format} onChange={(e) => setFormat(e.target.value)} placeholder="ex. 3.5g" />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-accent" />
        <span className="text-sm text-foreground-muted">Mis en avant</span>
      </label>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-foreground-muted">Tags</span>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                tags.includes(t) ? "bg-accent/20 text-accent neon-border" : "bg-surface text-foreground-muted neon-border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <Button type="button" className="w-full" disabled={pending} onClick={() => void submit()}>
        {pending ? "…" : mode === "create" ? "Créer le produit" : "Enregistrer"}
      </Button>
    </div>
  );
}
