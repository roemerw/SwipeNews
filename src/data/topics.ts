export interface Topic {
  id: string
  label: string
}

export const topics: Topic[] = [
  { id: 'iran', label: 'Iran' },
  { id: 'gaza', label: 'Gaza' },
  { id: 'trump', label: 'Trump' },
  { id: 'nato', label: 'NATO' },
  { id: 'oekraine', label: 'Oekraïne' },
  { id: 'ai', label: 'AI' },
  { id: 'europa', label: 'Europa' },
]

export function getTopicById(topicId: string | null | undefined) {
  if (!topicId) {
    return undefined
  }

  return topics.find((topic) => topic.id === topicId)
}
