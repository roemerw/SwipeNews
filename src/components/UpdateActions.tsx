import { BookmarkIcon, CheckIcon } from './Icons'

interface UpdateActionsProps {
  disabled: boolean
  onKeep: () => void
  onResolve: () => void
}

export function UpdateActions({ disabled, onKeep, onResolve }: UpdateActionsProps) {
  return (
    <div className="mt-auto border-t border-white/55 bg-frame/85 px-4 pb-4 pt-3 backdrop-blur md:px-5 md:pb-5">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={onKeep}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-4 text-sm font-semibold text-ink transition hover:border-accent hover:bg-white disabled:cursor-not-allowed disabled:border-white/50 disabled:bg-white/60 disabled:text-muted"
        >
          <BookmarkIcon className="h-4 w-4" />
          Keep in rotation
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onResolve}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-4 text-sm font-semibold text-white transition hover:bg-[#173f75] disabled:cursor-not-allowed disabled:bg-[#6d89aa]"
        >
          <CheckIcon className="h-4 w-4" />
          Resolve / got it
        </button>
      </div>
    </div>
  )
}
