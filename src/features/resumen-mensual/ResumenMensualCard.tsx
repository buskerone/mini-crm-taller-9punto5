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

const CHART_H = 180;

export function ResumenMensualCard({ data }: { data: CrmData }) {
  const { meses } = useResumenMensual(data);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>D · Resumen mensual</CardTitle>
        <CardDescription>Facturado y cobrado por mes de emisión</CardDescription>
        <CardAction>
          <Badge variant="outline">D</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end">
          <div className="flex min-w-0 flex-1 flex-col items-center gap-4">
            <div className="relative flex h-[180px] w-full max-w-[440px] items-end justify-center gap-10 px-6">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between" aria-hidden>
                <div className="border-t border-border" />
                <div className="border-t border-border" />
                <div className="border-t border-border" />
                <div className="border-t border-border" />
              </div>
              {meses.map((mes) => (
                <div key={mes.mes} className="relative z-10 flex flex-col items-center gap-2">
                  <div className="flex items-end gap-1.5">
                    <div
                      className="w-9 rounded-t-md bg-chart-3/30"
                      style={{ height: Math.max(4, mes.facturadoPct * CHART_H) }}
                      title={`Facturado ${formatCLP(mes.facturado)}`}
                    />
                    <div
                      className="w-9 rounded-t-md bg-chart-3"
                      style={{ height: Math.max(4, mes.cobradoPct * CHART_H) }}
                      title={`Cobrado ${formatCLP(mes.cobrado)}`}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{mes.corto}</span>
                </div>
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

          <Table className="w-full max-w-sm shrink-0">
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
