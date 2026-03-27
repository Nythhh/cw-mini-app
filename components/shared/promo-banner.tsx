"use client";

import { motion } from "framer-motion";

interface PromoBannerProps {
  title: string;
  description: string;
  highlight?: string;
}

export function PromoBanner({ title, description, highlight }: PromoBannerProps): JSX.Element {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 via-surface to-surface neon-border p-5"
    >
      <div className="relative z-10">
        {highlight && (
          <span className="mb-2 inline-block rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-background shadow-neon">
            {highlight}
          </span>
        )}
        <h3 className="font-display text-2xl tracking-wide text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-foreground-muted">{description}</p>
      </div>
      <span className="absolute -right-6 -top-6 font-display text-[100px] leading-none text-accent/[0.06]">
        %
      </span>
    </motion.div>
  );
}
