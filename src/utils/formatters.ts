function pad(value: number) {
  return value.toString().padStart(2, '0')
}

export function formatArticleTimestamp(isoTimestamp: string) {
  const now = Date.now()
  const articleTime = new Date(isoTimestamp).getTime()
  const elapsedMs = Math.max(now - articleTime, 0)
  const elapsedSecs = Math.round(elapsedMs / 1000)
  const elapsedMins = Math.round(elapsedMs / 60_000)

  if (elapsedSecs < 60) {
    return `${Math.max(elapsedSecs, 1)}s ago`
  }

  if (elapsedMins < 60) {
    return `${elapsedMins}min ago`
  }

  if (elapsedMins < 24 * 60) {
    const hrs = Math.floor(elapsedMins / 60)
    const mins = elapsedMins % 60
    return mins > 0 ? `${hrs}h ${mins}min ago` : `${hrs}h ago`
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
