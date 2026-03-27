"use client";

import { useState } from "react";

import { PromoBanner } from "@/components/shared/promo-banner";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { OFFERS } from "@/data/offers";

export default function OffersPage(): JSX.Element {
  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  return (
    <div className="space-y-5 pt-4">
      <SectionTitle title="Promos 🔥" subtitle="Offres limitées pour les clients CW" />

      <PromoBanner
        highlight="🎉 Cette semaine"
        title="Evening Calm Pack"
        description="Économise 15% sur les packs combo sélectionnés !"
      />

      <div className="space-y-2.5 rounded-2xl bg-surface p-4 neon-border">
        <span className="font-display text-base tracking-wide text-accent">Code promo</span>
        <div className="flex gap-2">
          <Input
            name="promo-code"
            autoComplete="off"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Entre ton code..."
          />
          <Button size="sm" onClick={() => setAppliedCode(promoCode.trim() || null)}>OK</Button>
        </div>
        {appliedCode && (
          <Badge className="mt-1">✅ {appliedCode}</Badge>
        )}
      </div>

      <div className="space-y-2">
        {OFFERS.map((offer) => (
          <div key={offer.id} className="rounded-2xl bg-surface p-4 neon-border">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-base tracking-wide text-foreground">{offer.title}</h3>
              <Badge>{offer.discountLabel}</Badge>
            </div>
            <p className="mt-1 text-sm text-foreground-muted">{offer.description}</p>
            {offer.code && (
              <p className="mt-1.5 text-xs text-foreground-muted/50">Code: <span className="font-bold text-accent">{offer.code}</span></p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
