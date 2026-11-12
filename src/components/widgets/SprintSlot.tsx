import { ClienteMasValiosoCard } from "@/features/cliente-mas-valioso/ClienteMasValiosoCard";
import { CobrosVencidosCard } from "@/features/cobros-vencidos/CobrosVencidosCard";
import { EmbudoCard } from "@/features/embudo/EmbudoCard";
import { ResumenMensualCard } from "@/features/resumen-mensual/ResumenMensualCard";
import type { CrmData } from "@/lib/types";

// Las cuatro tarjetas del sprint se montan en page.tsx junto a Por cobrar (grilla del Figma).
// Este slot queda disponible si se quiere una sola tarjeta.
export function SprintSlot({ data }: { data: CrmData }) {
  return <EmbudoCard data={data} />;
}

export function SprintWidgets({ data }: { data: CrmData }) {
  return (
    <>
      <EmbudoCard data={data} />
      <ClienteMasValiosoCard data={data} />
      <CobrosVencidosCard data={data} />
      <div className="lg:col-span-2">
        <ResumenMensualCard data={data} />
      </div>
    </>
  );
}
