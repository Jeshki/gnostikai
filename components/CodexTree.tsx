"use client";

import { nhByCodex } from "@/lib/nh";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CodexTree({ activeSlug }: { activeSlug?: string }) {
  const pathname = usePathname();
  const groups = nhByCodex();

  return (
    <nav aria-label="Nag Hammadi" className="text-sm">
      {groups.map((group) => (
        <div key={`${group.codex}-${group.works[0]?.slug}`} className="mb-8">
          <Link
            href={`/library#${encodeURIComponent(group.codex)}`}
            className={cn(
              "mb-3 block text-[10px] tracking-[0.2em] uppercase",
              pathname.includes("/library") ? "text-gold" : "text-muted hover:text-ink",
            )}
          >
            {group.codex}
          </Link>
          <ul className="space-y-1.5 border-l border-line pl-3">
            {group.works.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/nh/${item.slug}`}
                  className={cn(
                    "block leading-snug hover:text-gold",
                    activeSlug === item.slug ? "text-gold" : "text-ink/80",
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
