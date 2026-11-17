"use client";

import { Switches } from "@/components/Switches";
import { navActive } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { BookMarked, BookOpen, Bookmark, Columns2, Compass, House, Info, ScrollText, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mobileDock = [
  { href: "/", icon: House, key: "home" as const },
  { href: "/bible", icon: ScrollText, key: "bible" as const },
  { href: "/library", icon: BookOpen, key: "library" as const },
  { href: "/map", icon: Compass, key: "map" as const },
  { href: "/search", icon: Search, key: "search" as const },
  { href: "/saved", icon: Bookmark, key: "saved" as const },
];

const menu = [
  { href: "/bible", icon: ScrollText, key: "bible" as const },
  { href: "/library", icon: BookOpen, key: "library" as const },
  { href: "/map", icon: Compass, key: "map" as const },
  { href: "/glossary", icon: BookMarked, key: "glossary" as const },
  { href: "/about", icon: Info, key: "about" as const },
  { href: "/search", icon: Search, key: "search" as const },
  { href: "/compare", icon: Columns2, key: "compare" as const },
  { href: "/saved", icon: Bookmark, key: "saved" as const },
];

function NavWord({
  href,
  icon: Icon,
  label,
  active,
  className,
}: {
  href: string;
  icon: typeof House;
  label: string;
  active: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex h-14 shrink-0 items-center gap-2 px-2.5 text-[13px] leading-none tracking-normal hover:text-ink",
        active && "text-gold after:absolute after:inset-x-2.5 after:bottom-0 after:h-px after:bg-gold",
        className,
      )}
    >
      <Icon size={16} strokeWidth={1.5} />
      {label}
    </Link>
  );
}

export function AppDock() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 hidden border-b border-line bg-chrome backdrop-blur-md md:block">
        <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center px-8">
          <Link href="/" aria-label={t("home")} className="font-display w-fit text-[15px] tracking-[0.22em] text-gold">
            AEON
          </Link>
          <nav aria-label={t("menu")} className="flex items-center text-muted">
            {menu.map((item) => (
              <NavWord
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={t(item.key)}
                active={navActive(pathname, item.href)}
              />
            ))}
          </nav>
          <div className="flex justify-end">
            <Switches />
          </div>
        </div>
      </header>

      <header className="fixed top-0 right-0 left-0 z-40 flex h-12 items-center justify-between border-b border-line bg-chrome px-4 backdrop-blur-md md:hidden">
        <Link href="/" aria-label={t("home")} className="font-display text-[15px] tracking-[0.22em] text-gold">
          AEON
        </Link>
        <Switches />
      </header>

      <nav
        aria-label={t("menu")}
        className="fixed right-0 bottom-0 left-0 z-40 border-t border-line bg-chrome pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
      >
        <ul className="grid grid-cols-6">
          {mobileDock.map((item) => {
            const active = navActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex min-h-11 flex-col items-center justify-center gap-1 px-0.5 text-[11px] leading-none tracking-normal",
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
