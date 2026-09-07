import { cn } from "@/lib/utils";
import type { Crumb } from "@/lib/seo";
import Link from "next/link";

export function Breadcrumbs({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  if (crumbs.length === 0) return null;
  return (
    <nav aria-label="Navigacijos kelias" className={cn("text-[11px] tracking-[0.12em] text-muted uppercase", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden className="text-line">/</span> : null}
              {last ? (
                <span className="text-ink">{crumb.name}</span>
              ) : (
                <Link href={crumb.path} className="hover:text-gold">
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
