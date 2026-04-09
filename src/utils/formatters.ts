function pad(value: number) {
  return value.toString().padStart(2, '0')
}

export function formatArticleTimestamp(isoTimestamp: string) {
  const now = Date.now()
  const articleTime = new Date(isoTimestamp).getTime()
  const elapsedMinutes = Math.max(Math.round((now - articleTime) / 60_000), 0)

  if (elapsedMinutes < 60) {
    return `${Math.max(elapsedMinutes, 1)}m ago`
  }

  if (elapsedMinutes < 24 * 60) {
    return `${Math.round(elapsedMinutes / 60)}h ago`
  }

  const articleDate = new Date(isoTimestamp)

  return `${articleDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} ${pad(articleDate.getHours())}:${pad(articleDate.getMinutes())}`
}

export function formatFreshnessLabel(isoTimestamp: string) {
  const now = Date.now()
  const refreshedTime = new Date(isoTimestamp).getTime()
  const elapsedSeconds = Math.max(Math.round((now - refreshedTime) / 1000), 0)

  if (elapsedSeconds < 45) {
    return 'Updated just now'
  }

  if (elapsedSeconds < 3600) {
    return `Updated ${Math.round(elapsedSeconds / 60)}m ago`
  }

  const refreshedDate = new Date(isoTimestamp)

  return `Updated at ${pad(refreshedDate.getHours())}:${pad(refreshedDate.getMinutes())}`
}
