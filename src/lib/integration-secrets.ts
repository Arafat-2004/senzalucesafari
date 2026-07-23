import { createCipher, createDecipher } from '@/lib/crypto'

const PREFIX = 'enc:v1:'
export const SECRET_MASK = '••••••••'

function encryptionKey(): string {
  const key = process.env.SETTINGS_ENCRYPTION_KEY || process.env.MFA_ENCRYPTION_KEY
  if (!key) throw new Error('SETTINGS_ENCRYPTION_KEY is not configured')
  return key
}

export function encryptIntegrationSecret(value: string): string {
  if (!value || value.startsWith(PREFIX)) return value
  return `${PREFIX}${createCipher(value, encryptionKey())}`
}

export function decryptIntegrationSecret(value?: string | null): string | undefined {
  if (!value) return undefined
  if (!value.startsWith(PREFIX)) return value
  return createDecipher(value.slice(PREFIX.length), encryptionKey())
}

export function isSecretMask(value: unknown): boolean {
  return typeof value === 'string' && (value === SECRET_MASK || value.length >= 8 && !/[A-Za-z0-9]/.test(value))
}
