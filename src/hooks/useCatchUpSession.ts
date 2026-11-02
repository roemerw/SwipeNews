import { useEffect, useMemo, useState } from 'react'
import { getArticleForUpdate, getUpdateById, type UpdateItem } from '../data/updates'
import { getTopicById } from '../data/topics'
import {
  buildTopicSummaries,
  buildVisibleUpdates,
  getFeedTitle,
  summarizeFeed,
  type TrackerFeedMode,
} from '../lib/tracker'
import { loadPersistenceState, savePersistenceState, type PersistenceState } from '../lib/persistence'

export type Screen = 'home' | 'queue' | 'done'
export type FeedMode = TrackerFeedMode
export type HistoryAction = 'resolved' | 'kept'

export interface HistoryEntry {
  updateId: string
  action: HistoryAction
}

interface QueueSession {
  mode: FeedMode
  topicId: string | null
  queue: UpdateItem[]
  startedAt: string
}

function initialPersistence(): PersistenceState {
  return loadPersistenceState()
}

export function useCatchUpSession() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>('iran')
  const [activeSession, setActiveSession] = useState<QueueSession | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [readerUpdateId, setReaderUpdateId] = useState<string | null>(null)
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date().toISOString())
  const [persistence, setPersistence] = useState<PersistenceState>(initialPersistence)

  useEffect(() => {
    savePersistenceState(persistence)
  }, [persistence])

  const latestSummary = useMemo(() => summarizeFeed('latest', null, persistence), [persistence])
  const topicSummaries = useMemo(() => buildTopicSummaries(persistence), [persistence])

  const activeFeedSummary = useMemo(() => {
    if (!activeSession) {
      return null
    }

    return summarizeFeed(activeSession.mode, activeSession.topicId, persistence)
  }, [activeSession, persistence])

  const activeUpdate = activeSession?.queue[currentIndex] ?? null
  const nextUpdate = activeSession?.queue[currentIndex + 1] ?? null
  const readerUpdate = readerUpdateId ? getUpdateById(readerUpdateId) : null
  const readerArticle = readerUpdate ? getArticleForUpdate(readerUpdate) : null
  const remainingCount = Math.max((activeSession?.queue.length ?? 0) - currentIndex, 0)
  const selectedTopic = getTopicById(selectedTopicId)

  const sessionSummary = useMemo(() => {
    const resolvedCount = history.filter((entry) => entry.action === 'resolved').length
    const keptCount = history.filter((entry) => entry.action === 'kept').length
    const majorResolvedCount = history.filter((entry) => {
      const update = getUpdateById(entry.updateId)
      return entry.action === 'resolved' && update?.magnitude === 'major'
    }).length

    return {
      resolvedCount,
      keptCount,
      reviewedCount: history.length,
      majorResolvedCount,
    }
  }, [history])

  const commitVisit = (session: QueueSession | null) => {
    if (!session) {
      return
    }

    setPersistence((current) => {
      if (session.mode === 'latest') {
        return {
          ...current,
          latestLastVisitedAt: session.startedAt,
        }
      }

      if (!session.topicId) {
        return current
      }

      return {
        ...current,
        topicLastVisitedAt: {
          ...current.topicLastVisitedAt,
          [session.topicId]: session.startedAt,
        },
      }
    })
  }

  const startSession = (mode: FeedMode, topicId: string | null) => {
    const queue = buildVisibleUpdates({ mode, topicId, persistence })
    const startedAt = new Date().toISOString()

    setActiveSession({
      mode,
      topicId,
      queue,
      startedAt,
    })
    setCurrentIndex(0)
    setHistory([])
    setReaderUpdateId(null)
    setScreen(queue.length ? 'queue' : 'done')
  }

  const openLatest = () => {
    startSession('latest', null)
  }

  const openTopic = (topicId: string) => {
    setSelectedTopicId(topicId)
    startSession('topic', topicId)
  }

  const processCurrentUpdate = (action: HistoryAction) => {
    if (!activeUpdate || !activeSession || readerUpdateId) {
      return
    }

    setPersistence((current) => {
      const resolvedUpdateIds =
        action === 'resolved'
          ? Array.from(new Set([...current.resolvedUpdateIds, activeUpdate.id]))
          : current.resolvedUpdateIds.filter((updateId) => updateId !== activeUpdate.id)
      const keptUpdateIds =
        action === 'kept'
          ? Array.from(new Set([...current.keptUpdateIds, activeUpdate.id]))
          : current.keptUpdateIds.filter((updateId) => updateId !== activeUpdate.id)

      return {
        ...current,
        resolvedUpdateIds,
        keptUpdateIds,
      }
    })

    const nextHistory = [...history, { updateId: activeUpdate.id, action }]
    const nextIndex = currentIndex + 1

    setHistory(nextHistory)
    setCurrentIndex(nextIndex)
    setReaderUpdateId(null)
    setScreen(nextIndex >= activeSession.queue.length ? 'done' : 'queue')
  }

  const resolveCurrent = () => {
    processCurrentUpdate('resolved')
  }

  const keepCurrent = () => {
    processCurrentUpdate('kept')
  }

  const undo = () => {
    if (!history.length || !activeSession) {
      return
    }

    const lastEntry = history[history.length - 1]
    const nextHistory = history.slice(0, -1)

    setPersistence((current) => ({
      ...current,
      resolvedUpdateIds: current.resolvedUpdateIds.filter((updateId) => updateId !== lastEntry.updateId),
      keptUpdateIds: current.keptUpdateIds.filter((updateId) => updateId !== lastEntry.updateId),
    }))

    setHistory(nextHistory)
    setCurrentIndex(nextHistory.length)
    setReaderUpdateId(null)
    setScreen('queue')
  }

  const openReader = () => {
    if (!activeUpdate) {
      return
    }

    setReaderUpdateId(activeUpdate.id)
    const article = getArticleForUpdate(activeUpdate)

    if (!article) {
      return
    }

    setPersistence((current) => ({
      ...current,
      openedArticleIds: Array.from(new Set([...current.openedArticleIds, article.id])),
    }))
  }

  const closeReader = () => {
    setReaderUpdateId(null)
  }

  const refresh = () => {
    setLastRefreshedAt(new Date().toISOString())

    if (screen === 'home') {
      return
    }

    if (!activeSession) {
      return
    }

    startSession(activeSession.mode, activeSession.topicId)
  }

  const goHome = () => {
    commitVisit(activeSession)
    setScreen('home')
    setActiveSession(null)
    setCurrentIndex(0)
    setHistory([])
    setReaderUpdateId(null)
  }

  return {
    activeFeedSummary,
    activeSession,
    activeUpdate,
    closeReader,
    goHome,
    history,
    keepCurrent,
    lastRefreshedAt,
    latestSummary,
    nextUpdate,
    openLatest,
    openReader,
    openTopic,
    readerArticle,
    readerUpdate,
    refresh,
    remainingCount,
    resolveCurrent,
    screen,
    selectedTopic,
    selectedTopicId,
    sessionSummary,
    setSelectedTopicId,
    topicSummaries,
    undo,
    queueTitle: activeSession ? getFeedTitle(activeSession.mode, activeSession.topicId) : null,
  }
}
