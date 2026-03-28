"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, X, Loader2, Save, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CategoryManager(): JSX.Element {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/categories", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { categories?: string[] }) => {
        if (Array.isArray(data.categories)) setCategories(data.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  const addCategory = useCallback(() => {
    const val = newCat.trim();
    if (!val) return;
    if (categories.some((c) => c.toLowerCase() === val.toLowerCase())) {
      setFeedback("Cette catégorie existe déjà");
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    setCategories((prev) => [...prev, val]);
    setNewCat("");
    setDirty(true);
  }, [newCat, categories]);

  const removeCategory = useCallback((cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
    setDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories })
      });
      if (!res.ok) throw new Error("Erreur");
      const data = await res.json();
      setCategories(data.categories);
      setDirty(false);
      setFeedback("Catégories sauvegardées");
      setTimeout(() => setFeedback(null), 2500);
    } catch {
      setFeedback("Erreur lors de la sauvegarde");
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setSaving(false);
    }
  }, [categories]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-surface p-4 neon-border">
        <p className="text-sm text-foreground-muted">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl bg-surface p-4 neon-border">
      <div className="flex items-center gap-2">
        <Tag size={16} className="text-accent" />
        <h3 className="font-display text-sm tracking-wide text-foreground">Catégories</h3>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat}
            className="group flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent transition-colors"
          >
            {cat}
            <button
              type="button"
              onClick={() => removeCategory(cat)}
              className="flex h-4 w-4 items-center justify-center rounded-full text-accent/50 transition-colors hover:bg-red-400/20 hover:text-red-400"
              aria-label={`Supprimer ${cat}`}
            >
              <X size={12} strokeWidth={3} />
            </button>
          </span>
        ))}
        {categories.length === 0 && (
          <p className="text-xs text-foreground-muted">Aucune catégorie</p>
        )}
      </div>

      {/* Add new category */}
      <div className="flex gap-2">
        <Input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="Nouvelle catégorie…"
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCategory();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={addCategory}
          disabled={!newCat.trim()}
          className="shrink-0 px-3"
        >
          <Plus size={16} />
        </Button>
      </div>

      {/* Feedback */}
      {feedback && (
        <p className="text-xs font-semibold text-accent" role="status">
          {feedback}
        </p>
      )}

      {/* Save button */}
      <Button
        type="button"
        className="w-full"
        onClick={handleSave}
        disabled={!dirty || saving}
        title={!dirty ? "Aucune modification à enregistrer" : undefined}
      >
        {saving ? (
          <Loader2 size={16} className="mr-2 animate-spin" />
        ) : (
          <Save size={16} className="mr-2" />
        )}
        {saving ? "Sauvegarde…" : "Sauvegarder"}
      </Button>
    </div>
  );
}
