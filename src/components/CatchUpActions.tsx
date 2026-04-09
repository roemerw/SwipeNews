import { BookmarkIcon, CheckIcon } from './Icons'

interface CatchUpActionsProps {
  disabled: boolean
  onKeepUnread: () => void
  onMarkRead: () => void
}

export function CatchUpActions({
  disabled,
  onKeepUnread,
  onMarkRead,
}: CatchUpActionsProps) {
  return (
    <div className="mt-auto border-t border-white/55 bg-frame/85 px-4 pb-4 pt-3 backdrop-blur md:px-5 md:pb-5">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={onKeepUnread}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-4 text-sm font-semibold text-ink transition hover:border-accent hover:bg-white disabled:cursor-not-allowed disabled:border-white/50 disabled:bg-white/60 disabled:text-muted"
        >
          <BookmarkIcon className="h-4 w-4" />
          Keep unread
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onMarkRead}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-4 text-sm font-semibold text-white transition hover:bg-[#173f75] disabled:cursor-not-allowed disabled:bg-[#6d89aa]"
        >
          <CheckIcon className="h-4 w-4" />
          Mark as read
        </button>
      </div>
    </div>
  )
}
