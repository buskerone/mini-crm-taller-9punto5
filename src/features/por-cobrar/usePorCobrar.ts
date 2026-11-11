import { useMemo } from "react";

import { cobrosPendientes, porCobrar } from "@/lib/metrics";
import type { CrmData } from "@/lib/types";

export function usePorCobrar(data: CrmData) {
  return useMemo(
    () => ({
      total: porCobrar(data.invoices),
      pendientes: cobrosPendientes(data.invoices).length,
    }),
    [data],
  );
}
