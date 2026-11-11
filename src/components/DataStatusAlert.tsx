import { CircleAlertIcon, TriangleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type DataStatusAlertProps = { warning?: string; error: Error | null };

// El error de Supabase nunca se esconde: un fallback silencioso a lo local haría creer
// que el hito 1 funcionó.
export function DataStatusAlert({ warning, error }: DataStatusAlertProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>No se pudieron leer los datos de Supabase</AlertTitle>
        <AlertDescription>
          <p>{error.message}</p>
          <p>
            Revisa que aplicaste supabase/schema.sql y supabase/seed.sql en tu proyecto, y que el
            proyecto no esté pausado.
          </p>
        </AlertDescription>
      </Alert>
    );
  }
  if (warning) {
    return (
      <Alert>
        <TriangleAlertIcon />
        <AlertTitle>Revisa la configuración</AlertTitle>
        <AlertDescription>
          <p>{warning}.</p>
          <p>Completa .env.local y reinicia npm run dev (Ctrl+C y de nuevo).</p>
        </AlertDescription>
      </Alert>
    );
  }
  return null;
}
