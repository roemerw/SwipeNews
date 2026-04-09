import type { VercelRequest, VercelResponse } from '@vercel/node'

interface TopicConfig {
  tag: string
  query: string
}

const TOPIC_CONFIG: Record<string, TopicConfig> = {
  ai:       { tag: 'technology/artificialintelligenceai', query: 'artificial intelligence' },
  iran:     { tag: 'world/iran',                         query: 'Iran' },
  gaza:     { tag: 'world/gaza',                         query: 'Gaza' },
  trump:    { tag: 'us-news/donaldtrump',                query: 'Trump' },
  nato:     { tag: 'world/nato',                         query: 'NATO' },
  oekraine: { tag: 'world/ukraine',                      query: 'Ukraine' },
  europa:   { tag: 'world/eu',                           query: 'European Union' },
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

function buildGuardianUrl(apiKey: string, params: Record<string, string>): string {
  const defaults: Record<string, string> = {
    'page-size': '15',
    'order-by': 'newest',
    'type': 'article',
    'show-fields': 'headline,trailText,bodyText,thumbnail',
    'api-key': apiKey,
  }
  const merged = { ...defaults, ...params }
  const qs = Object.entries(merged)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  return `https://content.guardianapis.com/search?${qs}`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const topicId = req.query.topicId as string | undefined

    if (!topicId || !TOPIC_CONFIG[topicId]) {
      return res.status(400).json({ error: 'Invalid topicId' })
    }

    const apiKey = process.env.GUARDIAN_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    const config = TOPIC_CONFIG[topicId]

    // Primary: tag-based filtering (editorial precision)
    const primaryUrl = buildGuardianUrl(apiKey, { tag: config.tag })
    const primaryResponse = await globalThis.fetch(primaryUrl)

    if (!primaryResponse.ok) {
      return res.status(502).json({ error: `Guardian API returned ${primaryResponse.status}` })
    }

    let data: GuardianResponse = await primaryResponse.json()

    // Fallback: keyword search if tags return too few results
    if (data.response.results.length < 3) {
      const fallbackUrl = buildGuardianUrl(apiKey, { q: config.query })
      const fallbackResponse = await globalThis.fetch(fallbackUrl)
      if (fallbackResponse.ok) {
        data = await fallbackResponse.json()
      }
    }

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
  } catch (err) {
    console.error('Guardian API error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(502).json({ error: `Failed to fetch: ${message}` })
  }
}
