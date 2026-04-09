import { motion } from 'framer-motion'
import { CheckIcon, RefreshIcon } from './Icons'

interface EmptyStateProps {
  topicLabel: string
  reviewed: number
  readCount: number
  keptUnreadCount: number
  onDone: () => void
  onRefresh: () => void
}

export function EmptyState({
  topicLabel,
  reviewed,
  readCount,
  keptUnreadCount,
  onDone,
  onRefresh,
}: EmptyStateProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="inline-flex h-16 w-16 items-center justify-center rounded-lg border border-white/60 bg-white/65 text-accent shadow-card"
      >
        <CheckIcon className="h-7 w-7" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-8 text-[2rem] font-semibold tracking-tight text-ink"
      >
        All caught up.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-2 text-sm leading-6 text-muted"
      >
        What&apos;s next?
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-7 rounded-lg border border-white/60 bg-white/65 px-4 py-4 text-left shadow-card"
      >
        <p className="text-sm font-semibold text-ink">
          You reviewed {reviewed} updates on {topicLabel}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          {readCount} marked read, {keptUnreadCount} kept unread.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 grid w-full gap-3"
      >
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg bg-ink px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-900"
        >
          Done
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/70 bg-white/70 px-5 py-4 text-sm font-semibold text-ink transition hover:bg-white"
        >
          <RefreshIcon className="h-4 w-4" />
          Refresh
        </button>
      </motion.div>
    </section>
  )
}
