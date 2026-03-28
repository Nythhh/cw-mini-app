"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Save, Tag, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PromoCodeRecord, PromoKind } from "@/types/promo";

function newDraft(): PromoCodeRecord {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}`,
    code: "",
    kind: "percent",
    value: 10,
    label: "−10 %",
    active: true
  };
}

export function PromoManager(): JSX.Element {
  const [promoCodes, setPromoCodes] = useState<PromoCodeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/promo-codes", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { promoCodes?: PromoCodeRecord[] }) => {
        if (Array.isArray(data.promoCodes)) setPromoCodes(data.promoCodes);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateRow = useCallback((id: string, patch: Partial<PromoCodeRecord>) => {
    setPromoCodes((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    setDirty(true);
  }, []);

  const removeRow = useCallback((id: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
    setDirty(true);
  }, []);

  const addRow = useCallback(() => {
    setPromoCodes((prev) => [...prev, newDraft()]);
    setDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    const invalid = promoCodes.some(
      (p) => !p.code.trim() || !p.label.trim() || !(p.value > 0) || (p.kind === "percent" && p.value > 100)
    );
    if (invalid) {
      setFeedback("Vérifie chaque ligne : code, libellé, valeur (> 0 ; % ≤ 100).");
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    const upperCodes = promoCodes.map((p) => ({ ...p, code: p.code.trim().toUpperCase() }));
    const keys = upperCodes.map((p) => p.code);
    if (new Set(keys).size !== keys.length) {
      setFeedback("Deux codes identiques — modifie les doublons.");
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCodes: upperCodes })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback(typeof data.error === "string" ? data.error : "Erreur de sauvegarde");
        setTimeout(() => setFeedback(null), 4000);
        return;
      }
      if (Array.isArray(data.promoCodes)) setPromoCodes(data.promoCodes);
      setDirty(false);
      setFeedback("Codes promo enregistrés");
      setTimeout(() => setFeedback(null), 2500);
    } catch {
      setFeedback("Erreur réseau");
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setSaving(false);
    }
  }, [promoCodes]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-surface p-4 neon-border">
        <p className="text-sm text-foreground-muted">Chargement des codes promo…</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl bg-surface p-4 neon-border">
      <div className="flex items-center gap-2">
        <Tag size={16} className="text-accent" />
        <h3 className="font-display text-sm tracking-wide text-foreground">Codes promo</h3>
      </div>
      <p className="text-2xs text-foreground-muted">
        Réduction en % sur le sous-total, ou montant fixe en €. Les clients valident au checkout (API).
      </p>

      <div className="space-y-3">
        {promoCodes.map((row) => (
          <div
            key={row.id}
            className="space-y-2 rounded-xl border border-border/40 bg-background/40 p-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-0.5">
                <span className="text-2xs font-semibold text-foreground-muted">Code</span>
                <Input
                  value={row.code}
                  onChange={(e) => updateRow(row.id, { code: e.target.value.toUpperCase() })}
                  placeholder="CW10"
                  className="font-mono text-xs uppercase"
                />
              </label>
              <label className="space-y-0.5">
                <span className="text-2xs font-semibold text-foreground-muted">Type</span>
                <select
                  value={row.kind}
                  onChange={(e) => {
                    const kind = e.target.value as PromoKind;
                    updateRow(row.id, {
                      kind,
                      value: kind === "percent" ? 10 : 5,
                      label: kind === "percent" ? "−10 %" : "−5 €"
                    });
                  }}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
                >
                  <option value="percent">Pourcentage</option>
                  <option value="fixed">Montant fixe (€)</option>
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-0.5">
                <span className="text-2xs font-semibold text-foreground-muted">
                  {row.kind === "percent" ? "Valeur (%)" : "Montant (€)"}
                </span>
                <Input
                  type="number"
                  step={row.kind === "percent" ? "1" : "0.01"}
                  min="0"
                  inputMode="decimal"
                  value={row.value || ""}
                  onChange={(e) => updateRow(row.id, { value: parseFloat(e.target.value) || 0 })}
                />
              </label>
              <label className="space-y-0.5">
                <span className="text-2xs font-semibold text-foreground-muted">Libellé (checkout)</span>
                <Input
                  value={row.label}
                  onChange={(e) => updateRow(row.id, { label: e.target.value })}
                  placeholder="−10 %"
                />
              </label>
            </div>
            <div className="flex items-center justify-between gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground-muted">
                <input
                  type="checkbox"
                  checked={row.active}
                  onChange={(e) => updateRow(row.id, { active: e.target.checked })}
                  className="h-4 w-4 rounded border-border accent-accent"
                />
                Actif
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                onClick={() => removeRow(row.id)}
                aria-label="Supprimer ce code"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={addRow}>
        <Plus size={16} className="mr-2" />
        Ajouter un code
      </Button>

      {feedback && (
        <p className="text-xs font-semibold text-accent" role="status">
          {feedback}
        </p>
      )}

      <Button type="button" className="w-full" onClick={handleSave} disabled={!dirty || saving}>
        {saving ? (
          <Loader2 size={16} className="mr-2 animate-spin" />
        ) : (
          <Save size={16} className="mr-2" />
        )}
        {saving ? "Sauvegarde…" : "Sauvegarder les codes promo"}
      </Button>
    </div>
  );
}
