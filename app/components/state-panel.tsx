export function StatePanel({ title, text }: { title: string; text: string }) {
  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{text}</p>
    </section>
  );
}
