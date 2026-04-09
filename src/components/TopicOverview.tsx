import { motion } from 'framer-motion'
import type { Article } from '../data/articles'
import { ArrowLeftIcon } from './Icons'

interface TopicOverviewProps {
  topicLabel: string
  articles: Article[]
  isLoading: boolean
  onBegin: () => void
  onBack: () => void
}

export function TopicOverview({
  topicLabel,
  articles,
  isLoading,
  onBegin,
  onBack,
}: TopicOverviewProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-4 pb-2 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/50 bg-white/55 text-ink transition hover:bg-white"
          aria-label="Back to topics"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight text-ink">{topicLabel}</h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          What&apos;s happening
        </p>

        {isLoading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3 items-start">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-300" />
                <div className="h-4 w-full rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : (
          <ol className="mt-4 space-y-2.5">
            {articles.map((article, i) => (
              <motion.li
                key={article.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex gap-3 items-start"
              >
                <span className="mt-0.5 text-xs font-semibold text-muted/60 tabular-nums">
                  {i + 1}.
                </span>
                <span className="text-[13px] leading-snug text-ink">
                  {article.headline}
                </span>
              </motion.li>
            ))}
          </ol>
        )}

        <div className="sticky bottom-0 bg-gradient-to-t from-frame from-70% pb-5 pt-4 mt-2">
          <button
            type="button"
            onClick={onBegin}
            disabled={isLoading || articles.length === 0}
            className="w-full rounded-lg bg-ink px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-500/60"
          >
            Start swiping
          </button>
        </div>
      </div>
    </section>
  )
}
