export function CardSkeleton() {
  return (
    <article className="h-full rounded-lg border border-white bg-white p-5 shadow-card">
      <div className="animate-pulse pt-8">
        <div className="flex items-center gap-2">
          <div className="h-5 w-20 rounded-full bg-slate-200" />
          <div className="h-4 w-16 rounded bg-slate-100" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-7 w-full rounded bg-slate-200" />
          <div className="h-7 w-3/4 rounded bg-slate-200" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-5/6 rounded bg-slate-100" />
          <div className="h-4 w-2/3 rounded bg-slate-100" />
        </div>

        <div className="mt-5 h-40 w-full rounded-lg bg-slate-100" />
      </div>
    </article>
  )
}
