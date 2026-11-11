import { EmptySlot } from "@/components/EmptySlot";
import type { CrmData } from "@/lib/types";

// Reemplaza el EmptySlot por tu tarjeta de src/features/<widget>/ y pásale `data`.
export function PorCobrarSlot({ data }: { data: CrmData }) {
  return (
    <EmptySlot
      title="Por cobrar"
      description="Aquí va tu widget «Por cobrar»."
      file="PorCobrarSlot.tsx · hito 2"
    />
  );
}
