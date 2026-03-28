"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Truck, ShoppingBag } from "lucide-react";

import { CheckoutPromoSection } from "@/components/checkout/checkout-promo-section";
import { ContactMethodSelector } from "@/components/checkout/contact-method-selector";
import { OrderSummaryCard, buildOrderSummaryText } from "@/components/checkout/order-summary-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";
import { useCheckoutFormPersist } from "@/hooks/useCheckoutFormPersist";
import { CONTACT_LINKS, DELIVERY_LABEL } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { ContactMethod } from "@/types/checkout";

type AppliedPromo = {
  code: string;
  label: string;
  discountAmount: number;
  totalAfter: number;
};

const CTA_LABELS: Record<ContactMethod, string> = {
  whatsapp: "WhatsApp — message prêt à envoyer",
  signal: "Signal — message copié, colle puis envoie",
  snapchat: "Snapchat — message copié, colle puis envoie"
};

const CTA_ORDER: ContactMethod[] = ["whatsapp", "signal", "snapchat"];

export default function CheckoutPage(): JSX.Element {
  const { items, subtotal, orderNote, setOrderNote } = useCart();
  const { form, update, hydrated } = useCheckoutFormPersist(orderNote, setOrderNote);

  const [copiedFor, setCopiedFor] = useState<ContactMethod | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);

  useEffect(() => {
    if (!appliedPromo?.code) return;
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: appliedPromo.code, subtotal })
      });
      const data = (await res.json()) as
        | { ok: true; code: string; label: string; discountAmount: number; totalAfter: number }
        | { ok: false; error?: string };
      if (cancelled) return;
      if (!data.ok) {
        setAppliedPromo(null);
        setPromoError(data.error ?? "Promo non applicable — panier modifié.");
        return;
      }
      setPromoError(null);
      setAppliedPromo({
        code: data.code,
        label: data.label,
        discountAmount: data.discountAmount,
        totalAfter: data.totalAfter
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [subtotal, appliedPromo?.code]);

  const promoLine = useMemo(() => {
    if (!appliedPromo) return null;
    return {
      code: appliedPromo.code,
      discountAmount: appliedPromo.discountAmount,
      total: appliedPromo.totalAfter
    };
  }, [appliedPromo]);

  const totalToPay = appliedPromo?.totalAfter ?? subtotal;

  const canFinalize =
    form.firstName.trim().length > 0 &&
    form.phone.trim().length > 0 &&
    form.address.trim().length > 0;

  const summaryText = useMemo(
    () =>
      buildOrderSummaryText({
        items,
        phone: form.phone,
        address: form.address,
        note: form.note,
        promo: promoLine
      }),
    [form.address, form.note, form.phone, items, promoLine]
  );

  const handleApplyPromo = useCallback(async () => {
    setPromoError(null);
    setApplyingPromo(true);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput.trim(), subtotal })
      });
      const data = (await res.json().catch(() => ({}))) as
        | { ok: true; code: string; label: string; discountAmount: number; totalAfter: number }
        | { ok: false; error?: string };
      if (!res.ok) {
        setPromoError("Erreur serveur");
        setAppliedPromo(null);
        return;
      }
      if (!data.ok) {
        setPromoError(data.error ?? "Code invalide");
        setAppliedPromo(null);
        return;
      }
      setAppliedPromo({
        code: data.code,
        label: data.label,
        discountAmount: data.discountAmount,
        totalAfter: data.totalAfter
      });
      setPromoInput(data.code);
    } catch {
      setPromoError("Erreur réseau");
      setAppliedPromo(null);
    } finally {
      setApplyingPromo(false);
    }
  }, [promoInput, subtotal]);

  const handleRemovePromo = useCallback(() => {
    setAppliedPromo(null);
    setPromoError(null);
  }, []);

  const handlePromoInputChange = useCallback((value: string) => {
    setPromoInput(value);
    setPromoError(null);
  }, []);

  const customerBlock = useMemo(() => {
    const lines = [
      `👤 Client: ${form.firstName || "Non spécifié"}`,
      `📱 Tel: ${form.phone || "Non fourni"}`,
      `📍 Adresse: ${form.address || "Non fournie"}`,
      "",
      summaryText
    ];
    return lines.filter(Boolean).join("\n");
  }, [form.address, form.firstName, form.phone, summaryText]);

  const sortedMethods = useMemo(() => {
    const primary = form.preferredContactMethod;
    return [primary, ...CTA_ORDER.filter((m) => m !== primary)];
  }, [form.preferredContactMethod]);

  const handleFinalize = useCallback(
    async (method: ContactMethod) => {
      if (!canFinalize) return;

      if (method === "whatsapp") {
        const url = `${CONTACT_LINKS.whatsapp}?text=${encodeURIComponent(customerBlock)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }

      try {
        await navigator.clipboard.writeText(customerBlock);
        setCopiedFor(method);
        window.setTimeout(() => setCopiedFor(null), 5000);
      } catch {
        // ouverture de l’app quand même
      }

      window.open(CONTACT_LINKS[method], "_blank", "noopener,noreferrer");
    },
    [canFinalize, customerBlock]
  );

  if (items.length === 0) {
    return (
      <div className="space-y-5 pt-4">
        <SectionTitle title="Finaliser" subtitle="Choisis comment nous envoyer ta commande." />
        <EmptyState icon={ShoppingBag} title="Aucun produit" description="Ajoute des articles à ton panier d'abord." />
        <Button asChild className="w-full">
          <Link href="/catalog">Voir le catalogue</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-4">
      <SectionTitle
        title="Finaliser 📋"
        subtitle="Un clic ouvre l’app : ta commande est déjà rédigée (WhatsApp) ou copiée (Signal, Snapchat). Tes infos sont mémorisées sur cet appareil."
      />

      <form
        id="checkout-delivery"
        className={`space-y-3 transition-opacity duration-200 ${hydrated ? "opacity-100" : "opacity-90"}`}
        autoComplete="on"
        onSubmit={(e) => e.preventDefault()}
      >
        <p className="text-xs text-foreground-muted/80">
          Préremplissage : navigateur (saisie automatique) + dernière session sur cet appareil.
        </p>
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-foreground-muted">
            Prénom <span className="text-red-400">*</span>
          </span>
          <Input
            name="given-name"
            autoComplete="given-name"
            enterKeyHint="next"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            placeholder="Alex"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-foreground-muted">
            📱 Téléphone <span className="text-red-400">*</span>
          </span>
          <Input
            type="tel"
            name="tel"
            autoComplete="tel"
            enterKeyHint="next"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+33 6 12 34 56 78"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-foreground-muted">
            📍 Adresse <span className="text-red-400">*</span>
          </span>
          <Textarea
            name="street-address"
            autoComplete="street-address"
            enterKeyHint="done"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="12 Rue de la Paix, Nancy"
          />
        </label>
      </form>

      <div className="flex items-center gap-3 rounded-2xl bg-accent/10 px-4 py-3 neon-border">
        <Truck className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.8} aria-hidden="true" />
        <span className="text-sm font-bold text-accent">{DELIVERY_LABEL}</span>
      </div>

      <CheckoutPromoSection
        input={promoInput}
        onInputChange={handlePromoInputChange}
        onApply={handleApplyPromo}
        onRemove={handleRemovePromo}
        applied={Boolean(appliedPromo)}
        appliedLabel={appliedPromo?.label}
        error={promoError}
        applying={applyingPromo}
      />

      <OrderSummaryCard
        items={items}
        phone={form.phone}
        address={form.address}
        note={form.note}
        promo={promoLine}
      />

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground-muted">📝 Note supplémentaire</span>
        <Textarea
          name="order-notes"
          autoComplete="off"
          value={form.note ?? ""}
          onChange={(e) => update("note", e.target.value)}
        />
      </label>

      <div className="space-y-2">
        <SectionTitle title="Finaliser via" />
        <ContactMethodSelector
          selected={form.preferredContactMethod}
          onSelect={(m) => update("preferredContactMethod", m)}
        />
      </div>

      <div className="rounded-2xl bg-surface p-5 text-center neon-border">
        <p className="text-sm font-semibold text-foreground-muted">Total</p>
        <p className="mt-1 font-display text-3xl text-accent neon-text">{formatPrice(totalToPay)}</p>
      </div>

      {!canFinalize && (
        <p className="text-center text-sm text-foreground-muted/50">
          Remplis le prénom, téléphone et adresse pour continuer.
        </p>
      )}

      {copiedFor && (
        <p className="text-center text-xs font-semibold text-accent" role="status">
          Message copié — colle (Ctrl+V / long appui) dans {copiedFor === "signal" ? "Signal" : "Snapchat"}, puis envoie.
        </p>
      )}

      <div className="space-y-2 pb-4">
        {sortedMethods.map((method, idx) => (
          <Button
            key={method}
            type="button"
            variant={idx === 0 ? "default" : "outline"}
            className="w-full text-sm"
            disabled={!canFinalize}
            onClick={() => handleFinalize(method)}
          >
            {CTA_LABELS[method]}
          </Button>
        ))}
      </div>
    </div>
  );
}
