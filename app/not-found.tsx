"use client";

import { useLocale } from "@/components/providers";
import Link from "next/link";

export default function NotFound() {
  const { locale } = useLocale();
  return (
    <main className="flex min-h-dvh flex-col items-start justify-center px-8">
      <p className="text-[10px] tracking-[0.22em] text-gold uppercase">404</p>
      <h1 className="font-display mt-4 max-w-md text-4xl">
        {locale === "lt" ? "Šioje tyloje nieko nėra." : "Nothing in this silence."}
      </h1>
      <Link href="/text/thomas" className="mt-8 text-sm tracking-[0.16em] text-gold uppercase">
        {locale === "lt" ? "Skaityti Tomą" : "Read Thomas"}
      </Link>
    </main>
  );
}
