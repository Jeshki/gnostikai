import { SaveMark } from "@/components/SaveMark";
import { nhNeighbors, type NhBlock } from "@/lib/nh";
import Link from "next/link";

export function NhReader({
  slug,
  title,
  codex,
  blocks,
}: {
  slug: string;
  title: string;
  codex: string;
  blocks: NhBlock[];
}) {
  const { prev, next } = nhNeighbors(slug);

  return (
    <article id="content" className="mx-auto max-w-[68ch] px-5 pt-20 pb-28 md:px-8">
      <p className="text-[10px] tracking-[0.22em] text-gold uppercase">
        <Link href="/library" className="hover:text-ink">
          Nag Hammadi
        </Link>
        {" · "}
        {codex}
      </p>
      <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">{title}</h1>
      <SaveMark href={`/nh/${slug}`} title={title} kicker={codex} />
      <div className="mt-10">
        {blocks.map((block, index) => {
          if (block.t === "h2") {
            return (
              <h2 key={index} id={`p${index}`} className="font-display mt-12 mb-4 scroll-mt-24 text-2xl">
                {block.text}
              </h2>
            );
          }
          if (block.t === "h3") {
            return (
              <h3 key={index} id={`p${index}`} className="font-display mt-8 mb-3 scroll-mt-24 text-xl text-gold">
                {block.text}
              </h3>
            );
          }
          return (
            <p key={index} id={`p${index}`} className="font-display mb-[0.85em] scroll-mt-24 text-[1.2rem] leading-[1.8]">
              {block.text}
            </p>
          );
        })}
      </div>
      <nav className="mt-16 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <Link href={`/nh/${prev.slug}`} className="hover:text-gold">
            <span className="block text-[10px] tracking-[0.16em] text-muted uppercase">Ankstesnis</span>
            <span className="font-display mt-1 block text-2xl">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/nh/${next.slug}`} className="hover:text-gold sm:text-right">
            <span className="block text-[10px] tracking-[0.16em] text-muted uppercase">Kitas</span>
            <span className="font-display mt-1 block text-2xl">{next.title}</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
