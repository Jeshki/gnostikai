export function DualText({
  lt,
  className,
  as: Tag = "p",
}: {
  lt?: string;
  en?: string;
  bilingual?: boolean;
  locale?: "lt" | "en";
  className?: string;
  as?: "p" | "h2" | "span";
}) {
  if (!lt) return null;
  return <Tag className={className}>{lt}</Tag>;
}
