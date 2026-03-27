import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminGate } from "@/components/admin/admin-gate";

export const metadata: Metadata = {
  title: "CW — Admin",
  description: "Stock, produits & mini-app gestion"
};

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }): JSX.Element {
  return <AdminGate>{children}</AdminGate>;
}
