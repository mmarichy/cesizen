export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <section>
        <div className="h-9 w-56 rounded-lg bg-gray-200" />
        <div className="mt-3 h-5 w-80 rounded-lg bg-gray-100" />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <article key={index} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="mt-3 h-9 w-16 rounded bg-gray-300" />
                <div className="mt-2 h-4 w-24 rounded bg-gray-100" />
              </div>
              <div className="h-9 w-9 rounded-xl bg-gray-200" />
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-7 w-40 rounded bg-gray-200" />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-20 rounded-xl bg-gray-100" />
          ))}
        </div>
      </section>
    </div>
  );
}
