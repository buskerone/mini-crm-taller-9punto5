import local from "@/data/crm.json";

import { supabase } from "./supabase";
import type { CrmData } from "./types";

export type DataResult = { source: "local" | "supabase"; data: CrmData; warning?: string };

export async function getData(): Promise<DataResult> {
  const wanted = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "local";
  if (wanted !== "supabase") return { source: "local", data: local as CrmData };
  if (!supabase) {
    return {
      source: "local",
      data: local as CrmData,
      warning:
        "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY: usando datos locales",
    };
  }
  const [c, q, i] = await Promise.all([
    supabase.from("clients").select("*").order("id"),
    supabase.from("quotes").select("*").order("id"),
    supabase.from("invoices").select("*").order("id"),
  ]);
  const error = c.error ?? q.error ?? i.error;
  if (error) throw new Error(`Supabase: ${error.code ?? ""} ${error.message}`);
  return { source: "supabase", data: { clients: c.data!, quotes: q.data!, invoices: i.data! } };
}
