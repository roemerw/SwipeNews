import { ArrowLeftIcon, RefreshIcon, UndoIcon } from './Icons'

interface UpdateFeedHeaderProps {
  title: string
  stateLabel: string
  summaryLine: string
  activityLine: string
  lastMeaningfulChangeLabel: string
  remainingCount: number
  canUndo: boolean
  onBack: () => void
  onRefresh: () => void
  onUndo: () => void
}

export function UpdateFeedHeader({
  title,
  stateLabel,
  summaryLine,
  activityLine,
  lastMeaningfulChangeLabel,
  remainingCount,
  canUndo,
  onBack,
  onRefresh,
  onUndo,
}: UpdateFeedHeaderProps) {
  return (
    <header className="px-4 pb-3 pt-4 md:px-5">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/50 bg-white/60 text-ink transition hover:bg-white"
            aria-label="Back to home"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/50 bg-white/55 text-ink transition hover:bg-white"
            aria-label="Refresh feed"
          >
            <RefreshIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="justify-self-center text-center">
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm font-semibold text-ink">{title}</p>
            <span className="rounded-full bg-accentSoft px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-accent">
              {stateLabel}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">{summaryLine}</p>
        </div>

        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-ink transition hover:bg-white/45 disabled:cursor-not-allowed disabled:text-muted/70 disabled:hover:bg-transparent"
        >
          <UndoIcon className="h-4 w-4" />
          <span>Undo</span>
        </button>
      </div>

      <div className="mt-3 rounded-lg border border-white/50 bg-white/55 px-3 py-2 text-center text-xs font-medium text-muted">
        <span>{remainingCount} active {remainingCount === 1 ? 'update' : 'updates'}</span>
        <span className="mx-2" aria-hidden="true">
          ·
        </span>
        <span>{activityLine}</span>
      </div>

      <div className="mt-2 px-1 text-center text-[11px] text-muted">{lastMeaningfulChangeLabel}</div>
    </header>
  )
}
