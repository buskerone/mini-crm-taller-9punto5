import { TableEmptyRow } from "@/components/TableEmptyRow";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCLP, formatDate } from "@/lib/format";
import type { Client, Quote, QuoteStatus } from "@/lib/types";

const STATUS_VARIANT: Record<QuoteStatus, "default" | "secondary" | "destructive"> = {
  aceptada: "default",
  enviada: "secondary",
  rechazada: "destructive",
};

type QuotesTableProps = { quotes: Quote[]; clients: Client[]; className?: string };

export function QuotesTable({ quotes, clients, className }: QuotesTableProps) {
  const clientNames = new Map(clients.map((client) => [client.id, client.name]));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Cotizaciones</CardTitle>
        <CardDescription>quotes · QuotesTable.tsx</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Emisión</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="pl-8">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length === 0 && <TableEmptyRow colSpan={5} />}
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="text-muted-foreground">{quote.id}</TableCell>
                <TableCell className="font-medium">
                  {clientNames.get(quote.client_id) ?? "—"}
                </TableCell>
                <TableCell>{formatDate(quote.issued_on)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCLP(quote.amount_clp)}
                </TableCell>
                <TableCell className="pl-8">
                  <Badge variant={STATUS_VARIANT[quote.status]}>{quote.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
