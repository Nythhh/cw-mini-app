import type { ContactMethod } from "@/types/checkout";

const STORAGE_KEY = "cw-checkout-draft";

export interface CheckoutDraftPayload {
  firstName: string;
  phone: string;
  address: string;
  note: string;
  preferredContactMethod: ContactMethod;
}

export function readCheckoutDraft(): Partial<CheckoutDraftPayload> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed as Partial<CheckoutDraftPayload>;
  } catch {
    return null;
  }
}

export function writeCheckoutDraft(payload: CheckoutDraftPayload): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // quota / private mode
  }
}
