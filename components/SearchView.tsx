"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import { flexPattern } from "@/lib/fold";
import { pageCrumbs } from "@/lib/seo";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SearchHit = {
  kind: "book" | "verse" | "text" | "term" | "about";
  title: string;
  kicker: string;
  snippet: string;
  href: string;
};

function Highlight({ text, query }: { text: string; query: string }) {
  if (!text || query.trim().length < 2) return text;
  const parts = text.split(new RegExp(`(${flexPattern(query).source})`, "i"));
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} className="bg-gold/25 text-ink">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function SearchView() {
  const t = useTranslations("search");
  const { locale } = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [phase, setPhase] = useState<"idle" | "wait" | "done">(initial.trim().length >= 2 ? "wait" : "idle");
  const [kind, setKind] = useState<"all" | SearchHit["kind"]>("all");
  const query = q.trim();
  const examples = ["Sofija", "Tomas", "Henochas", "Pradžios 1:1"];
  const cited = hits.some((item) => item.kicker === "Eilutė");
  const groups: Array<{ id: SearchHit["kind"]; label: string }> = cited
    ? [
        { id: "verse", label: "Eilutės" },
        { id: "book", label: "Knygos" },
        { id: "text", label: "Traktatai" },
        { id: "term", label: "Žodynas" },
        { id: "about", label: "Apie" },
      ]
    : [
        { id: "book", label: "Knygos" },
        { id: "text", label: "Traktatai" },
        { id: "verse", label: "Eilutės" },
        { id: "term", label: "Žodynas" },
        { id: "about", label: "Apie" },
      ];
  const visible = kind === "all" ? hits : hits.filter((item) => item.kind === kind);

  useEffect(() => {
    setKind("all");
    if (query.length < 2) {
      setHits([]);
      setPhase("idle");
      return;
    }
    const controller = new AbortController();
    setPhase("wait");
    const timer = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((response) => response.json())
        .then((data: { hits: SearchHit[] }) => {
          setHits(data.hits);
          setPhase("done");
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setPhase("done");
        });
    }, 160);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  const onChange = (value: string) => {
    setQ(value);
    const next = value.trim();
    router.replace(next ? `/search?q=${encodeURIComponent(next)}` : "/search", { scroll: false });
  };

  return (
    <PageFade>
      <main id="content" className="mx-auto max-w-3xl px-6 pt-20 pb-28">
        <Breadcrumbs crumbs={pageCrumbs("Paieška", "Paieška", "/search", locale)} className="mb-6" />
        <h1 className="font-display mb-8 text-4xl">{t("title")}</h1>
        <input
          value={q}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t("placeholder")}
          className="h-12 w-full border-b border-line bg-transparent text-lg outline-none placeholder:text-muted"
        />
        {phase === "idle" ? (
          <ul className="mt-8 flex flex-wrap gap-2">
            {examples.map((example) => (
              <li key={example}>
                <button
                  type="button"
                  onClick={() => onChange(example)}
                  className="border border-line px-3 py-1 text-sm text-muted hover:border-gold hover:text-gold"
                >
                  {example}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {phase === "wait" ? <p className="mt-6 text-sm text-muted">Ieškoma…</p> : null}
        {phase === "done" && hits.length === 0 ? (
          <p className="font-display mt-16 text-2xl text-muted">{t("empty")}</p>
        ) : null}
        {phase === "done" && hits.length > 0 ? (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setKind("all")}
              className={`border px-3 py-1 text-[11px] tracking-[0.12em] uppercase ${kind === "all" ? "border-gold text-gold" : "border-line text-muted"}`}
            >
              Visi {hits.length}
            </button>
            {groups.map((group) => {
              const count = hits.filter((item) => item.kind === group.id).length;
              if (!count) return null;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setKind(group.id)}
                  className={`border px-3 py-1 text-[11px] tracking-[0.12em] uppercase ${kind === group.id ? "border-gold text-gold" : "border-line text-muted"}`}
                >
                  {group.label} {count}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-8 space-y-10">
          {groups.map((group) => {
            const items = visible.filter((item) => item.kind === group.id);
            if (!items.length) return null;
            return (
              <section key={group.id}>
                <h2 className="text-[10px] tracking-[0.18em] text-gold uppercase">{group.label}</h2>
                <div className="mt-4 space-y-6">
                  {items.map((item) => (
                    <Link key={`${item.kind}-${item.href}`} href={item.href} className="block hover:text-gold">
                      <p className="text-[10px] tracking-[0.16em] text-muted uppercase">{item.kicker}</p>
                      <p className="font-display text-2xl">{item.title}</p>
                      {item.snippet ? (
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          <Highlight text={item.snippet} query={query} />
                        </p>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </PageFade>
  );
}
