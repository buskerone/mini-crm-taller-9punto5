import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export function TablesEmptyState() {
  return (
    <Empty className="min-h-72 border border-ring bg-background">
      <EmptyHeader>
        <EmptyTitle className="text-base font-semibold tracking-normal">
          Aquí van tus tablas: clientes, cotizaciones y cobros
        </EmptyTitle>
        <EmptyDescription>
          Pídele al agente la de clientes y, cuando funcione, repite el mismo patrón en las otras
          dos.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
