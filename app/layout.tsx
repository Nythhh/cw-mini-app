import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { AppHeader } from "@/components/layout/app-header";
import { MainShell } from "@/components/layout/main-shell";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { CartProvider } from "@/hooks/useCart";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${BRAND.shortName} — ${BRAND.fullName}`,
  description: "Nancy & Alentours — Qualité Livrée !"
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className="min-h-dvh bg-background font-sans text-foreground" suppressHydrationWarning>
        <CartProvider>
          <AppHeader />
          <MainShell>{children}</MainShell>
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
