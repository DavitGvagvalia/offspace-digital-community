import Link from "next/link";

export function LoadingState({ title = "Loading workspace" }: { title?: string }) {
  return (
    <main className="min-h-screen bg-ivory px-4 py-6 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-ink-soft">Checking your account access.</p>
      </section>
    </main>
  );
}

export function AccessError({
  message,
  loginHref,
}: {
  message: string;
  loginHref: string;
}) {
  return (
    <main className="min-h-screen bg-ivory px-4 py-6 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-md border border-stone-200 bg-offwhite p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Access unavailable</h1>
        <p className="mt-2 text-sm text-ink-soft">{message}</p>
        <Link
          href={loginHref}
          className="mt-5 inline-flex rounded-sm bg-forest px-4 py-3 text-sm font-bold text-ivory transition hover:bg-forest-light"
        >
          Return to login
        </Link>
      </section>
    </main>
  );
}
