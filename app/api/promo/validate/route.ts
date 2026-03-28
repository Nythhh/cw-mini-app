import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

import { applyPromoCode } from "@/lib/promo-apply";
import { getPromoCodes } from "@/lib/promo-repository";

const bodySchema = z.object({
  code: z.string(),
  subtotal: z.number().finite().nonnegative()
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Données invalides" }, { status: 400 });
  }

  const records = await getPromoCodes();
  const result = applyPromoCode(parsed.data.subtotal, parsed.data.code, records);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 200 });
  }

  return NextResponse.json({
    ok: true,
    code: result.code,
    label: result.label,
    discountAmount: result.discountAmount,
    totalAfter: result.totalAfter
  });
}
