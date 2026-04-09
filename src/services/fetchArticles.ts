import type { Article } from '../data/articles'
import { getArticlesForTopic } from '../data/articles'

export async function fetchArticlesForTopic(topicId: string): Promise<Article[]> {
  try {
    const response = await fetch(`/api/guardian?topicId=${encodeURIComponent(topicId)}`)
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    const articles: Article[] = await response.json()
    return articles
  } catch {
    return getArticlesForTopic(topicId)
  }
}
