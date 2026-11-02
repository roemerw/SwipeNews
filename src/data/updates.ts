import { articles, type Article } from './articles'
import { getTopicById } from './topics'

export type UpdateMagnitude = 'major' | 'standard' | 'minor'
export type UpdateStatus = 'developing' | 'confirmed' | 'monitoring' | 'stable'
export type UpdateKind = 'new-development' | 'continuation'

export interface UpdateItem {
  id: string
  clusterId: string
  topicId: string
  topicLabel: string
  timestamp: string
  title: string
  summary: string
  contextLine?: string
  whyNow?: string
  source: Article['source']
  sourceArticleId: string
  articleIds: string[]
  sourceCount: number
  articleCount: number
  isMultiSource: boolean
  isDeveloping: boolean
  imageUrl?: string
  originalUrl: string
  magnitude: UpdateMagnitude
  updateKind: UpdateKind
  status: UpdateStatus
  statusLabel: string
  relevanceBase: number
}

interface NormalizationRule {
  topicId: string
  clusterId: string
  keywords: string[]
  minMatches?: number
  title: string
  summary?: string
  contextLine?: string
  whyNow?: string
  magnitude: UpdateMagnitude
  updateKind: UpdateKind
  status: UpdateStatus
  preferredSource?: Article['source']
}

const normalizationRules: NormalizationRule[] = [
  {
    topicId: 'iran',
    clusterId: 'iran-diplomacy-window',
    keywords: ['talks', 'diplomat', 'tehran', 'sanctions', 'patience'],
    minMatches: 1,
    title: 'Diplomacy with Iran remains open, but under sharper pressure',
    summary:
      'Talks have not collapsed, yet the diplomatic lane is now carrying more pressure language and less room for missteps.',
    contextLine:
      'Context: this is still managed escalation, not a clean break. Capitals are trying to keep leverage without closing the channel.',
    whyNow:
      'Several Iran signals now point in the same direction: more pressure in public, more caution in the mechanics.',
    magnitude: 'major',
    updateKind: 'new-development',
    status: 'developing',
    preferredSource: 'NOS',
  },
  {
    topicId: 'iran',
    clusterId: 'iran-market-risk',
    keywords: ['shipping', 'insurers', 'gulf', 'oil', 'traders'],
    minMatches: 1,
    title: 'Market pricing still reflects a live Iran risk premium',
    summary:
      'Shipping and energy markets have moved off peak panic, but they are still pricing in disruption risk rather than normal conditions.',
    contextLine:
      'Why this matters: market caution is often the fastest way geopolitical tension reaches prices, logistics and confidence.',
    whyNow: 'Commercial signals are still aligning around caution, not normalization.',
    magnitude: 'major',
    updateKind: 'continuation',
    status: 'confirmed',
    preferredSource: 'The Guardian',
  },
  {
    topicId: 'iran',
    clusterId: 'iran-security-posture',
    keywords: ['militias', 'response', 'air-defense', 'radar', 'interception'],
    minMatches: 1,
    title: 'Iran’s wider security picture remains unstable beyond official messaging',
    summary:
      'The immediate risk is no longer just what capitals say, but what aligned groups or defensive signaling could trigger around them.',
    contextLine:
      'Context: loosely aligned actors and visible military messaging make the situation harder to read and easier to misread.',
    whyNow: 'This remains a live monitoring problem because state caution does not remove wider operational risk.',
    magnitude: 'major',
    updateKind: 'continuation',
    status: 'monitoring',
  },
  {
    topicId: 'gaza',
    clusterId: 'gaza-aid-access',
    keywords: ['aid', 'convoy', 'corridor', 'deliveries', 'humanitarian'],
    minMatches: 1,
    title: 'Aid access in Gaza improved at the margin, not at the level of need',
    summary:
      'A few access indicators look better, but the humanitarian baseline remains deeply inadequate and operationally fragile.',
    contextLine:
      'Context: a slightly better day in Gaza can still sit well inside an emergency baseline. That is why small gains are treated cautiously.',
    whyNow: 'Multiple lines of coverage still point to the same conclusion: modest movement without a real break in conditions.',
    magnitude: 'major',
    updateKind: 'new-development',
    status: 'developing',
    preferredSource: 'NOS',
  },
  {
    topicId: 'gaza',
    clusterId: 'gaza-system-strain',
    keywords: ['hospital', 'fuel', 'supplies', 'water', 'surgical'],
    minMatches: 1,
    title: 'Core systems in Gaza remain under compounding strain',
    summary:
      'Hospitals, water systems and basic logistics are still being squeezed together rather than recovering separately.',
    contextLine:
      'Why this matters: when multiple systems stay under pressure at once, small disruptions become harder to absorb.',
    whyNow: 'Operational strain is still broad, not isolated to one headline metric.',
    magnitude: 'major',
    updateKind: 'continuation',
    status: 'confirmed',
  },
  {
    topicId: 'gaza',
    clusterId: 'gaza-political-pressure',
    keywords: ['protests', 'accountability', 'regional', 'cautiously', 'scrutiny'],
    minMatches: 1,
    title: 'Political pressure around Gaza is rising faster than protection on the ground',
    summary:
      'Regional politics and accountability debates are intensifying, but they have not yet translated into clearer protection for civilians.',
    contextLine:
      'Context: diplomatic and legal pressure can move quickly in rhetoric while daily conditions change much more slowly.',
    whyNow: 'The conversation around Gaza is widening beyond relief logistics into political cost and public pressure.',
    magnitude: 'standard',
    updateKind: 'new-development',
    status: 'monitoring',
  },
  {
    topicId: 'trump',
    clusterId: 'trump-economic-message',
    keywords: ['tariffs', 'trade', 'economic', 'kitchen-table', 'surrogates'],
    minMatches: 1,
    title: 'Trump’s orbit is tightening the economic message around trade and prices',
    summary:
      'The campaign is trying to make tariffs and broader economic messaging feel more immediate, disciplined and voter-facing.',
    contextLine:
      'Context: this is less about a brand-new policy than about sharper packaging around a familiar position.',
    whyNow: 'Both campaign and surrogate messaging are tilting toward a narrower, more repeatable economic pitch.',
    magnitude: 'major',
    updateKind: 'new-development',
    status: 'confirmed',
    preferredSource: 'NOS',
  },
  {
    topicId: 'trump',
    clusterId: 'trump-legal-institutional',
    keywords: ['court', 'legal', 'institutional', 'battles', 'courts'],
    minMatches: 1,
    title: 'Trump coverage is still being pulled back toward legal and institutional stress',
    summary:
      'Court timing and legal framing continue to shape the campaign environment even when they do not dominate the day’s loudest headlines.',
    contextLine:
      'Why this matters: legal pressure often affects the race through accumulation and framing, not one single event.',
    whyNow: 'The legal track remains active enough that it keeps re-entering the broader campaign narrative.',
    magnitude: 'major',
    updateKind: 'continuation',
    status: 'developing',
    preferredSource: 'The Guardian',
  },
  {
    topicId: 'trump',
    clusterId: 'trump-strategy-balance',
    keywords: ['donors', 'foreign policy', 'immigration', 'battlegrounds', 'media'],
    minMatches: 1,
    title: 'Trump’s coalition still looks stronger on intensity than on strategic coherence',
    summary:
      'Donors, advisers and campaign operators are aligned on momentum, but less aligned on what the broader governing message should be.',
    contextLine:
      'Context: the campaign’s strength is still attention and clarity on a few issues, not total message alignment.',
    whyNow: 'The internal balance matters because several campaign lanes are active at once, not all with the same priorities.',
    magnitude: 'standard',
    updateKind: 'continuation',
    status: 'monitoring',
  },
  {
    topicId: 'nato',
    clusterId: 'nato-delivery-shift',
    keywords: ['timelines', 'procurement', 'stockpiles', 'industrial', 'spending'],
    minMatches: 1,
    title: 'NATO’s spending story is shifting from promises to delivery proof',
    summary:
      'Alliance debate is moving away from target-setting alone and toward what can actually be delivered on a credible timetable.',
    contextLine:
      'Why this matters: delivery capacity is now a strategic story, not just a procurement story.',
    whyNow: 'Several NATO signals now converge on the same point: execution is the real test of credibility.',
    magnitude: 'major',
    updateKind: 'new-development',
    status: 'confirmed',
    preferredSource: 'NOS',
  },
  {
    topicId: 'nato',
    clusterId: 'nato-posture-signaling',
    keywords: ['drills', 'messaging', 'reassurance', 'surprise', 'deterrence'],
    minMatches: 1,
    title: 'NATO is trying to make visible deterrence feel routine rather than alarming',
    summary:
      'Exercises and public messaging are being calibrated to signal readiness without feeding the impression of panic.',
    contextLine:
      'Context: alliance messaging now has to reassure publics and allies at the same time.',
    whyNow: 'Posture and communications are being managed together, not as separate stories.',
    magnitude: 'standard',
    updateKind: 'continuation',
    status: 'confirmed',
  },
  {
    topicId: 'nato',
    clusterId: 'nato-resilience-backbone',
    keywords: ['cyber', 'resilience', 'mobility', 'logistics'],
    minMatches: 1,
    title: 'NATO keeps broadening readiness from weapons to resilience',
    summary:
      'Cyber continuity and military mobility are being treated less like support functions and more like core readiness requirements.',
    contextLine:
      'Why this matters: deterrence breaks down quickly if networks, movement or continuity planning cannot keep up.',
    whyNow: 'The alliance is now speaking about resilience in much more mainstream operational terms.',
    magnitude: 'standard',
    updateKind: 'continuation',
    status: 'monitoring',
  },
  {
    topicId: 'oekraine',
    clusterId: 'oekraine-air-pressure',
    keywords: ['drone', 'air defense', 'missile', 'coverage'],
    minMatches: 1,
    title: 'Ukraine is still under heavy air pressure even when maps look steadier',
    summary:
      'Operational strain remains high in the air and along supply routes, which keeps air defense central to the near-term picture.',
    contextLine:
      'Context: slower movement on the map can still sit alongside a high-pressure air campaign.',
    whyNow: 'The signal here is continuity under pressure, not quiet.',
    magnitude: 'major',
    updateKind: 'continuation',
    status: 'confirmed',
    preferredSource: 'NOS',
  },
  {
    topicId: 'oekraine',
    clusterId: 'oekraine-support-reliability',
    keywords: ['ammunition', 'predictability', 'endurance', 'partners', 'support'],
    minMatches: 1,
    title: 'Ukraine’s external support story remains about reliability, not intent',
    summary:
      'European backing still looks politically durable, but delivery cadence and planning certainty remain the real question.',
    contextLine:
      'Why this matters: commanders and planners need predictable support more than symbolic reassurance.',
    whyNow: 'Support remains active, but the monitoring focus is still on dependable throughput.',
    magnitude: 'major',
    updateKind: 'continuation',
    status: 'confirmed',
    preferredSource: 'The Guardian',
  },
  {
    topicId: 'oekraine',
    clusterId: 'oekraine-resilience-cycle',
    keywords: ['energy', 'repairs', 'reconstruction', 'resilience'],
    minMatches: 1,
    title: 'Ukraine’s resilience effort is still happening alongside the war, not after it',
    summary:
      'Repair, rebuilding and winter preparation are active now because waiting for a perfect security window is no longer realistic.',
    contextLine:
      'Context: infrastructure choices and reconstruction are part of wartime resilience, not only postwar planning.',
    whyNow: 'This remains a live shift in how the conflict is being managed on the civilian side.',
    magnitude: 'standard',
    updateKind: 'new-development',
    status: 'monitoring',
  },
  {
    topicId: 'ai',
    clusterId: 'ai-adoption-discipline',
    keywords: ['integration', 'deploy', 'buyers', 'copilot', 'workflow'],
    minMatches: 1,
    title: 'AI buyers are asking harder deployment and trust questions',
    summary:
      'The AI market is leaning away from broad hype and toward workflow fit, governance and buyer discipline.',
    contextLine:
      'Why this matters: once buyers focus on deployment quality, weaker products stop hiding behind raw capability claims.',
    whyNow: 'Adoption pressure is shifting from demos to operating reality across enterprise use cases.',
    magnitude: 'major',
    updateKind: 'new-development',
    status: 'confirmed',
    preferredSource: 'NOS',
  },
  {
    topicId: 'ai',
    clusterId: 'ai-governance-pressure',
    keywords: ['regulators', 'rules', 'policy', 'implementation', 'europe'],
    minMatches: 1,
    title: 'AI governance pressure is becoming operational, not theoretical',
    summary:
      'The regulatory debate has moved past whether rules are coming and toward how quickly they will start to shape product decisions.',
    contextLine:
      'Context: implementation details now matter more than broad pro- or anti-AI positioning.',
    whyNow: 'Product teams increasingly have to plan around rule timing, scope and enforcement.',
    magnitude: 'major',
    updateKind: 'new-development',
    status: 'developing',
    preferredSource: 'The Guardian',
  },
  {
    topicId: 'ai',
    clusterId: 'ai-infrastructure-limits',
    keywords: ['chip', 'compute', 'energy', 'water', 'data centers'],
    minMatches: 1,
    title: 'AI infrastructure limits are still shaping what the market can really ship',
    summary:
      'Compute access, energy use and environmental strain remain hard constraints underneath the AI product race.',
    contextLine:
      'Why this matters: infrastructure bottlenecks often decide which ambitious AI plans become durable products.',
    whyNow: 'The infrastructure story remains active enough to keep bending roadmaps and economics.',
    magnitude: 'standard',
    updateKind: 'continuation',
    status: 'confirmed',
  },
  {
    topicId: 'europa',
    clusterId: 'europa-competitiveness',
    keywords: ['competitiveness', 'industrial', 'execution capacity', 'investment'],
    minMatches: 1,
    title: 'Europe is still searching for a credible competitiveness story',
    summary:
      'Officials want a cleaner industrial message, but execution capacity and climate tradeoffs keep shaping how credible that message sounds.',
    contextLine:
      'Context: Europe now has no shortage of plans; the trust question is whether institutions can execute them fast enough.',
    whyNow: 'Competitiveness talk keeps returning because it links industry, climate and strategic autonomy in one frame.',
    magnitude: 'major',
    updateKind: 'new-development',
    status: 'developing',
    preferredSource: 'NOS',
  },
  {
    topicId: 'europa',
    clusterId: 'europa-resilience',
    keywords: ['infrastructure', 'resilience', 'defense', 'coordination'],
    minMatches: 1,
    title: 'Europe’s resilience debate is getting more practical',
    summary:
      'Infrastructure, defense coordination and cross-border systems are being treated more clearly as implementation work rather than broad aspiration.',
    contextLine:
      'Why this matters: once the debate turns practical, the pressure shifts to delivery and trust.',
    whyNow: 'Security and resilience language in Europe is now landing in more operational, less rhetorical terms.',
    magnitude: 'standard',
    updateKind: 'new-development',
    status: 'confirmed',
  },
  {
    topicId: 'europa',
    clusterId: 'europa-transition-pressure',
    keywords: ['transition', 'energy', 'bills', 'fair'],
    minMatches: 1,
    title: 'Europe’s transition debate is still being felt through cost and fairness',
    summary:
      'System-level progress and household pressure are moving together, which keeps the politics of fairness live.',
    contextLine:
      'Context: transition language only holds if voters believe the burden is being shared credibly.',
    whyNow: 'The cost and fairness angle still keeps resurfacing even when the macro story sounds calmer.',
    magnitude: 'standard',
    updateKind: 'continuation',
    status: 'monitoring',
  },
]

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^\w\s-]/g, ' ')
}

function firstSentence(text: string) {
  const match = text.match(/.+?[.!?](?:\s|$)/)
  return match?.[0]?.trim() ?? text.trim()
}

function titleFromHeadline(headline: string) {
  return headline.replace(/\s+/g, ' ').trim()
}

function compareArticlesNewest(a: Article, b: Article) {
  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
}

function keywordScore(article: Article, rule: NormalizationRule) {
  const haystack = normalizeText(`${article.headline} ${article.preview}`)
  return rule.keywords.reduce(
    (score, keyword) => (haystack.includes(normalizeText(keyword)) ? score + 1 : score),
    0,
  )
}

function fallbackMagnitude(article: Article): UpdateMagnitude {
  const headline = article.headline.toLowerCase()

  if (
    headline.includes('warn') ||
    headline.includes('ceasefire') ||
    headline.includes('drone') ||
    headline.includes('pressure') ||
    headline.includes('aid') ||
    headline.includes('support')
  ) {
    return 'major'
  }

  if (
    headline.includes('why ') ||
    headline.includes('analysis') ||
    headline.includes('explainer') ||
    headline.includes('slightly')
  ) {
    return 'minor'
  }

  return 'standard'
}

function fallbackStatus(article: Article, magnitude: UpdateMagnitude): UpdateStatus {
  const headline = article.headline.toLowerCase()

  if (
    headline.includes('talks') ||
    headline.includes('pressure') ||
    headline.includes('debate') ||
    headline.includes('warn')
  ) {
    return 'developing'
  }

  if (magnitude === 'major') {
    return 'monitoring'
  }

  if (magnitude === 'minor') {
    return 'stable'
  }

  return 'confirmed'
}

function fallbackKind(article: Article): UpdateKind {
  const headline = article.headline.toLowerCase()

  if (
    headline.includes('again') ||
    headline.includes('still') ||
    headline.includes('remains') ||
    headline.includes('continues')
  ) {
    return 'continuation'
  }

  return 'new-development'
}

function baseRelevanceScore(params: {
  magnitude: UpdateMagnitude
  status: UpdateStatus
  updateKind: UpdateKind
  isMultiSource: boolean
  sourceCount: number
}) {
  const { magnitude, status, updateKind, isMultiSource, sourceCount } = params
  const magnitudeWeight = magnitude === 'major' ? 60 : magnitude === 'standard' ? 36 : 20
  const statusWeight =
    status === 'developing' ? 24 : status === 'confirmed' ? 18 : status === 'monitoring' ? 12 : 6
  const kindWeight = updateKind === 'new-development' ? 12 : 5
  const sourceWeight = isMultiSource ? 14 + Math.min(sourceCount, 3) * 4 : 0

  return magnitudeWeight + statusWeight + kindWeight + sourceWeight
}

function statusLabelFor(params: {
  magnitude: UpdateMagnitude
  status: UpdateStatus
  isMultiSource: boolean
}) {
  const { magnitude, status, isMultiSource } = params

  if (status === 'developing' && isMultiSource) {
    return 'Developing'
  }

  if (status === 'developing') {
    return 'Waiting for confirmation'
  }

  if (isMultiSource && magnitude === 'major') {
    return 'Multi-source shift'
  }

  if (magnitude === 'major') {
    return 'Major move'
  }

  if (magnitude === 'minor') {
    return 'Minor movement'
  }

  if (status === 'monitoring') {
    return 'Monitoring'
  }

  return 'Stable'
}

function preferredArticle(articlesInCluster: Article[], preferredSource?: Article['source']) {
  const sorted = [...articlesInCluster].sort((left, right) => {
    if (preferredSource && left.source !== right.source) {
      return right.source === preferredSource ? 1 : -1
    }

    if (left.source !== right.source) {
      return right.source === 'NOS' ? 1 : -1
    }

    return compareArticlesNewest(left, right)
  })

  return sorted[0]
}

function buildFallbackContext(primaryArticle: Article, clusterArticles: Article[]) {
  if (clusterArticles.length > 1) {
    return `Context: ${clusterArticles.length} closely related signals are being collapsed into one tracker update so the feed stays focused on the change, not the repetition.`
  }

  return `Context: ${firstSentence(primaryArticle.body)}`
}

function buildFallbackWhyNow(primaryArticle: Article, clusterArticles: Article[]) {
  if (clusterArticles.length > 1) {
    return 'More than one angle of coverage is pointing to the same shift.'
  }

  return firstSentence(primaryArticle.preview)
}

function matchingRule(article: Article) {
  return normalizationRules
    .filter((rule) => rule.topicId === article.topicId)
    .map((rule) => ({ rule, score: keywordScore(article, rule) }))
    .filter(({ rule, score }) => score >= (rule.minMatches ?? 1))
    .sort((left, right) => right.score - left.score)[0]?.rule
}

function buildUpdateFromCluster(clusterId: string, clusterArticles: Article[], rule?: NormalizationRule): UpdateItem {
  const newestArticle = [...clusterArticles].sort(compareArticlesNewest)[0]
  const primaryArticle = preferredArticle(clusterArticles, rule?.preferredSource)
  const topic = getTopicById(primaryArticle.topicId)
  const sourceCount = new Set(clusterArticles.map((article) => article.source)).size
  const magnitude = rule?.magnitude ?? fallbackMagnitude(primaryArticle)
  const status = rule?.status ?? fallbackStatus(primaryArticle, magnitude)
  const updateKind = rule?.updateKind ?? fallbackKind(primaryArticle)
  const isMultiSource = sourceCount > 1

  return {
    id: clusterId,
    clusterId,
    topicId: primaryArticle.topicId,
    topicLabel: topic?.label ?? primaryArticle.topicId,
    timestamp: newestArticle.timestamp,
    title: rule?.title ?? titleFromHeadline(newestArticle.headline),
    summary: rule?.summary ?? primaryArticle.preview,
    contextLine: rule?.contextLine ?? buildFallbackContext(primaryArticle, clusterArticles),
    whyNow: rule?.whyNow ?? buildFallbackWhyNow(primaryArticle, clusterArticles),
    source: primaryArticle.source,
    sourceArticleId: primaryArticle.id,
    articleIds: clusterArticles.map((article) => article.id),
    sourceCount,
    articleCount: clusterArticles.length,
    isMultiSource,
    isDeveloping: status === 'developing',
    imageUrl: primaryArticle.imageUrl,
    originalUrl: primaryArticle.originalUrl,
    magnitude,
    updateKind,
    status,
    statusLabel: statusLabelFor({ magnitude, status, isMultiSource }),
    relevanceBase: baseRelevanceScore({
      magnitude,
      status,
      updateKind,
      isMultiSource,
      sourceCount,
    }),
  }
}

const clusteredArticles = articles.reduce<
  Record<string, { articles: Article[]; rule?: NormalizationRule }>
>((clusters, article) => {
  const rule = matchingRule(article)
  const clusterId = rule?.clusterId ?? article.id
  const currentCluster = clusters[clusterId]

  if (currentCluster) {
    currentCluster.articles.push(article)
    return clusters
  }

  clusters[clusterId] = {
    articles: [article],
    rule,
  }

  return clusters
}, {})

export const updates: UpdateItem[] = Object.entries(clusteredArticles)
  .map(([clusterId, cluster]) => buildUpdateFromCluster(clusterId, cluster.articles, cluster.rule))
  .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())

function relevanceHoursFor(update: UpdateItem) {
  const magnitudeHours = update.magnitude === 'major' ? 18 : update.magnitude === 'standard' ? 12 : 8
  const statusHours = update.status === 'developing' ? 8 : update.status === 'confirmed' ? 5 : 3
  const sourceHours = update.isMultiSource ? 4 : 0
  const kindHours = update.updateKind === 'new-development' ? 2 : 0

  return magnitudeHours + statusHours + sourceHours + kindHours
}

export function isUpdateRelevant(update: UpdateItem, now = Date.now()) {
  const hoursSinceUpdate = (now - new Date(update.timestamp).getTime()) / 3_600_000
  return hoursSinceUpdate <= relevanceHoursFor(update)
}

export function scoreUpdateForFeed(params: {
  update: UpdateItem
  now?: number
  lastVisitedAt?: string | null
  isKept?: boolean
}) {
  const { update, now = Date.now(), lastVisitedAt = null, isKept = false } = params
  const baseline = lastVisitedAt ? new Date(lastVisitedAt).getTime() : 0
  const ageMinutes = Math.max((now - new Date(update.timestamp).getTime()) / 60_000, 0)
  const isNew = new Date(update.timestamp).getTime() > baseline
  const freshnessScore = Math.max(90 - ageMinutes / 5, 0)
  const newnessScore = isNew ? 26 : 0
  const keptScore = isKept ? 18 : 0
  const confirmationScore = update.isMultiSource ? 12 : 0
  const developingScore = update.isDeveloping ? 10 : 0
  const continuationPenalty = update.updateKind === 'continuation' ? -4 : 0

  return (
    update.relevanceBase +
    freshnessScore +
    newnessScore +
    keptScore +
    confirmationScore +
    developingScore +
    continuationPenalty
  )
}

export function getUpdatesForTopic(topicId: string) {
  return updates.filter((update) => update.topicId === topicId)
}

export function getUpdateById(updateId: string) {
  return updates.find((update) => update.id === updateId) ?? null
}

export function getArticleForUpdate(update: UpdateItem) {
  return articles.find((article) => article.id === update.sourceArticleId) ?? null
}
