"use client";

import { reopenCookieSettings } from "@/components/CookieBanner";
import { featuredNh } from "@/lib/nh";
import { navLinks } from "@/lib/nav";
import { gaMeasurementId } from "@/lib/site";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function SiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const featured = featuredNh();

  return (
    <footer className="border-t border-line px-6 pt-16 pb-28 text-sm text-muted md:pb-16">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-gold tracking-[0.28em]">AEON</p>
          <p className="mt-3 max-w-md leading-relaxed">{t("disclaimer")}</p>
          <p className="mt-4 leading-relaxed">{t("sources")}</p>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[12px] tracking-[0.12em] uppercase">
            <li>
              <Link href="/privacy" className="hover:text-gold">
                {t("privacy")}
              </Link>
            </li>
            {gaMeasurementId ? (
              <li>
                <button type="button" onClick={reopenCookieSettings} className="hover:text-gold">
                  {t("cookies")}
                </button>
              </li>
            ) : null}
            <li>
              <Link href="/about" className="hover:text-gold">
                {t("about")}
              </Link>
            </li>
          </ul>
        </div>
        <nav aria-label={nav("menu")}>
          <p className="text-[10px] tracking-[0.2em] text-gold uppercase">{t("corpus")}</p>
          <ul className="mt-3 space-y-2">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-gold">
                  {nav(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/" className="hover:text-gold">
                {nav("home")}
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <p className="text-[10px] tracking-[0.2em] text-gold uppercase">{t("collections")}</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/bible" className="hover:text-gold">
                Etiopijos Biblija
              </Link>
            </li>
            <li>
              <Link href="/library" className="hover:text-gold">
                Nag Hammadi
              </Link>
            </li>
          </ul>
          {featured.length ? (
            <ul className="mt-6 space-y-2">
              {featured.map((item) => (
                <li key={item.slug}>
                  <Link href={`/nh/${item.slug}`} className="hover:text-gold">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
