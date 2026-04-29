declare module 'speakeasy' {
  interface Secret {
    ascii: string
    base32: string
    hex: string
  }

  interface TotpOptions {
    secret?: string
    label?: string
    issuer?: string
    algorithm?: 'sha1' | 'sha256' | 'sha512'
    digits?: 6 | 8
    step?: number
    type?: 'totp' | 'hotp'
  }

  interface VerifyOptions {
    secret: string
    encoding?: string
    token: string
    algorithm?: 'sha1' | 'sha256' | 'sha512'
    digits?: 6 | 8
    step?: number
    window?: number
  }

  export function generateSecret(options?: { name?: string; length?: number }): Secret
  export function otpauthURL(options: TotpOptions): string
  export function totp(options: TotpOptions): string

  export const totp: {
    verify(options: VerifyOptions): boolean
  }

  export const hotp: {
    verify(options: { secret: string; counter: number } & TotpOptions): boolean
  }

  export default {
    generateSecret,
    otpauthURL,
    totp,
    totp,
    hotp,
  }
}