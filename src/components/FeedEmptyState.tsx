import { RefreshIcon } from './Icons'

interface FeedEmptyStateProps {
  title: string
  message: string
  submessage: string
  onBack: () => void
  onRefresh: () => void
}

export function FeedEmptyState({
  title,
  message,
  submessage,
  onBack,
  onRefresh,
}: FeedEmptyStateProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="rounded-lg border border-white/60 bg-white/65 px-5 py-5 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">{title}</p>
        <h2 className="mt-3 text-[1.65rem] font-semibold tracking-tight text-ink">{message}</h2>
        <p className="mt-3 max-w-[17rem] text-sm leading-6 text-muted">{submessage}</p>
      </div>

      <div className="mt-8 grid w-full gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg bg-ink px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-900"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/70 bg-white/70 px-5 py-4 text-sm font-semibold text-ink transition hover:bg-white"
        >
          <RefreshIcon className="h-4 w-4" />
          Refresh feed
        </button>
      </div>
    </section>
  )
}
