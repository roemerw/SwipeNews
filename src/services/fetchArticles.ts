import type { Article } from '../data/articles'
import { getArticlesForTopic } from '../data/articles'

export async function fetchArticlesForTopic(topicId: string): Promise<Article[]> {
  try {
    const cacheBuster = Date.now()
    const response = await fetch(
      `/api/guardian?topicId=${encodeURIComponent(topicId)}&_t=${cacheBuster}`,
      { cache: 'no-store' },
    )
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    const articles: Article[] = await response.json()
    return articles
  } catch {
    return getArticlesForTopic(topicId)
  }
}
