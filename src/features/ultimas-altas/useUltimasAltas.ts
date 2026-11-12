import { useMemo } from "react";

import type { CrmData } from "@/lib/types";

// Patrón de widget: el hook recibe `data` (lo que entrega getData()) y devuelve solo lo que
// la tarjeta muestra. Las fechas ISO se comparan como string, sin new Date().
export function useUltimasAltas(data: CrmData, cuantas = 3) {
  return useMemo(
    () =>
      [...data.clients].sort((a, b) => b.created_on.localeCompare(a.created_on)).slice(0, cuantas),
    [data, cuantas],
  );
}
