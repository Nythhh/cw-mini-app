"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminMiniAppShell } from "@/components/admin/admin-mini-app-shell";
import { initAdminTelegramWebApp } from "@/lib/telegram-admin";

type GateState = "loading" | "authed" | "login";

export function AdminGate({ children }: { children: ReactNode }): JSX.Element {
  const [state, setState] = useState<GateState>("loading");

  useEffect(() => {
    initAdminTelegramWebApp();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run(): Promise<void> {
      const me = await fetch("/api/admin/me", { cache: "no-store" });
      if (cancelled) return;
      if (me.ok) {
        setState("authed");
        return;
      }
      setState("login");
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 pt-8">
        <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden />
        <p className="font-display text-accent">CW Admin</p>
        <p className="text-center text-sm text-foreground-muted">Chargement…</p>
      </div>
    );
  }

  if (state === "login") {
    return <AdminLoginForm onSuccess={() => setState("authed")} />;
  }

  return <AdminMiniAppShell>{children}</AdminMiniAppShell>;
}
