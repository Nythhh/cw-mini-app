import crypto from "crypto";

/**
 * Valide la signature Telegram Web App initData (voir https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)
 */
export function validateTelegramWebAppInitData(
  initData: string,
  botToken: string
): { valid: boolean; data: Record<string, string> } {
  if (!botToken || !initData) return { valid: false, data: {} };

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return { valid: false, data: {} };

  params.delete("hash");
  const entries = Array.from(params.entries());
  entries.sort(([a], [b]) => a.localeCompare(b));
  const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();

  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  let valid = false;
  try {
    const a = Buffer.from(computedHash, "hex");
    const b = Buffer.from(hash, "hex");
    if (a.length === b.length) valid = crypto.timingSafeEqual(a, b);
  } catch {
    valid = false;
  }

  const data: Record<string, string> = {};
  for (const [k, v] of entries) data[k] = v;

  return { valid, data };
}
