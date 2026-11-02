import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import type { UpdateItem } from '../data/updates'
import { formatArticleTimestamp } from '../utils/formatters'
import { ExternalIcon, SparkIcon } from './Icons'

interface UpdateCardProps {
  update: UpdateItem
  variant?: 'active' | 'preview'
  swipeDirection?: 1 | -1
  onOpenArticle?: () => void
  onCommitAction?: (action: 'resolved' | 'kept') => void
}

const springTransition = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 28,
}

const activeCardVariants = {
  initial: {
    opacity: 0,
    y: 18,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springTransition,
  },
  exit: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction > 0 ? 220 : -220,
    rotate: direction > 0 ? 10 : -10,
    transition: {
      type: 'tween' as const,
      duration: 0.24,
      ease: 'easeOut' as const,
    },
  }),
}

function magnitudeLabel(magnitude: UpdateItem['magnitude']) {
  if (magnitude === 'major') {
    return 'Major update'
  }

  if (magnitude === 'minor') {
    return 'Minor movement'
  }

  return 'New development'
}

function statusTone(update: UpdateItem) {
  if (update.magnitude === 'major') {
    return {
      shell: 'border-sky-200 bg-white',
      summary: 'bg-sky-50 text-sky-800',
      badge: 'bg-sky-100 text-sky-700',
    }
  }

  if (update.magnitude === 'minor') {
    return {
      shell: 'border-slate-200 bg-white',
      summary: 'bg-slate-50 text-slate-700',
      badge: 'bg-slate-100 text-slate-700',
    }
  }

  return {
    shell: 'border-white bg-white',
    summary: 'bg-slate-50 text-slate-800',
    badge: 'bg-accentSoft text-accent',
  }
}

export function UpdateCard({
  update,
  variant = 'active',
  swipeDirection = 1,
  onOpenArticle,
  onCommitAction,
}: UpdateCardProps) {
  const isPreview = variant === 'preview'
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-160, 0, 160], [-7, 0, 7])
  const resolveOpacity = useTransform(x, [16, 96], [0, 1])
  const keepOpacity = useTransform(x, [-96, -16], [1, 0])
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const travelRef = useRef(0)
  const [showContext, setShowContext] = useState(false)
  const tone = statusTone(update)

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (isPreview) {
      return
    }

    pointerStart.current = { x: event.clientX, y: event.clientY }
    travelRef.current = 0
  }

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (isPreview || !pointerStart.current) {
      return
    }

    const travelDistance = Math.hypot(
      event.clientX - pointerStart.current.x,
      event.clientY - pointerStart.current.y,
    )

    if (travelDistance < 6 && travelRef.current < 6) {
      onOpenArticle?.()
    }

    pointerStart.current = null
  }

  const content = (
    <div className={isPreview ? '' : 'pt-8'}>
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
        <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-ink">
          {update.topicLabel}
        </span>
        <span className={`rounded-full px-2 py-1 font-semibold ${tone.badge}`}>
          {magnitudeLabel(update.magnitude)}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
          {update.statusLabel}
        </span>
        {update.isMultiSource ? (
          <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
            {update.sourceCount} sources
          </span>
        ) : null}
        <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600">
          {update.updateKind === 'new-development' ? 'New development' : 'Ongoing shift'}
        </span>
        <span>{formatArticleTimestamp(update.timestamp)}</span>
      </div>

      <h2 className="mt-4 text-[1.45rem] font-semibold leading-tight tracking-tight text-ink">
        {update.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-700">{update.summary}</p>

      {!isPreview && update.whyNow ? (
        <div className={`mt-4 rounded-lg px-3 py-3 text-sm leading-6 ${tone.summary}`}>
          <span className="font-semibold">Why now:</span> {update.whyNow}
        </div>
      ) : null}

      {!isPreview && update.contextLine ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setShowContext((value) => !value)
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-muted transition hover:border-slate-300 hover:bg-slate-50"
        >
          <SparkIcon className="h-4 w-4" />
          {showContext ? 'Hide background' : 'Open context'}
        </button>
      ) : null}

      {!isPreview && showContext && update.contextLine ? (
        <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-700">
          {update.contextLine}
        </div>
      ) : null}

      {update.imageUrl ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-100">
          <img
            src={update.imageUrl}
            alt=""
            className={`h-36 w-full object-cover ${isPreview ? 'opacity-80' : ''}`}
          />
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-muted">
        <div>
          <p className="font-semibold text-ink">{update.source}</p>
          <p className="mt-1">
            {update.isMultiSource
              ? `${update.sourceCount} sources aligned on this shift`
              : 'Preferred source article'}
          </p>
        </div>
        {!isPreview ? (
          <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-ink">
            <ExternalIcon className="h-4 w-4" />
            Open source
          </div>
        ) : null}
      </div>
    </div>
  )

  if (isPreview) {
    return (
      <article className="h-full rounded-lg border border-white/50 bg-white/65 p-5 shadow-card backdrop-blur">
        {content}
      </article>
    )
  }

  return (
    <motion.article
      className={`relative h-full rounded-lg border p-5 shadow-card ${tone.shell}`}
      drag="x"
      dragElastic={0.18}
      dragMomentum
      style={{ x, rotate }}
      custom={swipeDirection}
      variants={activeCardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onDrag={(_, info) => {
        travelRef.current = Math.max(travelRef.current, Math.abs(info.offset.x))
      }}
      onDragEnd={(_, info) => {
        const shouldCommit =
          Math.abs(info.offset.x) >= 96 || Math.abs(info.velocity.x) >= 700

        if (!shouldCommit) {
          travelRef.current = 0
          return
        }

        onCommitAction?.(info.offset.x > 0 ? 'resolved' : 'kept')
      }}
      whileTap={{ scale: 0.995 }}
    >
      <motion.div
        aria-hidden="true"
        style={{ opacity: keepOpacity }}
        className="pointer-events-none absolute left-4 top-4 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase text-slate-600"
      >
        Keep in rotation
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ opacity: resolveOpacity }}
        className="pointer-events-none absolute right-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase text-emerald-700"
      >
        Resolve
      </motion.div>
      {content}
    </motion.article>
  )
}
