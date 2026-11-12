import { useMemo } from "react";

import { cobrosVencidos } from "@/lib/metrics";
import type { CrmData } from "@/lib/types";

const VISIBLES = 4;

export function useCobrosVencidos(data: CrmData) {
  return useMemo(() => {
    const { total, cantidad, items } = cobrosVencidos(data.clients, data.invoices);
    return {
      total,
      cantidad,
      visibles: items.slice(0, VISIBLES),
      restantes: Math.max(0, cantidad - VISIBLES),
    };
  }, [data]);
}
