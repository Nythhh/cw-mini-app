"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, MessageCircleMore, Eye, ArrowRight } from "lucide-react";

import { ProductGrid } from "@/components/product/product-grid";
import { PromoBanner } from "@/components/shared/promo-banner";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { DEFAULT_CATEGORIES } from "@/data/categories";
import { useProducts } from "@/hooks/useProducts";
import { BRAND } from "@/lib/constants";

const TRUST = [
  { label: "Qualité testée", icon: ShieldCheck, emoji: "✅" },
  { label: "Livraison rapide", icon: Truck, emoji: "🚀" },
  { label: "Contact rapide", icon: MessageCircleMore, emoji: "💬" },
  { label: "100% discret", icon: Eye, emoji: "🤫" }
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function HomePage(): JSX.Element {
  const { products } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <motion.div className="space-y-8" variants={stagger} initial={false} animate="show">
      {/* Hero with banner */}
      <motion.section variants={fadeUp} className="pt-4">
        <div className="relative -mx-4 overflow-hidden rounded-b-3xl">
          <Image
            src={BRAND.banner}
            alt="Bienvenue chez Canna-Weed"
            width={800}
            height={400}
            className="w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-4 pb-5 pt-10 sm:px-5">
            <h1 className="font-display text-balance text-lg leading-snug tracking-wide sm:text-2xl md:text-display-lg">
              <span className="text-accent neon-text">{BRAND.fullName.toUpperCase()}</span>
              <span className="font-normal text-foreground/90"> — le shop</span>
            </h1>
            <p className="text-sm font-semibold leading-relaxed text-foreground/80">{BRAND.tagline}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button asChild>
            <Link href="/catalog">
              Shop now 🛒
              <ArrowRight size={14} className="ml-1" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/offers">Promos 🔥</Link>
          </Button>
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section variants={fadeUp}>
        <SectionTitle title="Categories" />
        <div className="grid grid-cols-3 gap-2">
          {DEFAULT_CATEGORIES.slice(0, 6).map((category) => (
            <Link
              key={category}
              href={`/catalog?category=${encodeURIComponent(category)}`}
              className="rounded-2xl bg-surface px-3 py-3.5 text-center text-xs font-bold text-foreground-muted neon-border transition-all duration-200 hover:bg-accent/10 hover:text-accent hover:shadow-glow"
            >
              {category}
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Featured */}
      <motion.section variants={fadeUp}>
        <SectionTitle title="Best sellers 🔥" subtitle="Les plus demandés cette semaine" />
        <ProductGrid products={featured} />
      </motion.section>

      {/* Promo */}
      <motion.section variants={fadeUp}>
        <PromoBanner
          highlight="🎉 Promo"
          title="CW Smooth Bundle"
          description="Fleurs + infusion — 10% de réduction cette semaine !"
        />
      </motion.section>

      {/* Trust */}
      <motion.section variants={fadeUp}>
        <SectionTitle title="Pourquoi CW ?" />
        <div className="grid grid-cols-2 gap-2">
          {TRUST.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-surface px-3.5 py-3.5 neon-border">
              <span className="text-lg">{item.emoji}</span>
              <span className="text-xs font-bold text-foreground-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
