"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Padding bas : nav shop (pb-24) vs mini-app admin (pb-22) — la nav admin est dans AdminMiniAppShell.
 */
export function MainShell({ children }: { children: ReactNode }): JSX.Element {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <main
      className={`relative z-10 mx-auto w-full max-w-md px-4 pt-2 ${isAdmin ? "pb-20" : "pb-24"}`}
    >
      {children}
    </main>
  );
}
