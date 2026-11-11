"use client";

import type { ReactNode } from "react";

import { DataStatusAlert } from "@/components/DataStatusAlert";
import { SiteHeader } from "@/components/SiteHeader";
import { TablesEmptyState } from "@/components/TablesEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { PorCobrarSlot } from "@/components/widgets/PorCobrarSlot";
import { SprintSlot } from "@/components/widgets/SprintSlot";
import { useCrmData } from "@/hooks/useCrmData";

export default function Page() {
  const { data: result, error, isPending } = useCrmData();
  // Solo el modo Supabase puede fallar: el JSON local no usa la red.
  const source = result?.source ?? (error ? "supabase" : undefined);

  return (
    <>
      <SiteHeader source={source} />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 pt-10 pb-16 lg:px-12">
        <DataStatusAlert warning={result?.warning} error={error} />

        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-semibold tracking-tight">Panel</h1>
          <p className="text-muted-foreground">
            Conecta los datos y pídele al agente las tablas. Los widgets van en los espacios de
            abajo.
          </p>
        </div>

        <Section
          title="Widgets"
          description="Hito 2: «Por cobrar». Sprint: cada persona construye una de las cuatro tarjetas en SprintSlot."
        >
          {result ? (
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="min-w-0 lg:col-span-4">
                <PorCobrarSlot data={result.data} />
              </div>
              <div className="min-w-0 lg:col-span-8">
                <SprintSlot data={result.data} />
              </div>
            </div>
          ) : (
            isPending && <Skeleton className="h-70 rounded-xl" />
          )}
        </Section>

        <Section title="Datos" description="El espacio para las tres tablas. Todavía no están.">
          {isPending ? <Skeleton className="h-72 rounded-xl" /> : <TablesEmptyState />}
        </Section>
      </main>
    </>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
