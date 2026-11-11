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
import type { Client, Invoice } from "@/lib/types";

type InvoicesTableProps = { invoices: Invoice[]; clients: Client[]; className?: string };

// El vencimiento se muestra tal cual: marcar los vencidos es la tarjeta C del sprint.
export function InvoicesTable({ invoices, clients, className }: InvoicesTableProps) {
  const clientNames = new Map(clients.map((client) => [client.id, client.name]));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Cobros</CardTitle>
        <CardDescription>
          invoices · InvoicesTable.tsx · el vencimiento se muestra tal cual, sin marcar vencidos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Cotización</TableHead>
              <TableHead>Emisión</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="pl-8">Pagado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 && <TableEmptyRow colSpan={7} />}
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="text-muted-foreground">{invoice.id}</TableCell>
                <TableCell className="font-medium">
                  {clientNames.get(invoice.client_id) ?? "—"}
                </TableCell>
                <TableCell>{invoice.quote_id === null ? "—" : `#${invoice.quote_id}`}</TableCell>
                <TableCell>{formatDate(invoice.issued_on)}</TableCell>
                <TableCell>{formatDate(invoice.due_on)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCLP(invoice.amount_clp)}
                </TableCell>
                <TableCell className="pl-8">
                  {invoice.paid ? (
                    <Badge variant="outline">Sí</Badge>
                  ) : (
                    <Badge variant="secondary">No</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
