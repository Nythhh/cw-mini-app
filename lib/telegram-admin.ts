import { getTelegramWebApp } from "@/lib/telegram";

/**
 * Thème + viewport pour la mini-app admin (aligné sur Telegram themeParams).
 */
export function initAdminTelegramWebApp(): void {
  const wa = getTelegramWebApp();
  if (!wa) return;

  wa.ready();
  wa.expand();

  const tp = wa.themeParams;
  const header = tp.secondary_bg_color ?? tp.bg_color ?? "#161b22";
  const bg = tp.bg_color ?? "#0d1117";

  wa.setHeaderColor(header);
  wa.setBackgroundColor(bg);
  wa.MainButton.hide();
}
