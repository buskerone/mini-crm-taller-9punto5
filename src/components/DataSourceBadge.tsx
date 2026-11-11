import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import type { DataResult } from "@/lib/data";

const SOURCES = {
  local: { label: "Datos: local", dot: "/dot-local.svg" },
  supabase: { label: "Datos: Supabase", dot: "/dot-supabase.svg" },
} as const;

// El badge es la única señal de si los datos salen del archivo local o de Supabase.
export function DataSourceBadge({ source }: { source: DataResult["source"] }) {
  const { label, dot } = SOURCES[source];
  return (
    <Badge variant="outline" className="h-8 gap-2 rounded-full bg-background pr-3 pl-2.5">
      <Image src={dot} alt="" width={8} height={8} />
      {label}
    </Badge>
  );
}
