import { useRef, useState, useCallback } from 'react'
import type { ReactNode, TouchEvent } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void
  children: ReactNode
}

const THRESHOLD = 80
const MAX_PULL = 120

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false)
  const pullY = useMotionValue(0)
  const indicatorOpacity = useTransform(pullY, [0, 40, THRESHOLD], [0, 0.4, 1])
  const indicatorScale = useTransform(pullY, [0, THRESHOLD], [0.5, 1])
  const rotation = useTransform(pullY, [0, THRESHOLD], [0, 180])
  const startY = useRef<number | null>(null)
  const pulling = useRef(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (refreshing) return
    startY.current = e.touches[0].clientY
    pulling.current = false
  }, [refreshing])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (startY.current === null || refreshing) return
    const delta = e.touches[0].clientY - startY.current
    if (delta > 10) {
      pulling.current = true
      pullY.set(Math.min(delta * 0.5, MAX_PULL))
    }
  }, [refreshing, pullY])

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current || refreshing) {
      startY.current = null
      return
    }
    startY.current = null
    pulling.current = false

    if (pullY.get() >= THRESHOLD) {
      setRefreshing(true)
      animate(pullY, 50, { duration: 0.2 })
      await onRefresh()
      setRefreshing(false)
    }
    animate(pullY, 0, { type: 'spring', stiffness: 300, damping: 30 })
  }, [refreshing, pullY, onRefresh])

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2"
        style={{ y: useTransform(pullY, (v) => v - 36), opacity: indicatorOpacity, scale: indicatorScale }}
      >
        <motion.div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md"
          style={{ rotate: refreshing ? undefined : rotation }}
          animate={refreshing ? { rotate: 360 } : undefined}
          transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : undefined}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-ink">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 4v6h-6M4 20v-6h6M6.5 9A7 7 0 0118 6m-12 12A7 7 0 016 18" />
          </svg>
        </motion.div>
      </motion.div>
      {children}
    </div>
  )
}
