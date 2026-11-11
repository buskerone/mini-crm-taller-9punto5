import type { Invoice } from "./types";

export function cobrosPendientes(invoices: Invoice[]) {
  return invoices.filter((invoice) => !invoice.paid);
}

// Por cobrar = suma de amount_clp de los cobros con paid = false. No depende de ninguna fecha.
export function porCobrar(invoices: Invoice[]) {
  return cobrosPendientes(invoices).reduce((suma, invoice) => suma + invoice.amount_clp, 0);
}
