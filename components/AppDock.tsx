"use client";

import { Switches } from "@/components/Switches";
import { navActive, navLinks } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { BookOpen, Bookmark, Compass, House, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const dock = [
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
        <nav aria-label={t("menu")} className="flex items-center gap-5 text-[13px] text-muted">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("hover:text-ink", navActive(pathname, item.href) && "text-gold")}
            >
              {t(item.key)}
            </Link>
          ))}
          <Link
            href="/"
            className={cn("hover:text-ink", pathname === "/" && "text-gold")}
          >
            {t("home")}
          </Link>
        </nav>
        <Switches />
      </header>

      <header className="fixed top-0 right-0 left-0 z-40 flex h-12 items-center justify-between border-b border-line bg-chrome px-4 backdrop-blur-md md:hidden">
        <Link href="/" className="font-display text-sm tracking-[0.28em] text-gold">
          AEON
        </Link>
        <Switches />
      </header>

      <nav
        aria-label={t("menu")}
        className="fixed right-0 bottom-0 left-0 z-40 border-t border-line bg-chrome pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
      >
        <ul className="grid grid-cols-5">
          {dock.map((item) => {
            const active = navActive(pathname, item.href);
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
