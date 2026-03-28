"use client";

import { useEffect } from "react";

import { CategoryPills } from "@/components/product/category-pills";
import { FilterBar } from "@/components/product/filter-bar";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchBar } from "@/components/product/search-bar";
import { SectionTitle } from "@/components/shared/section-title";
import { CATEGORIES } from "@/data/categories";
import { useFilters } from "@/hooks/useFilters";
import { useProducts } from "@/hooks/useProducts";
import type { ProductCategory } from "@/types/product";

export default function CatalogPage(): JSX.Element {
  const { products } = useProducts();
  const list = products;
  const {
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory,
    activeTag, setActiveTag,
    sortBy, setSortBy,
    availableTags, filteredProducts
  } = useFilters(list);

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("category");
    if (c && CATEGORIES.includes(c as ProductCategory)) {
      setActiveCategory(c as ProductCategory);
    }
  }, [setActiveCategory]);

  const activeCat = activeCategory === "All" ? null : activeCategory;

  return (
    <div className="space-y-4 pt-4">
      <SectionTitle title="Catalogue 🌿" subtitle="Tous nos produits CBD légaux" />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryPills
        categories={CATEGORIES}
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
