export function EmptyBox({ text }: { text: string }) {
  return (
    <div className="rounded-sm border border-stone-200 bg-ivory-light p-4 text-sm text-ink-soft">
      {text}
    </div>
  );
}
