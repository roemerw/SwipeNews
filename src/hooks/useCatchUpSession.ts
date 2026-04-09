import { useCallback, useMemo, useState } from 'react'
import type { Article } from '../data/articles'
import { getTopicById } from '../data/topics'
import { buildQueue } from '../utils/mockQueue'
import { fetchArticlesForTopic } from '../services/fetchArticles'

export type Screen = 'topics' | 'overview' | 'queue' | 'done'
export type HistoryAction = 'read' | 'keptUnread'

export interface HistoryEntry {
  articleId: string
  action: HistoryAction
}

function buildSummary(history: HistoryEntry[]) {
  const readCount = history.filter((entry) => entry.action === 'read').length
  const keptUnreadCount = history.filter((entry) => entry.action === 'keptUnread').length

  return {
    reviewed: history.length,
    readCount,
    keptUnreadCount,
  }
}

export function useCatchUpSession() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [screen, setScreen] = useState<Screen>('topics')
  const [queue, setQueue] = useState<Article[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [readerArticleId, setReaderArticleId] = useState<string | null>(null)
  const [refreshVersion, setRefreshVersion] = useState(0)
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date().toISOString())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeArticle = queue[currentIndex] ?? null
  const nextArticle = queue[currentIndex + 1] ?? null
  const selectedTopic = useMemo(() => getTopicById(selectedTopicId), [selectedTopicId])
  const readerArticle = useMemo(
    () => queue.find((article) => article.id === readerArticleId) ?? null,
    [queue, readerArticleId],
  )
  const remainingCount = Math.max(queue.length - currentIndex, 0)
  const summary = useMemo(() => buildSummary(history), [history])

  const selectTopic = (topicId: string) => {
    setSelectedTopicId(topicId)
  }

  const start = useCallback(async (topicId: string) => {
    setSelectedTopicId(topicId)
    setIsLoading(true)
    setError(null)
    setScreen('overview')
    try {
      const articles = await fetchArticlesForTopic(topicId)
      setQueue(buildQueue(articles, 0))
      setCurrentIndex(0)
      setHistory([])
      setReaderArticleId(null)
    } catch {
      setError('Failed to load articles')
      setScreen('topics')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const beginQueue = () => {
    if (queue.length > 0) {
      setScreen('queue')
    }
  }

  const processCurrentArticle = (action: HistoryAction) => {
    if (screen !== 'queue' || !activeArticle || readerArticleId) {
      return
    }

    const nextHistory = [...history, { articleId: activeArticle.id, action }]
    const nextIndex = currentIndex + 1

    setHistory(nextHistory)
    setCurrentIndex(nextIndex)
    setReaderArticleId(null)
    setScreen(nextIndex >= queue.length ? 'done' : 'queue')
  }

  const markRead = () => {
    processCurrentArticle('read')
  }

  const keepUnread = () => {
    processCurrentArticle('keptUnread')
  }

  const undo = () => {
    if (!history.length) {
      return
    }

    const nextHistory = history.slice(0, -1)

    setHistory(nextHistory)
    setCurrentIndex(nextHistory.length)
    setReaderArticleId(null)
    setScreen('queue')
  }

  const openReader = () => {
    if (screen !== 'queue' || !activeArticle) {
      return
    }

    setReaderArticleId(activeArticle.id)
  }

  const closeReader = () => {
    setReaderArticleId(null)
  }

  const refresh = useCallback(async () => {
    const nextVersion = refreshVersion + 1

    setRefreshVersion(nextVersion)
    setLastRefreshedAt(new Date().toISOString())

    if ((screen === 'overview' || screen === 'queue' || screen === 'done') && selectedTopicId) {
      setIsLoading(true)
      setError(null)
      setScreen('overview')
      try {
        const articles = await fetchArticlesForTopic(selectedTopicId)
        setQueue(buildQueue(articles, nextVersion))
        setCurrentIndex(0)
        setHistory([])
        setReaderArticleId(null)
      } catch {
        setError('Failed to refresh articles')
      } finally {
        setIsLoading(false)
      }
    }
  }, [refreshVersion, screen, selectedTopicId])

  const goBack = () => {
    setQueue([])
    setCurrentIndex(0)
    setHistory([])
    setReaderArticleId(null)
    setError(null)
    setScreen('topics')
  }

  return {
    selectedTopicId,
    screen,
    queue,
    currentIndex,
    history,
    readerArticleId,
    refreshVersion,
    lastRefreshedAt,
    selectedTopic,
    activeArticle,
    nextArticle,
    readerArticle,
    remainingCount,
    summary,
    isLoading,
    error,
    selectTopic,
    start,
    beginQueue,
    markRead,
    keepUnread,
    undo,
    openReader,
    closeReader,
    refresh,
    goBack,
  }
}
