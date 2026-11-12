import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCLP, formatDate } from "@/lib/format";
import type { CrmData } from "@/lib/types";

import { useCobrosVencidos } from "./useCobrosVencidos";

export function CobrosVencidosCard({ data }: { data: CrmData }) {
  const { total, cantidad, visibles, restantes } = useCobrosVencidos(data);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>C · Cobros vencidos</CardTitle>
        <CardDescription>No pagados con vencimiento anterior al corte</CardDescription>
        <CardAction>
          <Badge variant="outline">C</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="flex items-end gap-2.5">
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{formatCLP(total)}</p>
          <p className="pb-1 text-sm text-muted-foreground">
            {cantidad} {cantidad === 1 ? "cobro" : "cobros"}
          </p>
        </div>
        <ul className="flex flex-col">
          {visibles.map((item, index) => (
            <li
              key={item.id}
              className={`flex h-11 items-center justify-between gap-3 ${index > 0 ? "border-t" : ""}`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-[13px] text-muted-foreground">
                  Venció {formatDate(item.due_on)}
                </p>
              </div>
              <p className="shrink-0 text-sm font-medium tabular-nums">
                {formatCLP(item.amount_clp)}
              </p>
            </li>
          ))}
          {visibles.length === 0 && (
            <li className="text-sm text-muted-foreground">No hay cobros vencidos</li>
          )}
        </ul>
        {restantes > 0 && (
          <p className="text-sm text-muted-foreground">
            y {restantes} {restantes === 1 ? "cobro más" : "cobros más"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
