import { useRef } from 'react'
import type { PointerEvent } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import type { Article } from '../data/articles'
import { formatArticleTimestamp } from '../utils/formatters'

interface CatchUpCardProps {
  article: Article
  variant?: 'active' | 'preview'
  swipeDirection?: 1 | -1
  onOpenReader?: () => void
  onCommitAction?: (action: 'read' | 'keptUnread') => void
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

export function CatchUpCard({
  article,
  variant = 'active',
  swipeDirection = 1,
  onOpenReader,
  onCommitAction,
}: CatchUpCardProps) {
  const isPreview = variant === 'preview'
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-160, 0, 160], [-7, 0, 7])
  const readOpacity = useTransform(x, [16, 96], [0, 1])
  const unreadOpacity = useTransform(x, [-96, -16], [1, 0])
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const travelRef = useRef(0)

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
      onOpenReader?.()
    }

    pointerStart.current = null
  }

  const image = article.imageUrl ? (
    <div className="mt-5 overflow-hidden rounded-lg border border-slate-100">
      <img
        src={article.imageUrl}
        alt=""
        className={`h-40 w-full object-cover ${isPreview ? 'opacity-80' : ''}`}
      />
    </div>
  ) : null

  const content = (
    <div className={isPreview ? '' : 'pt-8'}>
      <div className="flex items-center gap-2 text-[11px] text-muted">
        <span className="rounded-full bg-accentSoft px-2 py-1 font-semibold text-accent">
          {article.source}
        </span>
        <span>{formatArticleTimestamp(article.timestamp)}</span>
      </div>

      <h2 className="mt-4 text-[1.55rem] font-semibold leading-tight tracking-tight text-ink">
        {article.headline}
      </h2>
      <p className="mt-4 text-sm leading-6 text-muted">{article.preview}</p>
      {image}
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
      className="relative h-full rounded-lg border border-white bg-white p-5 shadow-card"
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

        onCommitAction?.(info.offset.x > 0 ? 'read' : 'keptUnread')
      }}
      whileTap={{ scale: 0.995 }}
    >
      <motion.div
        aria-hidden="true"
        style={{ opacity: unreadOpacity }}
        className="pointer-events-none absolute left-4 top-4 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase text-slate-600"
      >
        Keep unread
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ opacity: readOpacity }}
        className="pointer-events-none absolute right-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase text-emerald-700"
      >
        Mark read
      </motion.div>
      {content}
    </motion.article>
  )
}
