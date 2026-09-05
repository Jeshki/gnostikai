import { cn } from "@/lib/utils";

export function DualText({
  lt,
  en,
  bilingual,
  locale,
  className,
  as: Tag = "p",
}: {
  lt?: string;
  en?: string;
  bilingual: boolean;
  locale: "lt" | "en";
  className?: string;
  as?: "p" | "h2" | "span";
}) {
  const primary = locale === "lt" ? lt : en;
  if (!bilingual) {
    if (!primary) return null;
    return <Tag className={className}>{primary}</Tag>;
  }
  if (!lt && !en) return null;
  return (
    <div className="space-y-4">
      {lt ? <Tag className={className}>{lt}</Tag> : null}
      {en && en !== lt ? (
        <Tag className={cn(className, "text-muted")}>{en}</Tag>
      ) : null}
    </div>
  );
}
