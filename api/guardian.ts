import type { VercelRequest, VercelResponse } from '@vercel/node'

const TOPIC_QUERIES: Record<string, string> = {
  iran: 'Iran',
  gaza: 'Gaza',
  trump: 'Trump',
  nato: 'NATO',
  oekraine: 'Ukraine',
  ai: 'artificial intelligence',
  europa: 'European Union',
}

interface GuardianResult {
  id: string
  webPublicationDate: string
  webUrl: string
  fields?: {
    headline?: string
    trailText?: string
    bodyText?: string
    thumbnail?: string
  }
}

interface GuardianResponse {
  response: {
    status: string
    results: GuardianResult[]
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const topicId = req.query.topicId as string | undefined

  if (!topicId || !TOPIC_QUERIES[topicId]) {
    return res.status(400).json({ error: 'Invalid topicId' })
  }

  const apiKey = process.env.GUARDIAN_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const query = TOPIC_QUERIES[topicId]
  const params = new URLSearchParams({
    q: query,
    'page-size': '10',
    'order-by': 'newest',
    'show-fields': 'headline,trailText,bodyText,thumbnail',
    'api-key': apiKey,
  })

  try {
    const response = await fetch(
      `https://content.guardianapis.com/search?${params.toString()}`,
    )

    if (!response.ok) {
      return res.status(502).json({ error: `Guardian API returned ${response.status}` })
    }

    const data: GuardianResponse = await response.json()
    const articles = data.response.results.map((result) => ({
      id: result.id,
      topicId,
      source: 'The Guardian' as const,
      timestamp: result.webPublicationDate,
      headline: result.fields?.headline ?? '',
      preview: result.fields?.trailText ? stripHtml(result.fields.trailText) : '',
      body: result.fields?.bodyText ?? '',
      imageUrl: result.fields?.thumbnail,
      originalUrl: result.webUrl,
    }))

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')
    return res.status(200).json(articles)
  } catch {
    return res.status(502).json({ error: 'Failed to fetch from Guardian API' })
  }
}
