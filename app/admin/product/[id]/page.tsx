"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";

import { ProductForm, type ProductFormData } from "@/components/admin/product-form";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionTitle } from "@/components/shared/section-title";
import type { Product } from "@/types/product";

export default function EditProductPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { products?: Product[] }) => {
        const found = data.products?.find((p) => p.id === params.id) ?? null;
        setProduct(found);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = useCallback(async (data: ProductFormData) => {
    const res = await fetch(`/api/admin/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? `Erreur ${res.status}`);
    }
    const result = await res.json();
    setProduct(result.product);
  }, [params.id]);

  const handleDelete = useCallback(async () => {
    const res = await fetch(`/api/admin/products/${params.id}`, {
      method: "DELETE"
    });
    if (!res.ok) {
      throw new Error("Erreur lors de la suppression");
    }
    router.push("/admin");
  }, [params.id, router]);

  if (loading) {
    return <p className="pt-8 text-sm text-foreground-muted">Chargement…</p>;
  }

  if (!product) {
    return (
      <div className="space-y-4 pt-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={14} /> Retour
        </Link>
        <EmptyState
          icon={PackageSearch}
          title="Produit introuvable"
          description="Ce produit n'existe pas ou a été supprimé."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={14} /> Retour
      </Link>
      <SectionTitle title="Modifier" subtitle={product.name} />
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}
