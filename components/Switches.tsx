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

  const dark = mounted ? (resolvedTheme ?? theme) !== "light" : true;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="group"
        aria-label={t("language")}
        className="flex items-center text-[11px] tracking-[0.18em]"
      >
        <button
          type="button"
          aria-pressed={locale === "lt" && !bilingual}
          onClick={() => setLocale("lt")}
          className={cn(
            "px-1.5 py-1 transition-colors",
            locale === "lt" && !bilingual ? "text-gold" : "text-muted hover:text-ink",
          )}
        >
          LT
        </button>
        <span aria-hidden className="text-muted/35">
          /
        </span>
        <button
          type="button"
          aria-pressed={locale === "en" && !bilingual}
          onClick={() => setLocale("en")}
          className={cn(
            "px-1.5 py-1 transition-colors",
            locale === "en" && !bilingual ? "text-gold" : "text-muted hover:text-ink",
          )}
        >
          EN
        </button>
        <span aria-hidden className="text-muted/35">
          /
        </span>
        <button
          type="button"
          aria-pressed={bilingual}
          aria-label={t("both")}
          onClick={() => setBilingual(!bilingual)}
          className={cn(
            "px-1.5 py-1 transition-colors",
            bilingual ? "text-gold" : "text-muted hover:text-ink",
          )}
        >
          LT+EN
        </button>
      </div>

      <button
        type="button"
        aria-label={dark ? t("light") : t("dark")}
        aria-pressed={!dark}
        onClick={() => setTheme(dark ? "light" : "dark")}
        className="grid size-8 place-items-center text-muted transition-colors hover:text-gold"
      >
        {dark ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
      </button>
    </div>
  );
}
