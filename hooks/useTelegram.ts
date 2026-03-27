"use client";

import { useEffect, useState } from "react";
import {
  getTelegramWebApp,
  getTelegramUser,
  isTelegramContext,
  type TelegramUser,
  type TelegramWebApp
} from "@/lib/telegram";

interface UseTelegramReturn {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  isTelegram: boolean;
}

export function useTelegram(): UseTelegramReturn {
  const [state, setState] = useState<UseTelegramReturn>({
    webApp: null,
    user: null,
    isTelegram: false
  });

  useEffect(() => {
    setState({
      webApp: getTelegramWebApp(),
      user: getTelegramUser(),
      isTelegram: isTelegramContext()
    });
  }, []);

  return state;
}
