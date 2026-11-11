import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

type EmptySlotProps = { title: string; description: string; file: string };

export function EmptySlot({ title, description, file }: EmptySlotProps) {
  return (
    <Empty className="h-full min-h-70 border-[1.5px] border-ring bg-background md:p-6">
      <EmptyHeader className="gap-1.5">
        <EmptyTitle className="text-base font-semibold tracking-normal">{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
        <p className="text-[13px] text-muted-foreground">{file}</p>
      </EmptyHeader>
    </Empty>
  );
}
