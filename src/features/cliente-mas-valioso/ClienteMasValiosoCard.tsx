import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCLP } from "@/lib/format";
import type { CrmData } from "@/lib/types";

import { useClienteMasValioso } from "./useClienteMasValioso";

export function ClienteMasValiosoCard({ data }: { data: CrmData }) {
  const ranking = useClienteMasValioso(data);
  const primero = ranking[0];
  const segundo = ranking[1];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>B · Cliente más valioso</CardTitle>
        <CardDescription>Mayor suma de cobros pagados</CardDescription>
        <CardAction>
          <Badge variant="outline">B</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        {primero ? (
          <div className="flex items-center gap-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-[15px] font-medium text-primary-foreground">
              {primero.initials}
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="truncate text-base font-medium">1.º · {primero.name}</p>
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {formatCLP(primero.monto)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sin cobros pagados</p>
        )}
        {segundo && (
          <>
            <Separator />
            <div className="flex items-center gap-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-[15px] font-medium">
                {segundo.initials}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate text-[15px] font-medium">2.º · {segundo.name}</p>
                <p className="text-sm text-muted-foreground">Cobros pagados</p>
              </div>
              <p className="text-lg font-semibold tabular-nums">{formatCLP(segundo.monto)}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
