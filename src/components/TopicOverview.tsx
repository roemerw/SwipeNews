import { useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import type { Article } from '../data/articles'
import { ArrowLeftIcon } from './Icons'

interface TopicOverviewProps {
  topicLabel: string
  articles: Article[]
  isLoading: boolean
  onBegin: () => void
  onBack: () => void
}

function formatTimeRange(articles: Article[]): string {
  if (articles.length === 0) return ''
  const times = articles.map((a) => new Date(a.timestamp).getTime())
  const newest = Math.max(...times)
  const oldest = Math.min(...times)
  const now = Date.now()

  const formatAge = (ms: number) => {
    const mins = Math.round(ms / 60_000)
    if (mins < 60) return `${Math.max(mins, 1)}m`
    const hrs = Math.round(mins / 60)
    if (hrs < 24) return `${hrs}h`
    return `${Math.round(hrs / 24)}d`
  }

  const newestAge = formatAge(now - newest)
  const oldestAge = formatAge(now - oldest)

  if (newestAge === oldestAge) return `from ${newestAge} ago`
  return `${newestAge} – ${oldestAge} ago`
}

export function TopicOverview({
  topicLabel,
  articles,
  isLoading,
  onBegin,
  onBack,
}: TopicOverviewProps) {
  const y = useMotionValue(0)
  const teaserOpacity = useTransform(y, [-200, -60, 0], [0.9, 0.3, 0.15])
  const teaserScale = useTransform(y, [-200, 0], [1, 0.92])
  const dismissing = useRef(false)

  const firstFive = articles.slice(0, 5)
  const firstArticle = articles[0]
  const timeRange = formatTimeRange(articles)

  const dismiss = () => {
    if (dismissing.current) return
    dismissing.current = true
    animate(y, -800, {
      type: 'spring',
      stiffness: 200,
      damping: 30,
      onComplete: () => {
        dismissing.current = false
        onBegin()
      },
    })
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Teaser card underneath — blurred, barely visible */}
      {firstArticle ? (
        <motion.div
          className="absolute inset-x-4 bottom-20 top-16 z-0 overflow-hidden rounded-lg border border-white/60 bg-white/70 p-5 shadow-card backdrop-blur-sm"
          style={{ opacity: teaserOpacity, scale: teaserScale }}
        >
          <div className="mt-6">
            <div className="flex items-center gap-2 text-[11px] text-muted">
              <span className="rounded-full bg-accentSoft px-2 py-1 font-semibold text-accent">
                {firstArticle.source}
              </span>
            </div>
            <div className="mt-4 text-[1.4rem] font-semibold leading-tight tracking-tight text-ink/40">
              {firstArticle.headline}
            </div>
            <div className="mt-3 h-3 w-3/4 rounded bg-slate-200/60" />
            <div className="mt-2 h-3 w-1/2 rounded bg-slate-200/60" />
          </div>
        </motion.div>
      ) : null}

      {/* Overview sheet — draggable upward */}
      <motion.div
        className="relative z-10 flex min-h-0 flex-1 flex-col bg-frame"
        style={{ y }}
        drag={isLoading ? false : 'y'}
        dragConstraints={{ top: -800, bottom: 0 }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          if (info.offset.y < -100 || info.velocity.y < -400) {
            dismiss()
          } else {
            animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 })
          }
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pb-1 pt-4">
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

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col px-5 pt-3">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              What&apos;s happening
            </p>
            {timeRange ? (
              <p className="text-[11px] tabular-nums text-muted/70">{timeRange}</p>
            ) : null}
          </div>

          {isLoading ? (
            <div className="mt-5 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-5 w-full rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : (
            <ol className="mt-5 space-y-3.5">
              {firstFive.map((article, i) => (
                <motion.li
                  key={article.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <p className="text-[15px] font-medium leading-snug tracking-tight text-ink">
                    {article.headline}
                  </p>
                </motion.li>
              ))}
            </ol>
          )}

          {/* Spacer + visual hint to swipe up */}
          <div className="mt-auto flex flex-col items-center gap-3 pb-4 pt-6">
            <motion.div
              className="flex flex-col items-center gap-1.5 text-muted/50"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l-6-6-6 6" />
              </svg>
              <span className="text-[11px] font-medium tracking-wide">Swipe up</span>
            </motion.div>

            <button
              type="button"
              onClick={dismiss}
              disabled={isLoading || articles.length === 0}
              className="w-full rounded-lg bg-ink px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-500/60"
            >
              Start swiping
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
