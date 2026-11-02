import { ArrowLeftIcon, RefreshIcon } from './Icons'

export interface TopicHomeState {
  topicId: string
  label: string
  newCount: number
  keptCount: number
  majorCount: number
  multiSourceCount: number
  stateLabel: string
  summaryLine: string
  activityLine: string
  leadTitle: string | null
  lastMeaningfulChangeLabel: string
}

interface HomeScreenProps {
  topics: TopicHomeState[]
  latestSummary: {
    newCount: number
    keptCount: number
    majorCount: number
    multiSourceCount: number
    stateLabel: string
    summaryLine: string
    activityLine: string
    leadTitle: string | null
    lastMeaningfulChangeLabel: string
    freshnessLabel: string
  }
  selectedTopicId: string | null
  onSelectTopic: (topicId: string) => void
  onOpenLatest: () => void
  onOpenTopic: () => void
  onRefresh: () => void
}

export function HomeScreen({
  topics,
  latestSummary,
  selectedTopicId,
  onSelectTopic,
  onOpenLatest,
  onOpenTopic,
  onRefresh,
}: HomeScreenProps) {
  const selectedTopic = topics.find((topic) => topic.topicId === selectedTopicId) ?? null

  return (
    <section className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{latestSummary.freshnessLabel}</span>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/50 bg-white/55 text-ink transition hover:bg-white"
          aria-label="Refresh tracker"
        >
          <RefreshIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Live situation tracker
        </p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-tight text-ink">Catch up</h1>
        <p className="mt-2 max-w-[19rem] text-sm leading-6 text-muted">
          Show me only the latest relevant updates on the situations I track.
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenLatest}
        className="mt-7 rounded-lg border border-white/60 bg-white/75 p-4 text-left shadow-card transition hover:bg-white"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                Latest
              </p>
              <span className="rounded-full bg-accentSoft px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-accent">
                {latestSummary.stateLabel}
              </span>
            </div>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink">
              Mixed feed across tracked topics
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">{latestSummary.summaryLine}</p>
            {latestSummary.leadTitle ? (
              <p className="mt-2 text-sm leading-6 text-slate-700">{latestSummary.leadTitle}</p>
            ) : null}
          </div>
          <div className="rounded-lg bg-accentSoft px-3 py-2 text-right">
            <p className="text-xl font-semibold text-accent">{latestSummary.newCount}</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
              new
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>{latestSummary.activityLine}</span>
          <span aria-hidden="true">·</span>
          <span>{latestSummary.majorCount} major</span>
          <span aria-hidden="true">·</span>
          <span>{latestSummary.multiSourceCount} confirmed</span>
        </div>
      </button>

      <div className="mt-7">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">Topics</h2>
          {selectedTopic ? (
            <button
              type="button"
              onClick={onOpenTopic}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-accent transition hover:bg-white/50"
            >
              Open {selectedTopic.label}
              <ArrowLeftIcon className="h-4 w-4 rotate-180" />
            </button>
          ) : null}
        </div>

        <div className="mt-3 grid gap-3">
          {topics.map((topic) => (
            <button
              key={topic.topicId}
              type="button"
              onClick={() => onSelectTopic(topic.topicId)}
              className={`rounded-lg border p-4 text-left transition ${
                selectedTopicId === topic.topicId
                  ? 'border-accent bg-white shadow-card'
                  : 'border-white/55 bg-white/65 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-ink">{topic.label}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-700">
                      {topic.stateLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{topic.summaryLine}</p>
                  {topic.leadTitle ? (
                    <p className="mt-2 text-sm leading-6 text-slate-700">{topic.leadTitle}</p>
                  ) : null}
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-right">
                  <p className="text-lg font-semibold text-ink">{topic.newCount}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                    new
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span>{topic.activityLine}</span>
                <span aria-hidden="true">·</span>
                <span>{topic.majorCount} major</span>
                <span aria-hidden="true">·</span>
                <span>{topic.multiSourceCount} confirmed</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6 text-xs leading-5 text-muted">
        Latest prioritizes net-new updates. Keep in rotation only if the situation still matters next time.
      </div>
    </section>
  )
}
