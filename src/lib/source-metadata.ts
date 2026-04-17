export function normalizeUrl(rawUrl: string) {
  try {
    return new URL(rawUrl).toString()
  } catch {
    try {
      return new URL(`https://${rawUrl}`).toString()
    } catch {
      return ''
    }
  }
}

export function getHostname(rawUrl: string) {
  try {
    const parsedUrl = new URL(rawUrl)
    return parsedUrl.hostname
  } catch {
    try {
      const parsedUrl = new URL(`https://${rawUrl}`)
      return parsedUrl.hostname
    } catch {
      return ''
    }
  }
}

export function buildFaviconUrl(rawUrl: string) {
  const hostname = getHostname(rawUrl)
  if (!hostname) return ''
  return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
}

export function fallbackTitleFromUrl(rawUrl: string) {
  const normalizedUrl = normalizeUrl(rawUrl)
  if (!normalizedUrl) return rawUrl

  try {
    const parsedUrl = new URL(normalizedUrl)
    const pathChunks = parsedUrl.pathname.split('/').filter(Boolean)
    const lastPathChunk = pathChunks[pathChunks.length - 1]

    if (lastPathChunk) {
      const readableSlug = decodeURIComponent(lastPathChunk)
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      if (readableSlug) return readableSlug
    }

    return parsedUrl.hostname.replace(/^www\./, '')
  } catch {
    return rawUrl
  }
}

export async function fetchSourceTitle(rawUrl: string) {
  const normalizedUrl = normalizeUrl(rawUrl)
  if (!normalizedUrl) return null

  try {
    const response = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(
        normalizedUrl,
      )}&meta=false&screenshot=false&audio=false&video=false&palette=false`,
    )
    if (!response.ok) return null

    const payload: { data?: { title?: string } } = await response.json()
    const title = payload.data?.title?.trim()
    return title || null
  } catch {
    return null
  }
}
