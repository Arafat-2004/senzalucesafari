import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'
import { decryptIntegrationSecret } from '@/lib/integration-secrets'

async function smtpConfiguration() {
  const settings = await prisma.appSettings.findFirst({ select: { siteTitle: true, smtpHost: true, smtpPort: true, smtpUsername: true, smtpPassword: true } })
  const host = settings?.smtpHost || process.env.SMTP_HOST
  const port = settings?.smtpPort || Number(process.env.SMTP_PORT || 587)
  const user = settings?.smtpUsername || process.env.SMTP_USER
  const password = decryptIntegrationSecret(settings?.smtpPassword) || process.env.SMTP_PASS
  if (!host || !port || !user || !password) throw new Error('Save the SMTP host, port, username, and password first.')
  return { settings, host, port, user, password }
}

export async function createSmtpTransport() {
  const config = await smtpConfiguration()
  const transport = nodemailer.createTransport({ host: config.host, port: config.port, secure: config.port === 465, requireTLS: config.port !== 465, auth: { user: config.user, pass: config.password }, connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000 })
  return { transport, config }
}

export async function verifySmtpConnection() {
  const { transport, config } = await createSmtpTransport()
  await transport.verify()
  return { host: config.host, port: config.port, username: config.user }
}

export async function sendSmtpEmail(input: { to: string; subject: string; html: string; from?: string }) {
  const { transport, config } = await createSmtpTransport()
  const result = await transport.sendMail({ from: input.from || `${config.settings?.siteTitle || 'Senza Luce Safaris'} <${config.user}>`, to: input.to, subject: input.subject, html: input.html })
  return result.messageId
}
