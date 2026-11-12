import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCLP } from "@/lib/format";
import type { CrmData } from "@/lib/types";

import { useResumenMensual } from "./useResumenMensual";

export function ResumenMensualCard({ data }: { data: CrmData }) {
  const { meses } = useResumenMensual(data);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle>D · Resumen mensual</CardTitle>
        <CardDescription>Facturado y cobrado por mes de emisión</CardDescription>
        <CardAction>
          <Badge variant="outline">D</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid items-end gap-8 xl:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex min-w-0 flex-col items-center gap-3">
            <div className="relative h-36 w-full">
              <div
                className="pointer-events-none absolute inset-0 flex flex-col justify-between"
                aria-hidden
              >
                <div className="border-t border-border" />
                <div className="border-t border-border" />
                <div className="border-t border-border" />
                <div className="border-t border-border" />
              </div>
              <div className="absolute inset-0 flex items-end justify-center gap-6">
                {meses.map((mes) => (
                  <div key={mes.mes} className="flex h-full items-end gap-1.5">
                    <div
                      className="w-7 rounded-t-md bg-chart-3/30 sm:w-8"
                      style={{ height: `${Math.max(mes.facturadoPct * 100, 2)}%` }}
                      title={`Facturado ${formatCLP(mes.facturado)}`}
                    />
                    <div
                      className="w-7 rounded-t-md bg-chart-3 sm:w-8"
                      style={{ height: `${Math.max(mes.cobradoPct * 100, 2)}%` }}
                      title={`Cobrado ${formatCLP(mes.cobrado)}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-6">
              {meses.map((mes) => (
                <span
                  key={mes.mes}
                  className="w-[3.75rem] text-center text-sm text-muted-foreground sm:w-16"
                >
                  {mes.corto}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-chart-3/30" />
                Facturado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-chart-3" />
                Cobrado
              </span>
            </div>
          </div>

          <Table className="w-full max-w-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Mes</TableHead>
                <TableHead className="text-right">Facturado</TableHead>
                <TableHead className="text-right">Cobrado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meses.map((mes) => (
                <TableRow key={mes.mes}>
                  <TableCell className="font-medium">{mes.largo}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCLP(mes.facturado)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCLP(mes.cobrado)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
