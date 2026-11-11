import { EmptySlot } from "@/components/EmptySlot";
import type { CrmData } from "@/lib/types";

// Reemplaza el EmptySlot por tu tarjeta de src/features/<widget>/ y pásale `data`.
export function SprintSlot({ data }: { data: CrmData }) {
  return (
    <EmptySlot
      title="Sprint"
      description="Espacio del sprint: elige una tarjeta."
      file="SprintSlot.tsx · tarjeta A, B, C o D"
    />
  );
}
