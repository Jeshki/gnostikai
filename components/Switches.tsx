"use client";

import { useLocale } from "@/components/providers";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function Switches({ className }: { className?: string }) {
  const { locale, setLocale, bilingual, setBilingual } = useLocale();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const t = useTranslations("switches");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const mode = mounted ? (resolvedTheme ?? theme ?? "dark") : "dark";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        role="group"
        aria-label={t("language")}
        className="flex h-9 overflow-hidden border border-line"
      >
        <button
          type="button"
          onClick={() => setLocale("lt")}
          className={cn(
            "min-w-9 px-2.5 text-[11px] tracking-[0.16em]",
            locale === "lt" && !bilingual ? "bg-gold/15 text-gold" : "text-muted hover:text-ink",
          )}
        >
          LT
        </button>
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={cn(
            "min-w-9 border-l border-line px-2.5 text-[11px] tracking-[0.16em]",
            locale === "en" && !bilingual ? "bg-gold/15 text-gold" : "text-muted hover:text-ink",
          )}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setBilingual(true)}
          aria-label={t("both")}
          className={cn(
            "min-w-9 border-l border-line px-2 text-[10px] tracking-[0.12em]",
            bilingual ? "bg-gold/15 text-gold" : "text-muted hover:text-ink",
          )}
        >
          LT+EN
        </button>
      </div>

      <div
        role="group"
        aria-label={t("appearance")}
        className="flex h-9 overflow-hidden border border-line"
      >
        <button
          type="button"
          onClick={() => setTheme("dark")}
          aria-label={t("dark")}
          className={cn(
            "grid min-w-9 place-items-center",
            mode === "dark" ? "bg-gold/15 text-gold" : "text-muted hover:text-ink",
          )}
        >
          <Moon size={14} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => setTheme("light")}
          aria-label={t("light")}
          className={cn(
            "grid min-w-9 place-items-center border-l border-line",
            mode === "light" ? "bg-gold/15 text-gold" : "text-muted hover:text-ink",
          )}
        >
          <Sun size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
