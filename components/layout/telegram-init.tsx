"use client";

import { useEffect } from "react";
import { initTelegramWebApp } from "@/lib/telegram";

export function TelegramInit(): null {
  useEffect(() => {
    initTelegramWebApp();
  }, []);

  return null;
}
