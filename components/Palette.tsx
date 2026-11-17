"use client";

import { about } from "@/content/about";
import { bibleCatalog } from "@/lib/bible";
import { glossary } from "@/lib/glossary";
import { nhCatalog } from "@/lib/nh";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function Palette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("search");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 pt-[18vh]">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={t("close")}
        onClick={() => setOpen(false)}
      />
      <Command
        label={t("placeholder")}
        className="relative w-full max-w-xl border border-line bg-elevated shadow-2xl"
      >
        <Command.Input
          autoFocus
          placeholder={t("placeholder")}
          className="w-full border-b border-line bg-transparent px-4 py-4 text-ink outline-none placeholder:text-muted"
        />
        <Command.List className="max-h-[50vh] overflow-auto p-2">
          <Command.Empty className="px-3 py-8 text-center text-sm text-muted">
            —
          </Command.Empty>
          <Command.Group heading="Biblija" className="text-[10px] tracking-[0.18em] text-muted uppercase">
            {bibleCatalog.map((item) => (
              <Command.Item
                key={item.slug}
                value={`${item.titleLt} ${item.abbrLt} ${item.slug}`}
                onSelect={() => go(`/bible/${item.slug}`)}
                className="cursor-pointer px-3 py-2 text-sm text-ink data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold"
              >
                {item.titleLt}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading={t("texts")} className="text-[10px] tracking-[0.18em] text-muted uppercase">
            {nhCatalog.map((item) => (
              <Command.Item
                key={item.slug}
                value={`${item.title} ${item.codex} ${item.slug}`}
                onSelect={() => go(`/nh/${item.slug}`)}
                className="cursor-pointer px-3 py-2 text-sm text-ink data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold"
              >
                {item.title}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading={t("about")} className="text-[10px] tracking-[0.18em] text-muted uppercase">
            {about.lt.sections.map((section) => (
              <Command.Item
                key={section.id}
                value={`apie ${section.title}`}
                onSelect={() => go(`/about#${section.id}`)}
                className="cursor-pointer px-3 py-2 text-sm text-ink data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold"
              >
                {section.title}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading={t("glossary")} className="text-[10px] tracking-[0.18em] text-muted uppercase">
            {glossary.map((term) => (
              <Command.Item
                key={term.slug}
                value={`${term.term} ${term.defLt}`}
                onSelect={() => go(`/glossary#${term.slug}`)}
                className="cursor-pointer px-3 py-2 text-sm text-ink data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold"
              >
                {term.term}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
