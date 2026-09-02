import type { Mentor } from "../../_types/mentor";

export function ProfileDetailsSection({ profile }: { profile: Mentor }) {
  const rows = [
    ["Name", profile.name],
    ["Last name", profile.lastName],
    ["Email", profile.email ?? "Not added"],
    ["Phone", profile.phone ?? "Not added"],
    ["Status", profile.active ? "Active" : "Inactive"],
  ];

  return (
    <section className="rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
      <dl className="grid gap-4 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="rounded-sm border border-stone-200 bg-ivory-light p-4"
          >
            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
              {label}
            </dt>
            <dd className="mt-2 text-lg font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
