import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { CrmData } from "@/lib/types";

import { useUltimasAltas } from "./useUltimasAltas";

// Ejemplo del patrón: no está montado en la página. Para verlo, ponlo dentro de SprintSlot
// como <UltimasAltasCard data={data} />.
export function UltimasAltasCard({ data }: { data: CrmData }) {
  const clientes = useUltimasAltas(data);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Últimas altas</CardTitle>
        <CardDescription>Los clientes más recientes según su fecha de alta</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {clientes.map((cliente) => (
            <li key={cliente.id} className="flex items-baseline justify-between gap-4">
              <span className="font-medium">{cliente.name}</span>
              <span className="text-sm text-muted-foreground">
                {cliente.city} · {formatDate(cliente.created_on)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
