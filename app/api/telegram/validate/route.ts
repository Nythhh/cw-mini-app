import { NextRequest, NextResponse } from "next/server";

import { validateTelegramWebAppInitData } from "@/lib/telegram-webapp-auth";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { initData } = await req.json();

    if (!initData || typeof initData !== "string") {
      return NextResponse.json({ valid: false, error: "Missing initData" }, { status: 400 });
    }

    if (!BOT_TOKEN) {
      return NextResponse.json({ valid: false, error: "Bot token not configured" }, { status: 503 });
    }

    const { valid, data } = validateTelegramWebAppInitData(initData, BOT_TOKEN);

    if (!valid) {
      return NextResponse.json({ valid: false, error: "Invalid signature" }, { status: 401 });
    }

    const user = data.user ? JSON.parse(data.user) : null;

    return NextResponse.json({ valid: true, user });
  } catch {
    return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 });
  }
}
