export default function Loading() {
  return (
    <div className="px-8 pt-28" aria-hidden>
      <div className="mb-6 h-3 w-24 bg-ink/8" />
      <div className="mb-4 h-10 w-2/3 max-w-md bg-ink/8" />
      <div className="space-y-3">
        <div className="h-4 w-full max-w-xl bg-ink/8" />
        <div className="h-4 w-5/6 max-w-lg bg-ink/8" />
        <div className="h-4 w-4/6 max-w-md bg-ink/8" />
      </div>
    </div>
  );
}
