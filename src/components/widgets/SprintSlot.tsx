import { EmbudoCard } from "@/features/embudo/EmbudoCard";
import type { CrmData } from "@/lib/types";

export function SprintSlot({ data }: { data: CrmData }) {
  return <EmbudoCard data={data} />;
}
