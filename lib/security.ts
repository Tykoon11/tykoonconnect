import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// Create DOM purify instance for server-side use
const window = new JSDOM('').window
const purify = DOMPurify(window)

export function sanitizeHtml(html: string): string {
  return purify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    KEEP_CONTENT: true,
  })
}

export function sanitizeText(text: string): string {
  // Basic text sanitization - remove control characters, normalize whitespace
  return text
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

// Content moderation keywords - basic scam detection
const SUSPICIOUS_KEYWORDS = [
  'send money first',
  'pay upfront',
  'wire transfer',
  'western union',
  'moneygram',
  'bitcoin payment',
  'cryptocurrency only',
  'no escrow',
  'outside platform',
  'contact me offsite',
  'email me directly',
  'whatsapp me',
  'telegram me',
  'guaranteed money',
  'easy money fast',
  'work from home guaranteed',
  'no experience needed high pay',
]

export function detectSuspiciousContent(text: string): {
  isSuspicious: boolean
  matchedKeywords: string[]
  confidence: number
} {
  const lowerText = text.toLowerCase()
  const matchedKeywords = SUSPICIOUS_KEYWORDS.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  )

  const confidence = matchedKeywords.length / SUSPICIOUS_KEYWORDS.length
  const isSuspicious = matchedKeywords.length > 0 || confidence > 0.1

  return {
    isSuspicious,
    matchedKeywords,
    confidence
  }
}

export function validateFileUpload(file: {
  name: string
  type: string
  size: number
}): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large (max 10MB)' }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' }
  }

  // Basic filename validation
  if (!/^[a-zA-Z0-9._-]+$/.test(file.name.replace(/\.[^/.]+$/, ''))) {
    return { valid: false, error: 'Invalid filename characters' }
  }

  return { valid: true }
}

export function generateHandle(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20)
    .replace(/^[0-9]/, 'u') // Can't start with number
    || `user${Date.now().toString().slice(-6)}`
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function validateHandle(handle: string): { valid: boolean; error?: string } {
  if (handle.length < 3) {
    return { valid: false, error: 'Handle must be at least 3 characters' }
  }
  
  if (handle.length > 30) {
    return { valid: false, error: 'Handle must be less than 30 characters' }
  }
  
  if (!/^[a-z0-9_-]+$/.test(handle)) {
    return { valid: false, error: 'Handle can only contain lowercase letters, numbers, hyphens, and underscores' }
  }
  
  if (/^[0-9]/.test(handle)) {
    return { valid: false, error: 'Handle cannot start with a number' }
  }

  const reservedHandles = [
    'admin', 'api', 'www', 'mail', 'support', 'help', 'about', 'contact',
    'terms', 'privacy', 'jobs', 'login', 'signup', 'auth', 'oauth',
    'dashboard', 'profile', 'settings', 'messages', 'notifications',
    'tykoon', 'tykoonconnect', 'moderator', 'staff'
  ]
  
  if (reservedHandles.includes(handle)) {
    return { valid: false, error: 'This handle is reserved' }
  }

  return { valid: true }
}

export async function auditLog(
  actorId: string | null,
  action: string,
  targetType: string,
  targetId: string,
  meta?: any
) {
  try {
    const { prisma } = await import('./prisma')
    
    await prisma.auditLog.create({
      data: {
        actorId,
        action,
        targetType,
        targetId,
        meta: meta || null
      }
    })
  } catch (error) {
    console.error('Failed to write audit log:', error)
    // Don't throw - audit logging failures shouldn't break the main operation
  }
}