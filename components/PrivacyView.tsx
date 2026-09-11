"use client";

import { PageFade } from "@/components/PageFade";
import { useLocale } from "@/components/providers";
import { privacy } from "@/content/privacy";
import { pageCrumbs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Link from "next/link";

export function PrivacyView() {
  const { locale } = useLocale();
  const copy = privacy[locale];

  return (
    <PageFade>
      <main id="content" className="mx-auto max-w-2xl px-6 pt-20 pb-28">
        <Breadcrumbs crumbs={pageCrumbs("Privatumas", "Privacy", "/privacy", locale)} className="mb-6" />
        <p className="text-[10px] tracking-[0.22em] text-gold uppercase">{copy.kicker}</p>
        <h1 className="font-display mt-3 mb-3 text-4xl">{copy.title}</h1>
        <p className="mb-12 text-sm text-muted">{copy.updated}</p>
        <div className="space-y-12">
          {copy.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="font-display mb-4 text-2xl text-gold">{section.title}</h2>
              <div className="space-y-4 leading-relaxed">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-16 text-sm text-muted">
          <Link href="/about" className="hover:text-gold">
            {locale === "lt" ? "Apie AEON" : "About AEON"}
          </Link>
        </p>
      </main>
    </PageFade>
  );
}
