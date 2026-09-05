"use client";

import { useLocale } from "@/components/providers";
import { collections, corpus } from "@/lib/corpus";
import type { CollectionId } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const order: CollectionId[] = [
  "nag-hammadi",
  "berlin-codex",
  "nt-apocrypha",
  "askew-bruce",
  "patristic",
  "fragments",
];

export function CodexTree({ activeSlug }: { activeSlug?: string }) {
  const { locale } = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={locale === "lt" ? "Korpusas" : "Corpus"} className="text-sm">
      {order.map((id) => {
        const meta = collections[id];
        const items = corpus.filter((item) => item.collection === id);
        return (
          <div key={id} className="mb-8">
            <Link
              href={`/library/${id}`}
              className={cn(
                "mb-3 block text-[10px] tracking-[0.2em] uppercase",
                pathname.includes(id) ? "text-gold" : "text-muted hover:text-ink",
              )}
            >
              {locale === "lt" ? meta.titleLt : meta.titleEn}
            </Link>
            <ul className="space-y-1.5 border-l border-line pl-3">
              {items.map((item) => {
                const active = activeSlug === item.slug;
                return (
                  <li key={item.slug}>
                    <Link
                      href={`/text/${item.slug}`}
                      className={cn(
                        "block leading-snug hover:text-gold",
                        active ? "text-gold" : "text-ink/80",
                      )}
                    >
                      {locale === "lt" ? item.titleLt : item.titleEn}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
