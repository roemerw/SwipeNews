import { RefreshIcon } from './Icons'
import type { Topic } from '../data/topics'
import { TopicChip } from './TopicChip'

interface TopicSelectorProps {
  topics: Topic[]
  selectedTopicId: string | null
  freshnessLabel: string
  onSelectTopic: (topicId: string) => void
  onRefresh: () => void
  onStart: () => void
}

export function TopicSelector({
  topics,
  selectedTopicId,
  freshnessLabel,
  onSelectTopic,
  onRefresh,
  onStart,
}: TopicSelectorProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{freshnessLabel}</span>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/50 bg-white/55 text-ink transition hover:bg-white"
          aria-label="Refresh topics"
        >
          <RefreshIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Topic monitor
        </p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-tight text-ink">Catch up</h1>
        <p className="mt-2 max-w-[18rem] text-sm leading-6 text-muted">
          What&apos;s moving now
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {topics.map((topic) => (
          <TopicChip
            key={topic.id}
            topic={topic}
            selected={selectedTopicId === topic.id}
            onSelect={onSelectTopic}
          />
        ))}
      </div>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={onStart}
          disabled={!selectedTopicId}
          className="w-full rounded-lg bg-ink px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-500/60"
        >
          Start catch-up
        </button>
      </div>
    </section>
  )
}
