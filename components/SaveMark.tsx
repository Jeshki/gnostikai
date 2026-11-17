"use client";

import { isPlaceSaved, togglePlace, type SavedPlace } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";

export function SaveMark({ href, title, kicker }: SavedPlace) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(isPlaceSaved(href));
  }, [href]);

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setOn(togglePlace({ href, title, kicker }).places.some((item) => item.href === href))}
      className={cn(
        "mt-6 inline-flex min-h-11 items-center gap-2 text-sm hover:text-ink",
        on ? "text-gold" : "text-muted",
      )}
    >
      <Bookmark size={16} strokeWidth={1.5} fill={on ? "currentColor" : "none"} />
      {on ? "Išsaugota" : "Išsaugoti"}
    </button>
  );
}
