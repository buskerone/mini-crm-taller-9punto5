import { useMemo } from "react";

import { resumenMensual } from "@/lib/metrics";
import type { CrmData } from "@/lib/types";

export function useResumenMensual(data: CrmData) {
  return useMemo(() => {
    const meses = resumenMensual(data.invoices);
    const max = Math.max(1, ...meses.flatMap((m) => [m.facturado, m.cobrado]));
    return {
      meses: meses.map((m) => ({
        ...m,
        facturadoPct: m.facturado / max,
        cobradoPct: m.cobrado / max,
      })),
    };
  }, [data]);
}
