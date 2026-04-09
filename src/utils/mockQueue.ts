import type { Article } from '../data/articles'

function rotate<T>(items: T[], offset: number) {
  if (!items.length) {
    return []
  }

  const normalizedOffset = offset % items.length

  return items.map((_, index) => items[(index + normalizedOffset) % items.length])
}

function shiftTimestamp(isoTimestamp: string, minutes: number) {
  const shiftedTime = new Date(isoTimestamp).getTime() + minutes * 60_000

  return new Date(shiftedTime).toISOString()
}

export function buildQueue(articles: Article[], refreshVersion: number) {
  const rotatedArticles = rotate(articles, refreshVersion)

  return rotatedArticles.map((article, index): Article => {
    const freshnessOffset = (refreshVersion * 5 + index * 2) % 24

    return {
      ...article,
      timestamp: shiftTimestamp(article.timestamp, freshnessOffset),
    }
  })
}
