import { z } from "zod/v4";

import type { PromoKind } from "@/types/promo";

const kindSchema = z.enum(["percent", "fixed"] satisfies [PromoKind, PromoKind]);

export const promoCodeRecordSchema = z
  .object({
    id: z.string().min(1).max(80),
    code: z.string().min(1).max(40).transform((s) => s.trim().toUpperCase()),
    kind: kindSchema,
    value: z.number().positive(),
    label: z.string().min(1).max(120),
    active: z.boolean()
  })
  .superRefine((data, ctx) => {
    if (data.kind === "percent" && data.value > 100) {
      ctx.addIssue({ code: "custom", message: "Le pourcentage ne peut pas dépasser 100", path: ["value"] });
    }
  });

export const promoCodesPayloadSchema = z.object({
  promoCodes: z.array(promoCodeRecordSchema).max(200)
});

export type PromoCodesPayload = z.infer<typeof promoCodesPayloadSchema>;
