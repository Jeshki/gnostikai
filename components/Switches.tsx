"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function Switches({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const t = useTranslations("switches");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dark = mounted ? (resolvedTheme ?? theme) !== "light" : true;

  return (
    <div className={cn("flex items-center gap-3", className)}>
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
