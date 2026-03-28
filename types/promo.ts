export type PromoKind = "percent" | "fixed";

export interface PromoCodeRecord {
  id: string;
  /** Code saisi par le client (normalisé en majuscules côté serveur) */
  code: string;
  kind: PromoKind;
  /** Pourcentage (ex. 10 = 10 %) ou montant fixe en € */
  value: number;
  label: string;
  active: boolean;
}
