import crypto from "crypto";

/**
 * Nettoie la valeur Vercel / .env : espaces, guillemets accidentels ("CW2026").
 */
function normalizeStoredPassword(raw: string | undefined): string {
  if (raw === undefined) return "";
  let s = raw.trim();
  if (s.length >= 2) {
    const q = s[0];
    if ((q === '"' || q === "'") && s[s.length - 1] === q) {
      s = s.slice(1, -1).trim();
    }
  }
  return s;
}

/**
 * Comparaison du mot de passe admin (env) sans fuite de longueur évidente sur le chemin heureux.
 */
export function verifyAdminPassword(attempt: string): boolean {
  const expected = normalizeStoredPassword(process.env.ADMIN_PASSWORD);
  if (expected.length < 1) return false;

  const a = attempt.trim();
  const ha = crypto.createHash("sha256").update(a, "utf8").digest();
  const hb = crypto.createHash("sha256").update(expected, "utf8").digest();
  return ha.length === hb.length && crypto.timingSafeEqual(ha, hb);
}

/** Minimum conseillé ; en prod mets un mot de passe long. */
export function isAdminPasswordConfigured(): boolean {
  const p = normalizeStoredPassword(process.env.ADMIN_PASSWORD);
  return p.length >= 6;
}
