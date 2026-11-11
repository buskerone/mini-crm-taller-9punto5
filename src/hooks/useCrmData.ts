import { useQuery } from "@tanstack/react-query";

import { getData } from "@/lib/data";

// TanStack Query encima de getData(): cachea el resultado y expone isPending / error.
// La lectura sigue siendo getData(); este hook no la reemplaza.
export function useCrmData() {
  return useQuery({
    queryKey: ["crm-data"],
    queryFn: getData,
    // Un error de Supabase (permisos, policies, red) se muestra al tiro: reintentar no lo arregla.
    retry: false,
  });
}
