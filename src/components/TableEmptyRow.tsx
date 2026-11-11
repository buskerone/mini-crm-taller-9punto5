import { TableCell, TableRow } from "@/components/ui/table";

// En modo Supabase, RLS activo sin policy de lectura responde [] sin error: tablas vacías.
export function TableEmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="py-8 text-center whitespace-normal text-muted-foreground"
      >
        Sin filas. En modo Supabase, revisa que aplicaste supabase/schema.sql y supabase/seed.sql.
      </TableCell>
    </TableRow>
  );
}
