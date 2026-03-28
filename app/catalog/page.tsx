"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { CategoryPills } from "@/components/product/category-pills";
import { FilterBar } from "@/components/product/filter-bar";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchBar } from "@/components/product/search-bar";
import { SectionTitle } from "@/components/shared/section-title";
import { DEFAULT_CATEGORIES } from "@/data/categories";
import { useFilters } from "@/hooks/useFilters";
import { useProducts } from "@/hooks/useProducts";

function CatalogContent(): JSX.Element {
  const { products } = useProducts();
  const searchParams = useSearchParams();
  const {
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory,
    activeTag, setActiveTag,
    sortBy, setSortBy,
    availableTags, filteredProducts
  } = useFilters(products);

  useEffect(() => {
    const c = searchParams.get("category");
    if (c) {
      setActiveCategory(c);
    }
  }, [searchParams, setActiveCategory]);

  const activeCat = activeCategory === "All" ? null : activeCategory;

  return (
    <div className="space-y-4 pt-4">
      <SectionTitle title="Catalogue 🌿" subtitle="Tous nos produits CBD légaux" />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryPills
        categories={DEFAULT_CATEGORIES}
        active={activeCat}
        onChange={(cat) => setActiveCategory(cat ?? "All")}
      />
      <FilterBar
        tags={availableTags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <ProductGrid products={filteredProducts} />
    </div>
  );
}

export default function CatalogPage(): JSX.Element {
  return (
    <Suspense>
      <CatalogContent />
    </Suspense>
  );
}
