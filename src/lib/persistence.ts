export interface PersistenceState {
  latestLastVisitedAt: string | null
  topicLastVisitedAt: Record<string, string>
  resolvedUpdateIds: string[]
  keptUpdateIds: string[]
  openedArticleIds: string[]
}

const STORAGE_KEY = 'catch-up-live-tracker-state'

const defaultState: PersistenceState = {
  latestLastVisitedAt: null,
  topicLastVisitedAt: {},
  resolvedUpdateIds: [],
  keptUpdateIds: [],
  openedArticleIds: [],
}

export function loadPersistenceState(): PersistenceState {
  if (typeof window === 'undefined') {
    return defaultState
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY)

  if (!rawValue) {
    return defaultState
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<PersistenceState>

    return {
      latestLastVisitedAt: parsedValue.latestLastVisitedAt ?? null,
      topicLastVisitedAt: parsedValue.topicLastVisitedAt ?? {},
      resolvedUpdateIds: parsedValue.resolvedUpdateIds ?? [],
      keptUpdateIds: parsedValue.keptUpdateIds ?? [],
      openedArticleIds: parsedValue.openedArticleIds ?? [],
    }
  } catch {
    return defaultState
  }
}

export function savePersistenceState(state: PersistenceState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
