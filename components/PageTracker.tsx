"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@vercel/analytics";

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] === "text" && parts[1]) {
      track("read_text", { slug: parts[1], chapter: parts[2] ?? "full" });
    } else if (parts[0] === "library" && parts[1]) {
      track("browse_collection", { id: parts[1] });
    } else if (parts[0] === "search") {
      track("open_search");
    }
  }, [pathname]);

  return null;
}
