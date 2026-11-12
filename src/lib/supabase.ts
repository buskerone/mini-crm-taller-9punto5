import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Solo la anon (o publishable) key: es pública y respeta RLS. Nunca la service_role.
// La app no tiene login, así que no guarda sesión en el navegador.
export const supabase =
  url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : null;
