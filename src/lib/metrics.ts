import { REFERENCE_DATE } from "./reference-date";
import type { Client, Invoice, Quote, QuoteStatus } from "./types";

export function cobrosPendientes(invoices: Invoice[]) {
  return invoices.filter((invoice) => !invoice.paid);
}

// Por cobrar = suma de amount_clp de los cobros con paid = false. No depende de ninguna fecha.
export function porCobrar(invoices: Invoice[]) {
  return cobrosPendientes(invoices).reduce((suma, invoice) => suma + invoice.amount_clp, 0);
}

const ESTADOS: QuoteStatus[] = ["aceptada", "enviada", "rechazada"];

// Embudo: cantidad y monto por estado. Tasa de aceptación = aceptadas ÷ total de cotizaciones,
// por cantidad (no por monto) y contando también las enviadas.
export function embudo(quotes: Quote[]) {
  const porEstado = ESTADOS.map((status) => {
    const delEstado = quotes.filter((quote) => quote.status === status);
    return {
      status,
      cantidad: delEstado.length,
      monto: delEstado.reduce((suma, quote) => suma + quote.amount_clp, 0),
    };
  });
  const aceptadas = quotes.filter((quote) => quote.status === "aceptada").length;
  const tasaAceptacion = quotes.length === 0 ? 0 : aceptadas / quotes.length;
  return { porEstado, tasaAceptacion };
}

export function iniciales(name: string) {
  const partes = name
    .split(/\s+/)
    .filter((p) => !["El", "La", "Los", "Las", "De", "Del", "Y"].includes(p));
  if (partes.length >= 2) return `${partes[0]![0] ?? ""}${partes[1]![0] ?? ""}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// Cliente más valioso = mayor suma de cobros con paid = true.
export function clienteMasValioso(clients: Client[], invoices: Invoice[], top = 2) {
  const porCliente = new Map<number, number>();
  for (const invoice of invoices) {
    if (!invoice.paid) continue;
    porCliente.set(invoice.client_id, (porCliente.get(invoice.client_id) ?? 0) + invoice.amount_clp);
  }
  const nombres = new Map(clients.map((client) => [client.id, client.name]));
  return [...porCliente.entries()]
    .map(([clientId, monto]) => ({
      clientId,
      name: nombres.get(clientId) ?? "—",
      initials: iniciales(nombres.get(clientId) ?? "?"),
      monto,
    }))
    .sort((a, b) => b.monto - a.monto || a.name.localeCompare(b.name, "es"))
    .slice(0, top);
}

// Cobros vencidos: no pagados con due_on < REFERENCE_DATE (comparación de strings ISO).
export function cobrosVencidos(clients: Client[], invoices: Invoice[]) {
  const nombres = new Map(clients.map((client) => [client.id, client.name]));
  const vencidos = invoices
    .filter((invoice) => !invoice.paid && invoice.due_on < REFERENCE_DATE)
    .map((invoice) => ({
      id: invoice.id,
      name: nombres.get(invoice.client_id) ?? "—",
      due_on: invoice.due_on,
      amount_clp: invoice.amount_clp,
    }))
    .sort((a, b) => a.due_on.localeCompare(b.due_on) || a.id - b.id);
  const total = vencidos.reduce((suma, item) => suma + item.amount_clp, 0);
  return { total, cantidad: vencidos.length, items: vencidos };
}

const MESES: Record<string, { corto: string; largo: string }> = {
  "01": { corto: "ene", largo: "Enero" },
  "02": { corto: "feb", largo: "Febrero" },
  "03": { corto: "mar", largo: "Marzo" },
  "04": { corto: "abr", largo: "Abril" },
  "05": { corto: "may", largo: "Mayo" },
  "06": { corto: "jun", largo: "Junio" },
  "07": { corto: "jul", largo: "Julio" },
  "08": { corto: "ago", largo: "Agosto" },
  "09": { corto: "sep", largo: "Septiembre" },
  "10": { corto: "oct", largo: "Octubre" },
  "11": { corto: "nov", largo: "Noviembre" },
  "12": { corto: "dic", largo: "Diciembre" },
};

// Resumen mensual: facturado = suma por issued_on; cobrado = suma de paid por issued_on.
export function resumenMensual(invoices: Invoice[]) {
  const porMes = new Map<string, { facturado: number; cobrado: number }>();
  for (const invoice of invoices) {
    const mes = invoice.issued_on.slice(0, 7);
    const actual = porMes.get(mes) ?? { facturado: 0, cobrado: 0 };
    actual.facturado += invoice.amount_clp;
    if (invoice.paid) actual.cobrado += invoice.amount_clp;
    porMes.set(mes, actual);
  }
  return [...porMes.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, valores]) => {
      const mm = mes.slice(5, 7);
      const label = MESES[mm] ?? { corto: mm, largo: mes };
      return { mes, corto: label.corto, largo: label.largo, ...valores };
    });
}
