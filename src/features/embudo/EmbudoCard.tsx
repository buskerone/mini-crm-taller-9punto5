import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCLP, formatPercent } from "@/lib/format";
import type { CrmData, QuoteStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

import { useEmbudo } from "./useEmbudo";

const BADGE: Record<QuoteStatus, "default" | "secondary" | "destructive"> = {
  aceptada: "default",
  enviada: "secondary",
  rechazada: "destructive",
};

const BARRA: Record<QuoteStatus, string> = {
  aceptada: "bg-primary",
  enviada: "bg-ring",
  rechazada: "bg-destructive",
};

export function EmbudoCard({ data }: { data: CrmData }) {
  const { estados, tasaAceptacion } = useEmbudo(data);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>A · Embudo de cotizaciones</CardTitle>
        <CardDescription>Cantidad y monto por estado</CardDescription>
        <CardAction>
          <Badge variant="outline">A</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3.5">
        {estados.map((estado) => (
          <div key={estado.status} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4">
              <Badge variant={BADGE[estado.status]}>{estado.status}</Badge>
              <span className="text-sm font-medium tabular-nums">
                {estado.cantidad} · {formatCLP(estado.monto)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted" aria-hidden>
              <div
                className={cn("h-2 rounded-full", BARRA[estado.status])}
                style={{ width: `${estado.proporcion * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-5">
        <Separator />
        <div className="flex items-end justify-between gap-4">
          <span className="text-sm text-muted-foreground">Tasa de aceptación</span>
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {formatPercent(tasaAceptacion)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
