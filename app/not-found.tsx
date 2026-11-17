import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-start justify-center px-8">
      <p className="text-[10px] tracking-[0.22em] text-gold uppercase">404</p>
      <h1 className="font-display mt-4 max-w-md text-4xl">Šioje tyloje nieko nėra.</h1>
      <div className="mt-8 flex flex-wrap gap-6 text-sm tracking-[0.16em] uppercase">
        <Link href="/" className="text-gold">
          Pradžia
        </Link>
        <Link href="/nh/tomo-evangelija" className="text-gold">
          Tomo evangelija
        </Link>
      </div>
    </main>
  );
}
