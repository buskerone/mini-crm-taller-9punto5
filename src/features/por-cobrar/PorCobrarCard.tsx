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
import { formatCLP } from "@/lib/format";
import type { CrmData } from "@/lib/types";

import { usePorCobrar } from "./usePorCobrar";

export function PorCobrarCard({ data }: { data: CrmData }) {
  const { total, pendientes } = usePorCobrar(data);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Por cobrar</CardTitle>
        <CardDescription>Cobros con pagado = No</CardDescription>
        <CardAction>
          <Badge variant="outline">Hito 2</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-1">
        <p className="text-4xl font-semibold tracking-tight tabular-nums">{formatCLP(total)}</p>
        <p className="text-sm text-muted-foreground">
          {pendientes} {pendientes === 1 ? "cobro pendiente" : "cobros pendientes"}
        </p>
      </CardContent>
      <CardFooter className="flex-col items-start gap-5">
        <Separator />
        <code className="font-mono text-[13px] text-muted-foreground">
          sum(amount_clp) where paid = false
        </code>
      </CardFooter>
    </Card>
  );
}
