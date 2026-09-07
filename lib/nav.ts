export const navLinks = [
  { href: "/library", key: "library" as const },
  { href: "/map", key: "map" as const },
  { href: "/timeline", key: "timeline" as const },
  { href: "/glossary", key: "glossary" as const },
  { href: "/about", key: "about" as const },
  { href: "/compare", key: "compare" as const },
  { href: "/search", key: "search" as const },
  { href: "/saved", key: "saved" as const },
] as const;

export function navActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
