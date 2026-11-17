"use client";

import { thomasParallels } from "@/content/excerpts";
import type { Saying } from "@/lib/content";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Drawer } from "vaul";

export function SayingBlock({ saying }: { saying: Saying }) {
  const t = useTranslations("reader");
  const [open, setOpen] = useState(false);
  const note = thomasParallels[saying.n];
  const title = saying.titleLt;
  const text = saying.lt;

  const citeLabel = `Ev. Tomo ${saying.n}`;
  const cite = () => {
    void navigator.clipboard.writeText(`${citeLabel} · AEON`);
  };

  return (
    <article id={String(saying.n)} className="scroll-mt-24 py-6">
      <button type="button" onClick={() => setOpen(true)} className="w-full text-left">
        <div className="mb-3 flex items-baseline gap-3">
          <span className="font-display text-sm text-gold">{saying.n}</span>
          <span className="text-[11px] tracking-[0.14em] text-muted uppercase">{title}</span>
        </div>
        <p className="reader-text font-display whitespace-pre-wrap">{text}</p>
      </button>

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/55" />
          <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 border-t border-line bg-elevated px-6 pt-4 pb-10 md:right-auto md:bottom-8 md:left-1/2 md:w-[min(520px,92vw)] md:-translate-x-1/2 md:border md:pb-6">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted/40 md:hidden" />
            <Drawer.Title className="font-display text-xl text-gold">
              {saying.n} · {title}
            </Drawer.Title>
            <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
            {note ? (
              <div className="mt-5 border-t border-line pt-4">
                <p className="text-[11px] tracking-[0.16em] text-gold uppercase">{t("note")}</p>
                <p className="mt-2 text-sm text-ink">{note.noteLt ?? note.note}</p>
                <p className="mt-3 text-[11px] tracking-wide text-muted uppercase">
                  {t("parallels")}: {note.refs.join(" · ")}
                </p>
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted">{t("note")}.</p>
            )}
            <button
              type="button"
              onClick={cite}
              className="mt-6 text-[11px] tracking-[0.18em] text-gold uppercase"
            >
              {t("cite")} · {citeLabel} · AEON
            </button>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </article>
  );
}
