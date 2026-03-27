import Image from "next/image";
import { Clock3, MapPin, MessageSquareText, Info, ShieldCheck } from "lucide-react";

import { SectionTitle } from "@/components/shared/section-title";
import { StoreInfoCard } from "@/components/shared/store-info-card";
import { Button } from "@/components/ui/button";
import { BRAND, CONTACT_LINKS } from "@/lib/constants";

const FAQ = [
  {
    q: "Combien de temps pour la livraison ?",
    a: "Nos livreurs s'efforcent de vous proposer une prestation de qualité, chaque livraison prend entre 15 et 30 minutes."
  },
  { q: "C'est discret ?", a: "Oui. Emballage et communication 100% discrets par défaut." }
];

export default function StorePage(): JSX.Element {
  return (
    <div className="space-y-5 pt-4">
      <SectionTitle title="Notre shop 🏪" subtitle="À propos de CW et du service local" />

      {/* Logo sticker */}
      <div className="flex justify-center">
        <Image
          src={BRAND.sticker}
          alt={BRAND.fullName}
          width={200}
          height={200}
          className="rounded-3xl shadow-glow-lg"
        />
      </div>

      <div className="rounded-2xl bg-surface neon-border">
        <StoreInfoCard
          icon={Info}
          title="À propos"
          description="CW (Canna-Weed) est le shop officiel de notre marque, depuis 2022 nous sommes axés sur la qualité, la transparence et un support client fluide. Nancy & alentours."
        />
        <StoreInfoCard
          icon={MapPin}
          title="Zone de livraison"
          description="Nancy centre + alentours jusqu'à 12km."
        />
        <StoreInfoCard
          icon={Clock3}
          title="Horaires"
          description="Lun–Sam: 10h–21h · Dimanche: 12h–18h"
        />
        <StoreInfoCard
          icon={ShieldCheck}
          title="Premium quality only"
          description="Tous nos produits sont certifiés et approuvés. Notre sélection est faite minutieusement, avec une qualité irréprochable, sur l'ensemble de toute notre gamme."
        />
      </div>

      <div className="space-y-2">
        <SectionTitle title="FAQ ❓" />
        <div className="space-y-2">
          {FAQ.map((faq) => (
            <div key={faq.q} className="rounded-2xl bg-surface p-4 neon-border">
              <h4 className="font-display text-base tracking-wide text-foreground">{faq.q}</h4>
              <p className="mt-1 text-sm text-foreground-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle title="Contact 💬" />
        <div className="flex items-center gap-2 rounded-t-2xl bg-surface px-4 py-3 neon-border">
          <MessageSquareText className="h-5 w-5 text-accent" strokeWidth={1.8} />
          <span className="text-sm font-bold text-foreground-muted">Contacte-nous quand tu veux !</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button asChild>
            <a href={CONTACT_LINKS.whatsapp} target="_blank" rel="noreferrer">💬 WhatsApp</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={CONTACT_LINKS.signal} target="_blank" rel="noreferrer">🔐 Signal</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={CONTACT_LINKS.snapchat} target="_blank" rel="noreferrer">👻 Snapchat</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
