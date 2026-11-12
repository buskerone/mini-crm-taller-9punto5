import { useMemo } from "react";

import { embudo } from "@/lib/metrics";
import type { CrmData } from "@/lib/types";

export function useEmbudo(data: CrmData) {
  return useMemo(() => {
    const { porEstado, tasaAceptacion } = embudo(data.quotes);
    const mayor = Math.max(1, ...porEstado.map((estado) => estado.cantidad));
    return {
      estados: porEstado.map((estado) => ({ ...estado, proporcion: estado.cantidad / mayor })),
      tasaAceptacion,
    };
  }, [data]);
}
