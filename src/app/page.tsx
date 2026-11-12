"use client";

import type { ReactNode } from "react";

import { DataStatusAlert } from "@/components/DataStatusAlert";
import { SiteHeader } from "@/components/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PorCobrarCard } from "@/features/por-cobrar/PorCobrarCard";
import { SprintWidgets } from "@/components/widgets/SprintSlot";
import { useCrmData } from "@/hooks/useCrmData";
import { formatCLP, formatDate } from "@/lib/format";
import type { Client, Invoice, Quote, QuoteStatus } from "@/lib/types";

const QUOTE_BADGE: Record<QuoteStatus, "default" | "secondary" | "destructive"> = {
  aceptada: "default",
  enviada: "secondary",
  rechazada: "destructive",
};

export default function Page() {
  const { data: result, error, isPending } = useCrmData();
  // Solo el modo Supabase puede fallar: el JSON local no usa la red.
  const source = result?.source ?? (error ? "supabase" : undefined);

  return (
    <>
      <SiteHeader source={source} />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 pt-10 pb-16 lg:px-12">
        <DataStatusAlert warning={result?.warning} error={error} />

        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-semibold tracking-tight">Panel</h1>
          <p className="text-muted-foreground">
            Estado final: «Por cobrar» y las cuatro tarjetas del sprint resueltas. Las tablas no
            cambian.
          </p>
        </div>

        <Section
          title="Widgets"
          description="Hito 2: «Por cobrar». Sprint: cada persona construye una de las cuatro tarjetas en SprintSlot."
          action={<Badge variant="outline">estado final</Badge>}
        >
          {result ? (
            <div className="grid min-w-0 gap-6 lg:grid-cols-3">
              <PorCobrarCard data={result.data} />
              <SprintWidgets data={result.data} />
            </div>
          ) : (
            isPending && <Skeleton className="h-70 rounded-xl" />
          )}
        </Section>

        <Section
          title="Datos"
          description="Filas crudas desde getData(): src/data/crm.json o Supabase. Sin totales ni cálculos."
        >
          {isPending ? (
            <Skeleton className="h-72 rounded-xl" />
          ) : (
            result && (
              <div className="flex flex-col gap-6">
                <div className="grid gap-6 lg:grid-cols-12">
                  <div className="min-w-0 lg:col-span-5">
                    <ClientsTable clients={result.data.clients} />
                  </div>
                  <div className="min-w-0 lg:col-span-7">
                    <QuotesTable clients={result.data.clients} quotes={result.data.quotes} />
                  </div>
                </div>
                <InvoicesTable clients={result.data.clients} invoices={result.data.invoices} />
              </div>
            )
          )}
        </Section>
      </main>
    </>
  );
}

function ClientsTable({ clients }: { clients: Client[] }) {
  return (
    <Card>
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
    </Card>
  );
}

function QuotesTable({ clients, quotes }: { clients: Client[]; quotes: Quote[] }) {
  const clientName = (clientId: number) =>
    clients.find((client) => client.id === clientId)?.name ?? "—";

  return (
    <Card>
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
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="text-muted-foreground">{quote.id}</TableCell>
                <TableCell className="font-medium">{clientName(quote.client_id)}</TableCell>
                <TableCell>{formatDate(quote.issued_on)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCLP(quote.amount_clp)}
                </TableCell>
                <TableCell>
                  <Badge variant={QUOTE_BADGE[quote.status]}>{quote.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function InvoicesTable({ clients, invoices }: { clients: Client[]; invoices: Invoice[] }) {
  const clientName = (clientId: number) =>
    clients.find((client) => client.id === clientId)?.name ?? "—";

  return (
    <Card>
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
              <TableHead>Pagado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="text-muted-foreground">{invoice.id}</TableCell>
                <TableCell className="font-medium">{clientName(invoice.client_id)}</TableCell>
                <TableCell>{invoice.quote_id === null ? "—" : `#${invoice.quote_id}`}</TableCell>
                <TableCell>{formatDate(invoice.issued_on)}</TableCell>
                <TableCell>{formatDate(invoice.due_on)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCLP(invoice.amount_clp)}
                </TableCell>
                <TableCell>
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

function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
