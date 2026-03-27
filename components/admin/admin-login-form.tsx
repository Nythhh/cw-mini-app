"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminLoginFormProps {
  onSuccess: () => void;
}

export function AdminLoginForm({ onSuccess }: AdminLoginFormProps): JSX.Element {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = (await r.json().catch(() => ({}))) as { error?: string };
      if (!r.ok) {
        setError(data.error ?? "Connexion refusée");
        return;
      }
      onSuccess();
    } catch {
      setError("Erreur réseau");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={(e) => void submit(e)} className="mx-auto w-full max-w-sm space-y-5 px-4 pt-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 neon-border">
          <Lock className="h-7 w-7 text-accent" aria-hidden />
        </div>
        <h1 className="font-display text-xl text-accent">CW — Admin</h1>
        <p className="text-sm text-foreground-muted">Mot de passe pour gérer le catalogue (stock, prix, images).</p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-500/10 px-3 py-2 text-center text-sm text-red-300 neon-border" role="alert">
          {error}
        </p>
      )}

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-foreground-muted">Mot de passe</span>
        <Input
          type="password"
          name="admin-password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="font-mono"
          disabled={pending}
        />
      </label>

      <Button type="submit" className="w-full" disabled={pending || !password.trim()}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Connexion…
          </>
        ) : (
          "Entrer"
        )}
      </Button>
    </form>
  );
}
