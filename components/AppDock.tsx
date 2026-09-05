"use client";

import { Switches } from "@/components/Switches";
import { cn } from "@/lib/utils";
import { BookOpen, Bookmark, Compass, House, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", icon: House, key: "home" as const },
  { href: "/library", icon: BookOpen, key: "library" as const },
  { href: "/map", icon: Compass, key: "map" as const },
  { href: "/search", icon: Search, key: "search" as const },
  { href: "/saved", icon: Bookmark, key: "saved" as const },
];

export function AppDock() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 hidden border-b border-line bg-chrome px-6 backdrop-blur-md md:flex md:h-14 md:items-center md:justify-between">
        <Link href="/" className="font-display text-sm tracking-[0.28em] text-gold">
          AEON
        </Link>
        <nav className="flex items-center gap-6 text-[13px] text-muted">
          <Link href="/library" className="hover:text-ink">
            {t("library")}
          </Link>
          <Link href="/map" className="hover:text-ink">
            {t("map")}
          </Link>
          <Link href="/timeline" className="hover:text-ink">
            {t("timeline")}
          </Link>
          <Link href="/glossary" className="hover:text-ink">
            {t("glossary")}
          </Link>
          <Link href="/about" className="hover:text-ink">
            {t("about")}
          </Link>
          <Link href="/compare" className="hover:text-ink">
            {t("compare")}
          </Link>
        </nav>
        <Switches />
      </header>

      <div className="fixed top-3 right-3 z-40 md:hidden">
        <Switches />
      </div>

      <nav className="fixed right-0 bottom-0 left-0 z-40 border-t border-line bg-chrome pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-5">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex min-h-11 flex-col items-center justify-center gap-1 text-[10px] tracking-wide",
                    active ? "text-gold" : "text-muted",
                  )}
                >
                  <Icon size={18} strokeWidth={1.4} />
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
