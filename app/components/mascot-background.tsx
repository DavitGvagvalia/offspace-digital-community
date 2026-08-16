export function MascotBackground({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute bg-contain bg-center bg-no-repeat opacity-[0.08] mix-blend-multiply ${className}`}
      style={{ backgroundImage: "url('/offspace-otter.png')" }}
    />
  );
}
