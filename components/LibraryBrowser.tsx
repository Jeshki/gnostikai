"use client";

import { TextCard } from "@/components/TextCard";
import { useLocale } from "@/components/providers";
import { collections, corpus, themeLabels } from "@/lib/corpus";
import type { CollectionId, Completeness, ThemeTag } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export function LibraryBrowser({ initialCollection }: { initialCollection?: CollectionId }) {
  const t = useTranslations("library");
  const { locale } = useLocale();
  const [collection, setCollection] = useState<CollectionId | "all">(initialCollection ?? "all");
  const [theme, setTheme] = useState<ThemeTag | "all">("all");
  const [fullOnly, setFullOnly] = useState(false);
  const [length, setLength] = useState<Completeness | "all">("all");

  const items = useMemo(() => {
    return corpus.filter((item) => {
      if (collection !== "all" && item.collection !== collection) return false;
      if (theme !== "all" && !item.tags.includes(theme)) return false;
      if (fullOnly && item.completeness !== "full") return false;
      if (length !== "all" && item.completeness !== length) return false;
      return true;
    });
  }, [collection, theme, fullOnly, length]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2">
        <FilterChip
          active={collection === "all"}
          onClick={() => setCollection("all")}
          label={t("all")}
        />
        {(Object.keys(collections) as CollectionId[]).map((id) => (
          <FilterChip
            key={id}
            active={collection === id}
            onClick={() => setCollection(id)}
            label={locale === "lt" ? collections[id].titleLt : collections[id].titleEn}
          />
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip active={theme === "all"} onClick={() => setTheme("all")} label={t("theme")} />
        {(Object.keys(themeLabels) as ThemeTag[]).map((tag) => (
          <FilterChip
            key={tag}
            active={theme === tag}
            onClick={() => setTheme(tag)}
            label={locale === "lt" ? themeLabels[tag].lt : themeLabels[tag].en}
          />
        ))}
      </div>

      <div className="mb-12 flex flex-wrap gap-2">
        <FilterChip
          active={length === "all"}
          onClick={() => setLength("all")}
          label={t("length")}
        />
        {(["full", "excerpt", "stub"] as const).map((value) => (
          <FilterChip
            key={value}
            active={length === value}
            onClick={() => setLength(value)}
            label={t(value === "full" ? "complete" : value)}
          />
        ))}
        <FilterChip active={fullOnly} onClick={() => setFullOnly((v) => !v)} label={t("full")} />
      </div>

      {items.length === 0 ? (
        <p className="font-display max-w-md py-24 text-2xl text-muted">{t("empty")}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <TextCard key={item.slug} text={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-11 border border-line px-3 text-[11px] tracking-[0.16em] uppercase",
        active && "border-gold/50 text-gold",
      )}
    >
      {label}
    </button>
  );
}
