import type { Invoice, Quote, QuoteStatus } from "./types";

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
