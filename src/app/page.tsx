"use client";

import type { ReactNode } from "react";

import { DataStatusAlert } from "@/components/DataStatusAlert";
import { SiteHeader } from "@/components/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PorCobrarSlot } from "@/components/widgets/PorCobrarSlot";
import { SprintSlot } from "@/components/widgets/SprintSlot";
import { useCrmData } from "@/hooks/useCrmData";
import { formatCLP, formatDate } from "@/lib/format";
import type { Client, Invoice, Quote } from "@/lib/types";

export default function Page() {
  const { data: result, error, isPending } = useCrmData();
  // Solo el modo Supabase puede fallar: el JSON local no usa la red.
  const source = result?.source ?? (error ? "supabase" : undefined);

  return (
    <SidebarProvider>
      <SiteHeader source={source} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4 lg:px-6">
          <SidebarTrigger />
        </header>
        <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 pt-10 pb-16 lg:px-12">
          <DataStatusAlert warning={result?.warning} error={error} />

          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-semibold tracking-tight">Panel</h1>
            <p className="text-muted-foreground">
              Clientes, cotizaciones y cobros leídos con getData(), y los espacios para tus widgets.
            </p>
          </div>

          <Section
            title="Widgets"
            description="Hito 2: «Por cobrar». Sprint: cada persona construye una de las cuatro tarjetas en SprintSlot."
          >
            {result ? (
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="min-w-0 lg:col-span-4">
                  <PorCobrarSlot data={result.data} />
                </div>
                <div className="min-w-0 lg:col-span-8">
                  <SprintSlot data={result.data} />
                </div>
              </div>
            ) : (
              isPending && <Skeleton className="h-70 rounded-xl" />
            )}
          </Section>

          <Section
            title="Datos"
            description="Tablas de clientes, cotizaciones y cobros."
          >
            {isPending ? (
              <Skeleton className="h-72 rounded-xl" />
            ) : (
              result && (
                <div className="flex flex-col gap-6">
                  <ClientsTable clients={result.data.clients} />
                  <QuotesTable clients={result.data.clients} quotes={result.data.quotes} />
                  <InvoicesTable clients={result.data.clients} invoices={result.data.invoices} />
                </div>
              )
            )}
          </Section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ClientsTable({ clients }: { clients: Client[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>Alta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Emisión</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell>{quote.id}</TableCell>
                <TableCell className="font-medium">{clientName(quote.client_id)}</TableCell>
                <TableCell>{formatDate(quote.issued_on)}</TableCell>
                <TableCell>{formatCLP(quote.amount_clp)}</TableCell>
                <TableCell>{quote.status}</TableCell>
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Cotización</TableHead>
              <TableHead>Emisión</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Pagado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell className="font-medium">{clientName(invoice.client_id)}</TableCell>
                <TableCell>{invoice.quote_id === null ? "—" : `#${invoice.quote_id}`}</TableCell>
                <TableCell>{formatDate(invoice.issued_on)}</TableCell>
                <TableCell>{formatDate(invoice.due_on)}</TableCell>
                <TableCell>{formatCLP(invoice.amount_clp)}</TableCell>
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
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
