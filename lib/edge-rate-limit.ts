type Bucket = {
  count: number
  resetAt: number
}

type Rule = {
  windowMs: number
  max: number
}

const RULES: Record<string, Rule> = {
  '/api/linkedin/token': { windowMs: 15 * 60 * 1000, max: 20 },
  '/api/donations/stripe/checkout': { windowMs: 60 * 1000, max: 30 },
  '/api/jobs': { windowMs: 60 * 1000, max: 120 },
}

const store = new Map<string, Bucket>()

function getClientIp(headers: Headers) {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}

export function checkEdgeRateLimit(pathname: string, headers: Headers) {
  const rule = RULES[pathname]
  if (!rule) {
    return { limited: false as const }
  }

  const ip = getClientIp(headers)
  const now = Date.now()
  const key = `${pathname}:${ip}`

  const current = store.get(key)
  if (!current || now > current.resetAt) {
    store.set(key, { count: 1, resetAt: now + rule.windowMs })
    return { limited: false as const }
  }

  if (current.count >= rule.max) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    return { limited: true as const, retryAfter }
  }

  current.count += 1
  store.set(key, current)
  return { limited: false as const }
}
