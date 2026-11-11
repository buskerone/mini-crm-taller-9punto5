import { PorCobrarCard } from "@/features/por-cobrar/PorCobrarCard";
import type { CrmData } from "@/lib/types";

export function PorCobrarSlot({ data }: { data: CrmData }) {
  return <PorCobrarCard data={data} />;
}
