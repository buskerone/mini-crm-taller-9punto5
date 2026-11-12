// Misma forma en modo local y en Supabase: columnas en snake_case, fechas como string
// YYYY-MM-DD, montos en pesos enteros (number) y `paid` como boolean.
export type QuoteStatus = "enviada" | "aceptada" | "rechazada";

export type Client = { id: number; name: string; city: string; created_on: string };

export type Quote = {
  id: number;
  client_id: number;
  issued_on: string;
  amount_clp: number;
  status: QuoteStatus;
};

export type Invoice = {
  id: number;
  client_id: number;
  quote_id: number | null;
  issued_on: string;
  due_on: string;
  amount_clp: number;
  paid: boolean;
};

export type CrmData = { clients: Client[]; quotes: Quote[]; invoices: Invoice[] };
