import { DataSourceBadge } from "@/components/DataSourceBadge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataResult } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { REFERENCE_DATE } from "@/lib/reference-date";

export function SiteHeader({ source }: { source?: DataResult["source"] }) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-18 w-full max-w-[1440px] items-center gap-4 px-6 lg:px-12">
        <div className="flex flex-1 items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-lg font-semibold text-primary-foreground">
            m
          </span>
          <span className="text-lg font-semibold">mini-CRM</span>
          <Separator
            orientation="vertical"
            className="hidden data-[orientation=vertical]:h-5 md:block"
          />
          <span className="hidden text-sm text-muted-foreground md:inline">
            Pyme de práctica · taller «Cursor a fondo»
          </span>
        </div>
        <span className="hidden text-sm text-muted-foreground sm:inline">
          Fecha de corte: {formatDate(REFERENCE_DATE)}
        </span>
        {source ? (
          <DataSourceBadge source={source} />
        ) : (
          <Skeleton className="h-8 w-32 rounded-full" />
        )}
      </div>
    </header>
  );
}
