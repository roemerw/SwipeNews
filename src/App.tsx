import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CatchUpActions } from './components/CatchUpActions'
import { CatchUpCard } from './components/CatchUpCard'
import { CatchUpHeader } from './components/CatchUpHeader'
import { CardSkeleton } from './components/CardSkeleton'
import { EmptyState } from './components/EmptyState'
import { PullToRefresh } from './components/PullToRefresh'
import { ReaderSheet } from './components/ReaderSheet'
import { TopicOverview } from './components/TopicOverview'
import { TopicSelector } from './components/TopicSelector'
import { topics } from './data/topics'
import { useCatchUpSession } from './hooks/useCatchUpSession'

function App() {
  const session = useCatchUpSession()
  const [swipeDirection, setSwipeDirection] = useState<1 | -1>(1)

  const {
    activeArticle,
    beginQueue,
    closeReader,
    error,
    goBack,
    history,
    isLoading,
    keepUnread,
    markRead,
    nextArticle,
    openReader,
    queue,
    readerArticle,
    refresh,
    remainingCount,
    screen,
    selectTopic,
    selectedTopic,
    selectedTopicId,
    start,
    summary,
    undo,
  } = session

  const handleStart = useCallback(async () => {
    if (!selectedTopicId) {
      return
    }

    await start(selectedTopicId)
  }, [selectedTopicId, start])

  const handleMarkRead = useCallback(() => {
    setSwipeDirection(1)
    markRead()
  }, [markRead])

  const handleKeepUnread = useCallback(() => {
    setSwipeDirection(-1)
    keepUnread()
  }, [keepUnread])

  const handleCardCommit = useCallback(
    (action: 'read' | 'keptUnread') => {
      if (action === 'read') {
        handleMarkRead()
        return
      }

      handleKeepUnread()
    },
    [handleKeepUnread, handleMarkRead],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (screen !== 'queue') {
        return
      }

      if (readerArticle) {
        if (event.key === 'Escape') {
          event.preventDefault()
          closeReader()
        }

        return
      }

      if (!activeArticle) {
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleMarkRead()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handleKeepUnread()
      } else if (event.key === 'Enter') {
        event.preventDefault()
        openReader()
      } else if (event.key === 'Escape') {
        event.preventDefault()
        closeReader()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    activeArticle,
    closeReader,
    handleKeepUnread,
    handleMarkRead,
    openReader,
    readerArticle,
    screen,
  ])

  return (
    <main className="min-h-screen px-3 py-3 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-[calc(100svh-1.5rem)] max-w-[430px] flex-col overflow-hidden bg-frame shadow-frame ring-1 ring-white/55 md:min-h-[820px] md:rounded-lg">
        {screen === 'topics' ? (
          <>
            <TopicSelector
              topics={topics}
              selectedTopicId={selectedTopicId}
              onSelectTopic={selectTopic}
              onStart={handleStart}
            />
            {error ? (
              <div className="px-5 pb-5">
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        {screen === 'overview' && selectedTopic ? (
          <TopicOverview
            topicLabel={selectedTopic.label}
            articles={queue}
            isLoading={isLoading}
            onBegin={beginQueue}
            onBack={goBack}
          />
        ) : null}

        {screen === 'queue' ? (
          <PullToRefresh onRefresh={refresh}>
            <section className="relative flex min-h-0 flex-1 flex-col">
              <CatchUpHeader
                remainingCount={remainingCount}
                canUndo={history.length > 0}
                onBack={goBack}
                onUndo={undo}
              />

              <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 pt-1 md:px-5">
                <div className="relative h-full min-h-[430px] w-full max-w-[360px]">
                  {isLoading ? (
                    <CardSkeleton />
                  ) : (
                    <>
                      {nextArticle ? (
                        <motion.div
                          aria-hidden="true"
                          initial={false}
                          animate={{ scale: 0.97, y: 14, opacity: 0.76 }}
                          className="absolute inset-x-0 bottom-0 top-4"
                        >
                          <CatchUpCard article={nextArticle} variant="preview" />
                        </motion.div>
                      ) : null}

                      <AnimatePresence initial={false} custom={swipeDirection} mode="popLayout">
                        {activeArticle ? (
                          <CatchUpCard
                            key={activeArticle.id}
                            article={activeArticle}
                            swipeDirection={swipeDirection}
                            onOpenReader={openReader}
                            onCommitAction={handleCardCommit}
                          />
                        ) : null}
                      </AnimatePresence>

                      {error ? (
                        <div className="flex h-full items-center justify-center">
                          <div className="rounded-lg border border-white bg-white p-6 text-center shadow-card">
                            <p className="text-sm text-muted">{error}</p>
                            <button
                              type="button"
                              onClick={refresh}
                              className="mt-4 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
                            >
                              Try again
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>

              <CatchUpActions
                disabled={!activeArticle || Boolean(readerArticle) || isLoading}
                onKeepUnread={handleKeepUnread}
                onMarkRead={handleMarkRead}
              />

              <ReaderSheet article={readerArticle} onClose={closeReader} />
            </section>
          </PullToRefresh>
        ) : null}

        {screen === 'done' && selectedTopic ? (
          <EmptyState
            topicLabel={selectedTopic.label}
            reviewed={summary.reviewed}
            readCount={summary.readCount}
            keptUnreadCount={summary.keptUnreadCount}
            onDone={goBack}
            onRefresh={refresh}
          />
        ) : null}
      </div>
    </main>
  )
}

export default App
