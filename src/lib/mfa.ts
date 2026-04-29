import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { createCipher, createDecipher } from './crypto'

const MFA_ISSUER = 'Senza Luce Safaris'

export interface MFASetupData {
  secret: string
  qrCodeDataUrl: string
  otpauthUrl: string
}

export interface BackupCodeData {
  codes: string[]
  hashedCodes: string[]
}

export function generateMFAUri(email: string, secret: string): string {
  return speakeasy.otpauthURL({
    secret,
    label: email,
    issuer: MFA_ISSUER,
    algorithm: 'sha512',
    digits: 6,
    step: 30,
    type: 'totp',
  })
}

export async function generateMFAQRCode(email: string, secret: string): Promise<string> {
  const otpauthUrl = generateMFAUri(email, secret)
  return QRCode.toDataURL(otpauthUrl, {
    width: 200,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  })
}

export function generateMFASecret(): string {
  return speakeasy.generateSecret({
    name: MFA_ISSUER,
    length: 20,
  }).base32
}

export function verifyMFAToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    algorithm: 'sha512',
    digits: 6,
    step: 30,
    window: 1,
  })
}

export function generateBackupCodes(count: number = 10): BackupCodeData {
  const codes: string[] = []
  const hashedCodes: string[] = []

  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    codes.push(code)
    hashedCodes.push(hashCode(code))
  }

  return { codes, hashedCodes }
}

function hashCode(code: string): string {
  let hash = 0
  for (let i = 0; i < code.length; i++) {
    const char = code.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).toUpperCase()
}

export function verifyBackupCode(hashedCodes: string[], code: string): boolean {
  const hash = hashCode(code.toUpperCase().replace(/[^A-Z0-9]/g, ''))
  const index = hashedCodes.indexOf(hash)
  return index !== -1
}

export function invalidateBackupCode(hashedCodes: string[], code: string): string[] {
  const hash = hashCode(code.toUpperCase().replace(/[^A-Z0-9]/g, ''))
  return hashedCodes.filter(c => c !== hash)
}

export async function encryptMFASecret(secret: string, key?: string): Promise<string> {
  const encryptionKey = key || process.env.MFA_ENCRYPTION_KEY || 'default-key-change-me'
  return createCipher(secret, encryptionKey)
}

export async function decryptMFASecret(encrypted: string, key?: string): Promise<string> {
  const encryptionKey = key || process.env.MFA_ENCRYPTION_KEY || 'default-key-change-me'
  return createDecipher(encrypted, encryptionKey)
}