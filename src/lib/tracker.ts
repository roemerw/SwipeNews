import {
  getUpdatesForTopic,
  isUpdateRelevant,
  scoreUpdateForFeed,
  updates,
  type UpdateItem,
} from '../data/updates'
import { getTopicById, topics } from '../data/topics'
import type { PersistenceState } from './persistence'

export type TrackerFeedMode = 'latest' | 'topic'

export interface FeedSummary {
  visibleUpdates: UpdateItem[]
  trackedUpdates: UpdateItem[]
  newCount: number
  keptCount: number
  majorCount: number
  minorCount: number
  multiSourceCount: number
  developingCount: number
  latestTimestamp: string | null
  stateLabel: string
  summaryLine: string
  activityLine: string
  leadTitle: string | null
  leadWhyNow: string | null
  lastMeaningfulChangeLabel: string
}

export interface TopicFeedSummary extends FeedSummary {
  topicId: string
  label: string
}

function sortNewestFirst(items: UpdateItem[]) {
  return [...items].sort(
    (left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
  )
}

function relativeAgeLabel(isoTimestamp: string) {
  const minutes = Math.max(Math.round((Date.now() - new Date(isoTimestamp).getTime()) / 60_000), 0)

  if (minutes < 60) {
    return `${Math.max(minutes, 1)}m ago`
  }

  if (minutes < 24 * 60) {
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const days = Math.floor(minutes / (24 * 60))
  return `${days}d ago`
}

function quietForLabel(isoTimestamp: string | null) {
  if (!isoTimestamp) {
    return 'Quiet'
  }

  const minutes = Math.max(Math.round((Date.now() - new Date(isoTimestamp).getTime()) / 60_000), 0)

  if (minutes < 60) {
    return `Quiet for ${Math.max(minutes, 1)}m`
  }

  if (minutes < 24 * 60) {
    return `Quiet for ${Math.floor(minutes / 60)}h`
  }

  return `Quiet for ${Math.floor(minutes / (24 * 60))}d`
}

function lastVisitedForMode(
  persistence: PersistenceState,
  mode: TrackerFeedMode,
  topicId: string | null,
) {
  if (mode === 'latest') {
    return persistence.latestLastVisitedAt
  }

  return topicId ? persistence.topicLastVisitedAt[topicId] ?? null : null
}

function candidateUpdatesForMode(mode: TrackerFeedMode, topicId: string | null) {
  return mode === 'latest' ? updates : topicId ? getUpdatesForTopic(topicId) : []
}

function trackedUpdatesForMode(mode: TrackerFeedMode, topicId: string | null, now: number) {
  return sortNewestFirst(candidateUpdatesForMode(mode, topicId).filter((update) => isUpdateRelevant(update, now)))
}

function stateOfPlay(trackedUpdates: UpdateItem[]) {
  if (!trackedUpdates.length) {
    return {
      stateLabel: 'Quiet',
      activityLine: 'No recent meaningful change',
      lastMeaningfulChangeLabel: 'No live change',
    }
  }

  const latest = trackedUpdates[0]
  const recentWindow = trackedUpdates.filter(
    (update) => Date.now() - new Date(update.timestamp).getTime() <= 90 * 60_000,
  )
  const recentMajorCount = recentWindow.filter((update) => update.magnitude === 'major').length
  const recentDevelopingCount = recentWindow.filter((update) => update.isDeveloping).length
  const recentConfirmedCount = recentWindow.filter((update) => update.isMultiSource).length

  if (recentMajorCount >= 2 || (recentMajorCount >= 1 && recentWindow.length >= 3)) {
    return {
      stateLabel: 'Fast-moving',
      activityLine: `${recentMajorCount} major signals in the last 90m`,
      lastMeaningfulChangeLabel: `Last meaningful change ${relativeAgeLabel(latest.timestamp)}`,
    }
  }

  if (latest.isDeveloping && !latest.isMultiSource) {
    return {
      stateLabel: 'Waiting for confirmation',
      activityLine: `Latest change is still single-source · ${relativeAgeLabel(latest.timestamp)}`,
      lastMeaningfulChangeLabel: `Last meaningful change ${relativeAgeLabel(latest.timestamp)}`,
    }
  }

  if (recentDevelopingCount > 0 || recentConfirmedCount > 0 || recentMajorCount > 0) {
    return {
      stateLabel: 'Developing',
      activityLine:
        recentConfirmedCount > 0
          ? `${recentConfirmedCount} multi-source shifts recently`
          : `Live pressure still building · ${relativeAgeLabel(latest.timestamp)}`,
      lastMeaningfulChangeLabel: `Last meaningful change ${relativeAgeLabel(latest.timestamp)}`,
    }
  }

  if (trackedUpdates.every((update) => update.magnitude === 'minor')) {
    return {
      stateLabel: 'Minor movement',
      activityLine: `No major shift, just smaller movement · ${relativeAgeLabel(latest.timestamp)}`,
      lastMeaningfulChangeLabel: `Last meaningful change ${relativeAgeLabel(latest.timestamp)}`,
    }
  }

  if (Date.now() - new Date(latest.timestamp).getTime() > 3 * 60 * 60_000) {
    return {
      stateLabel: 'Quiet',
      activityLine: quietForLabel(latest.timestamp),
      lastMeaningfulChangeLabel: `Last meaningful change ${relativeAgeLabel(latest.timestamp)}`,
    }
  }

  return {
    stateLabel: 'Stable',
    activityLine: `No major fresh break · ${relativeAgeLabel(latest.timestamp)}`,
    lastMeaningfulChangeLabel: `Last meaningful change ${relativeAgeLabel(latest.timestamp)}`,
  }
}

function summaryLine(params: {
  newCount: number
  keptCount: number
  visibleUpdates: UpdateItem[]
  trackedUpdates: UpdateItem[]
}) {
  const { newCount, keptCount, visibleUpdates, trackedUpdates } = params
  const majorVisibleCount = visibleUpdates.filter((update) => update.magnitude === 'major').length
  const multiSourceVisibleCount = visibleUpdates.filter((update) => update.isMultiSource).length

  if (newCount > 0) {
    const parts = [`${newCount} new update${newCount === 1 ? '' : 's'}`]

    if (majorVisibleCount > 0) {
      parts.push(`${majorVisibleCount} major`)
    } else if (visibleUpdates.every((update) => update.magnitude === 'minor')) {
      parts.push('minor movement')
    }

    if (multiSourceVisibleCount > 0) {
      parts.push('multi-source confirmed')
    }

    return parts.join(' · ')
  }

  if (keptCount > 0) {
    return `${keptCount} in rotation · still qualifies as live`
  }

  if (!trackedUpdates.length) {
    return 'No new changes'
  }

  return 'No new changes · tracker already cleared'
}

export function buildVisibleUpdates(params: {
  mode: TrackerFeedMode
  topicId: string | null
  persistence: PersistenceState
}) {
  const { mode, topicId, persistence } = params
  const now = Date.now()
  const lastVisitedAt = lastVisitedForMode(persistence, mode, topicId)
  const baseline = lastVisitedAt ? new Date(lastVisitedAt).getTime() : 0
  const keptUpdateIds = new Set(persistence.keptUpdateIds)
  const resolvedUpdateIds = new Set(persistence.resolvedUpdateIds)

  return candidateUpdatesForMode(mode, topicId)
    .filter((update) => {
      if (!isUpdateRelevant(update, now)) {
        return false
      }

      if (resolvedUpdateIds.has(update.id)) {
        return false
      }

      const isNew = new Date(update.timestamp).getTime() > baseline
      const isKept = keptUpdateIds.has(update.id)

      return isNew || isKept
    })
    .sort((left, right) => {
      const leftScore = scoreUpdateForFeed({
        update: left,
        now,
        lastVisitedAt,
        isKept: keptUpdateIds.has(left.id),
      })
      const rightScore = scoreUpdateForFeed({
        update: right,
        now,
        lastVisitedAt,
        isKept: keptUpdateIds.has(right.id),
      })

      if (rightScore !== leftScore) {
        return rightScore - leftScore
      }

      return new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime()
    })
}

export function summarizeFeed(
  mode: TrackerFeedMode,
  topicId: string | null,
  persistence: PersistenceState,
): FeedSummary {
  const now = Date.now()
  const visibleUpdates = buildVisibleUpdates({ mode, topicId, persistence })
  const trackedUpdates = trackedUpdatesForMode(mode, topicId, now)
  const lastVisitedAt = lastVisitedForMode(persistence, mode, topicId)
  const baseline = lastVisitedAt ? new Date(lastVisitedAt).getTime() : 0
  const newCount = visibleUpdates.filter((update) => new Date(update.timestamp).getTime() > baseline).length
  const keptCount = visibleUpdates.filter((update) => persistence.keptUpdateIds.includes(update.id)).length
  const majorCount = visibleUpdates.filter((update) => update.magnitude === 'major').length
  const minorCount = visibleUpdates.filter((update) => update.magnitude === 'minor').length
  const multiSourceCount = visibleUpdates.filter((update) => update.isMultiSource).length
  const developingCount = visibleUpdates.filter((update) => update.isDeveloping).length
  const latestTimestamp = trackedUpdates[0]?.timestamp ?? null
  const dominantUpdate = visibleUpdates[0] ?? trackedUpdates[0] ?? null
  const state = stateOfPlay(trackedUpdates)

  return {
    visibleUpdates,
    trackedUpdates,
    newCount,
    keptCount,
    majorCount,
    minorCount,
    multiSourceCount,
    developingCount,
    latestTimestamp,
    stateLabel: state.stateLabel,
    summaryLine: summaryLine({
      newCount,
      keptCount,
      visibleUpdates,
      trackedUpdates,
    }),
    activityLine: state.activityLine,
    leadTitle: dominantUpdate?.title ?? null,
    leadWhyNow: dominantUpdate?.whyNow ?? null,
    lastMeaningfulChangeLabel: state.lastMeaningfulChangeLabel,
  }
}

export function buildTopicSummaries(persistence: PersistenceState) {
  return topics.map<TopicFeedSummary>((topic) => {
    const summary = summarizeFeed('topic', topic.id, persistence)

    return {
      topicId: topic.id,
      label: topic.label,
      ...summary,
    }
  })
}

export function getFeedTitle(mode: TrackerFeedMode, topicId: string | null) {
  if (mode === 'latest') {
    return 'Latest'
  }

  return getTopicById(topicId)?.label ?? 'Topic'
}
