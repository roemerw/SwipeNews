import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EmptyState } from './components/EmptyState'
import { FeedEmptyState } from './components/FeedEmptyState'
import { HomeScreen } from './components/HomeScreen'
import { ReaderSheet } from './components/ReaderSheet'
import { UpdateActions } from './components/UpdateActions'
import { UpdateCard } from './components/UpdateCard'
import { UpdateFeedHeader } from './components/UpdateFeedHeader'
import { useCatchUpSession } from './hooks/useCatchUpSession'
import { formatFreshnessLabel } from './utils/formatters'

function App() {
  const session = useCatchUpSession()
  const [swipeDirection, setSwipeDirection] = useState<1 | -1>(1)

  const {
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
    queueTitle,
    screen,
    selectedTopic,
    selectedTopicId,
    sessionSummary,
    setSelectedTopicId,
    topicSummaries,
    undo,
  } = session

  const freshnessLabel = useMemo(
    () => formatFreshnessLabel(lastRefreshedAt),
    [lastRefreshedAt],
  )

  const handleResolve = useCallback(() => {
    setSwipeDirection(1)
    resolveCurrent()
  }, [resolveCurrent])

  const handleKeep = useCallback(() => {
    setSwipeDirection(-1)
    keepCurrent()
  }, [keepCurrent])

  const handleCardCommit = useCallback(
    (action: 'resolved' | 'kept') => {
      if (action === 'resolved') {
        handleResolve()
        return
      }

      handleKeep()
    },
    [handleKeep, handleResolve],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (screen !== 'queue') {
        return
      }

      if (readerUpdate) {
        if (event.key === 'Escape') {
          event.preventDefault()
          closeReader()
        }

        return
      }

      if (!activeUpdate) {
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleResolve()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handleKeep()
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
  }, [activeUpdate, closeReader, handleKeep, handleResolve, openReader, readerUpdate, screen])

  const doneTitle =
    activeSession?.mode === 'latest'
      ? 'You are up to date across your tracked situations.'
      : `You are up to date on ${selectedTopic?.label ?? 'this topic'}.`
  const doneSummary = `${sessionSummary.reviewedCount} updates reviewed this session.`
  const doneDetail =
    sessionSummary.majorResolvedCount > 0
      ? `${sessionSummary.resolvedCount} resolved, ${sessionSummary.keptCount} kept in rotation, ${sessionSummary.majorResolvedCount} major shifts cleared.`
      : `${sessionSummary.resolvedCount} resolved, ${sessionSummary.keptCount} kept in rotation.`

  const emptyMessage =
    activeSession?.mode === 'latest'
      ? 'Nothing net new right now.'
      : `No new updates for ${selectedTopic?.label ?? 'this topic'}.`
  const emptySubmessage =
    activeSession?.mode === 'latest'
      ? 'You have already cleared the latest relevant changes, and nothing kept in rotation still qualifies.'
      : 'This situation is quiet for now, or the remaining items no longer qualify as latest relevant updates.'

  return (
    <main className="min-h-screen px-3 py-3 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-[calc(100svh-1.5rem)] max-w-[430px] flex-col overflow-hidden bg-frame shadow-frame ring-1 ring-white/55 md:min-h-[820px] md:rounded-lg">
        {screen === 'home' ? (
          <HomeScreen
            topics={topicSummaries}
            latestSummary={{ ...latestSummary, freshnessLabel }}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            onOpenLatest={openLatest}
            onOpenTopic={() => {
              if (selectedTopicId) {
                openTopic(selectedTopicId)
              }
            }}
            onRefresh={refresh}
          />
        ) : null}

        {screen === 'queue' ? (
          <section className="relative flex min-h-0 flex-1 flex-col">
            <UpdateFeedHeader
              title={queueTitle ?? 'Latest'}
              stateLabel={activeFeedSummary?.stateLabel ?? 'Quiet'}
              summaryLine={activeFeedSummary?.summaryLine ?? 'No new changes'}
              activityLine={activeFeedSummary?.activityLine ?? 'No recent movement'}
              lastMeaningfulChangeLabel={
                activeFeedSummary?.lastMeaningfulChangeLabel ?? 'No recent live change'
              }
              remainingCount={remainingCount}
              canUndo={history.length > 0}
              onBack={goHome}
              onRefresh={refresh}
              onUndo={undo}
            />

            <div className="px-4 pb-2 text-center text-xs text-muted md:px-5">
              {activeFeedSummary?.leadTitle
                ? activeFeedSummary.leadTitle
                : 'Only the latest relevant updates stay active here'}
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 pt-1 md:px-5">
              <div className="relative h-full min-h-[470px] w-full max-w-[360px]">
                {nextUpdate ? (
                  <motion.div
                    aria-hidden="true"
                    initial={false}
                    animate={{ scale: 0.97, y: 14, opacity: 0.76 }}
                    className="absolute inset-x-0 bottom-0 top-4"
                  >
                    <UpdateCard update={nextUpdate} variant="preview" />
                  </motion.div>
                ) : null}

                <AnimatePresence initial={false} custom={swipeDirection} mode="wait">
                  {activeUpdate ? (
                    <UpdateCard
                      key={activeUpdate.id}
                      update={activeUpdate}
                      swipeDirection={swipeDirection}
                      onOpenArticle={openReader}
                      onCommitAction={handleCardCommit}
                    />
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            <UpdateActions
              disabled={!activeUpdate || Boolean(readerUpdate)}
              onKeep={handleKeep}
              onResolve={handleResolve}
            />

            <ReaderSheet
              article={readerArticle}
              topicLabel={readerUpdate?.topicLabel}
              updateTitle={readerUpdate?.title}
              onClose={closeReader}
            />
          </section>
        ) : null}

        {screen === 'done' && activeSession && history.length === 0 ? (
          <FeedEmptyState
            title={queueTitle ?? 'Latest'}
            message={emptyMessage}
            submessage={emptySubmessage}
            onBack={goHome}
            onRefresh={refresh}
          />
        ) : null}

        {screen === 'done' && history.length > 0 ? (
          <EmptyState
            title={doneTitle}
            summary={doneSummary}
            detail={doneDetail}
            onDone={goHome}
            onRefresh={refresh}
          />
        ) : null}
      </div>
    </main>
  )
}

export default App
