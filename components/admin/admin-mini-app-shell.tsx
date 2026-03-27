"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutGrid, Plus, Store } from "lucide-react";

import { getTelegramWebApp } from "@/lib/telegram";

export function AdminMiniAppShell({ children }: { children: React.ReactNode }): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const wa = getTelegramWebApp();
    if (!wa) return;

    const isSubPage = pathname !== "/admin" && pathname.startsWith("/admin");
    if (isSubPage) {
      wa.BackButton.show();
      const handler = (): void => {
        router.push("/admin");
      };
      wa.BackButton.onClick(handler);
      return () => {
        wa.BackButton.offClick(handler);
        wa.BackButton.hide();
      };
    }
    wa.BackButton.hide();
  }, [pathname, router]);

  return (
    <div className="min-h-[50vh]">
      {children}

      <nav
        aria-label="Navigation admin"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-accent/15 bg-background/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md"
      >
        <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-1 px-3">
          <AdminNavLink
            href="/admin"
            icon={LayoutGrid}
            label="Stock"
            active={
              pathname === "/admin" ||
              (pathname.startsWith("/admin/product/") && pathname !== "/admin/product/new")
            }
          />
          <AdminNavLink href="/admin/product/new" icon={Plus} label="Nouveau" active={pathname === "/admin/product/new"} />
          <AdminNavLink href="/catalog" icon={Store} label="Boutique" active={false} externalShop />
        </div>
      </nav>
    </div>
  );
}

function AdminNavLink({
  href,
  icon: Icon,
  label,
  active,
  externalShop
}: {
  href: string;
  icon: typeof LayoutGrid;
  label: string;
  active: boolean;
  externalShop?: boolean;
}): JSX.Element {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-bold transition-colors ${
        active
          ? "text-accent shadow-[0_0_12px_rgba(57,255,20,0.25)]"
          : externalShop
            ? "text-foreground-muted hover:text-accent"
            : "text-foreground-muted hover:text-foreground"
      }`}
    >
      <Icon size={20} strokeWidth={active ? 2.4 : 1.6} aria-hidden />
      {label}
    </Link>
  );
}
