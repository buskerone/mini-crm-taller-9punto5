import { TableEmptyRow } from "@/components/TableEmptyRow";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { formatDate } from "@/lib/format";
import type { Client } from "@/lib/types";

type ClientsTableProps = { clients: Client[]; className?: string };

export function ClientsTable({ clients, className }: ClientsTableProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
        <CardDescription>clients · ClientsTable.tsx</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>Alta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 && <TableEmptyRow colSpan={4} />}
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="text-muted-foreground">{client.id}</TableCell>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.city}</TableCell>
                <TableCell>{formatDate(client.created_on)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="mt-auto text-sm text-muted-foreground">
        Mismas filas en modo local y en Supabase: solo cambia el badge de fuente.
      </CardFooter>
    </Card>
  );
}
