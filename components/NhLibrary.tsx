"use client";

import { hasQuery } from "@/lib/fold";
import { codexAnchor, nhByCodex, nhCatalog } from "@/lib/nh";
import Link from "next/link";
import { useMemo, useState } from "react";

export function NhLibrary() {
  const [q, setQ] = useState("");
  const query = q.trim();
  const groups = useMemo(
    () =>
      nhByCodex()
        .map((group) => ({
          ...group,
          works: group.works.filter((work) => query.length < 2 || hasQuery(`${work.title} ${work.codex}`, query)),
        }))
        .filter((group) => group.works.length > 0),
    [query],
  );
  const shown = groups.reduce((sum, group) => sum + group.works.length, 0);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Ieškoti traktato"
          className="h-11 w-full border-b border-line bg-transparent outline-none placeholder:text-muted sm:max-w-sm"
        />
        <p className="text-sm text-muted">
          {shown} iš {nhCatalog.length}
        </p>
      </div>
      {query.length >= 2 ? null : (
        <ul className="mb-10 flex flex-wrap gap-2">
          {nhByCodex().map((group) => (
            <li key={group.codex}>
              <a
                href={`#${codexAnchor(group.codex)}`}
                className="inline-block border border-line px-3 py-1 text-[11px] tracking-[0.12em] text-muted uppercase hover:border-gold hover:text-gold"
              >
                {group.codex}
              </a>
            </li>
          ))}
        </ul>
      )}
      {shown === 0 ? (
        <p className="font-display text-2xl text-muted">Tokio traktato nėra. Pabandyk „Tomas“ arba „Sofija“.</p>
      ) : null}
      <div className="space-y-12">
        {groups.map((group) => (
          <section key={group.codex} id={codexAnchor(group.codex)} className="scroll-mt-24">
            <h2 className="text-[10px] tracking-[0.22em] text-gold uppercase">
              {group.codex}
              <span className="ml-3 text-muted">{group.works.length}</span>
            </h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {group.works.map((work) => (
                <li key={work.slug}>
                  <Link href={`/nh/${work.slug}`} className="block border border-line p-4 hover:border-gold/50">
                    <span className="font-display text-xl leading-snug">{work.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
