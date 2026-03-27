"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductForm } from "@/components/admin/product-form";
import { SectionTitle } from "@/components/shared/section-title";

export default function AdminNewProductPage(): JSX.Element {
  return (
    <div className="space-y-5 pt-4">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground-muted hover:text-accent">
        <ArrowLeft size={14} /> Liste
      </Link>
      <SectionTitle title="Nouveau produit" subtitle="Slug généré automatiquement" />
      <ProductForm mode="create" />
    </div>
  );
}
