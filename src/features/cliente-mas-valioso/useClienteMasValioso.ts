import { useMemo } from "react";

import { clienteMasValioso } from "@/lib/metrics";
import type { CrmData } from "@/lib/types";

export function useClienteMasValioso(data: CrmData) {
  return useMemo(() => clienteMasValioso(data.clients, data.invoices, 2), [data]);
}
