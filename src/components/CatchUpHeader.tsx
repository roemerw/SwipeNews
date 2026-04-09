import { ArrowLeftIcon, RefreshIcon, UndoIcon } from './Icons'

interface CatchUpHeaderProps {
  remainingCount: number
  canUndo: boolean
  onBack: () => void
  onRefresh: () => void
  onUndo: () => void
}

export function CatchUpHeader({
  remainingCount,
  canUndo,
  onBack,
  onRefresh,
  onUndo,
}: CatchUpHeaderProps) {
  return (
    <header className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 pb-3 pt-4 md:px-5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/50 bg-white/60 text-ink transition hover:bg-white"
          aria-label="Back to topics"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/50 bg-white/50 text-ink transition hover:bg-white"
          aria-label="Refresh session"
        >
          <RefreshIcon className="h-4 w-4" />
        </button>
      </div>

      <p className="justify-self-center text-sm font-semibold text-ink">{remainingCount} Left</p>

      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-ink transition hover:bg-white/45 disabled:cursor-not-allowed disabled:text-muted/70 disabled:hover:bg-transparent"
      >
        <UndoIcon className="h-4 w-4" />
        <span>Undo</span>
      </button>
    </header>
  )
}
