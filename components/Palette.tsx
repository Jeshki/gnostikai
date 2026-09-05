"use client";

import { useLocale } from "@/components/providers";
import { about } from "@/content/about";
import { thomas } from "@/lib/content";
import { corpus } from "@/lib/corpus";
import { glossary } from "@/lib/glossary";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function Palette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { locale } = useLocale();
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
          <Command.Group heading={t("texts")} className="text-[10px] tracking-[0.18em] text-muted uppercase">
            {corpus.map((item) => (
              <Command.Item
                key={item.slug}
                value={`${item.titleEn} ${item.titleLt} ${item.slug}`}
                onSelect={() => go(`/text/${item.slug}`)}
                className="cursor-pointer px-3 py-2 text-sm text-ink data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold"
              >
                {locale === "lt" ? item.titleLt : item.titleEn}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading={t("thomas")} className="text-[10px] tracking-[0.18em] text-muted uppercase">
            {thomas.sayings.map((saying) => (
              <Command.Item
                key={saying.n}
                value={`thomas tomas ${saying.n} ${saying.title} ${saying.titleLt} ${saying.en} ${saying.lt}`}
                onSelect={() => go(`/text/thomas#${saying.n}`)}
                className="cursor-pointer px-3 py-2 text-sm text-ink data-[selected=true]:bg-gold/10 data-[selected=true]:text-gold"
              >
                {saying.n} · {locale === "lt" ? saying.titleLt : saying.title}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading={t("about")} className="text-[10px] tracking-[0.18em] text-muted uppercase">
            {about[locale].sections.map((section) => (
              <Command.Item
                key={section.id}
                value={`about apie ${section.title} ${about.lt.sections.find((item) => item.id === section.id)?.title ?? ""} ${about.en.sections.find((item) => item.id === section.id)?.title ?? ""}`}
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
                value={`${term.term} ${term.defEn} ${term.defLt}`}
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
