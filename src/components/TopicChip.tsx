import type { Topic } from '../data/topics'

interface TopicChipProps {
  topic: Topic
  selected: boolean
  onSelect: (topicId: string) => void
}

export function TopicChip({ topic, selected, onSelect }: TopicChipProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(topic.id)}
      className={`rounded-lg border px-4 py-3 text-left transition duration-200 ${
        selected
          ? 'border-accent bg-accent text-white shadow-card'
          : 'border-line bg-white/80 text-ink hover:border-accent hover:bg-white'
      }`}
      aria-pressed={selected}
    >
      <span className="block text-sm font-semibold">{topic.label}</span>
    </button>
  )
}
