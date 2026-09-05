"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-line px-6 pt-16 pb-28 text-sm text-muted md:pb-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-gold tracking-[0.28em]">AEON</p>
          <p className="mt-3 max-w-md leading-relaxed">{t("disclaimer")}</p>
        </div>
        <div className="max-w-sm leading-relaxed">
          <p>{t("sources")}</p>
          <div className="mt-4 flex gap-4 text-[11px] tracking-[0.16em] uppercase">
            <Link href="/about" className="hover:text-gold">
              {t("about")}
            </Link>
            <Link href="/library" className="hover:text-gold">
              {t("corpus")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
