import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'

const prisma = new PrismaClient()

async function verifyUser() {
  const user = await prisma.adminUser.findUnique({
    where: { email: 'arafatmbaga@gmail.com' },
    include: { role: true }
  })

  if (!user) {
    console.log('User NOT found!')
    return
  }

  console.log('User found:')
  console.log('  ID:', user.id)
  console.log('  Email:', user.email)
  console.log('  isActive:', user.isActive)
  console.log('  failedAttempts:', user.failedAttempts)
  console.log('  lockedUntil:', user.lockedUntil)
  console.log('  mfaEnabled:', user.mfaEnabled)
  console.log('  Role:', user.role.name, '(level:', user.role.level, ')')
  console.log('  Password hash starts with:', user.passwordHash.substring(0, 20))
}

verifyUser()
  .catch(e => console.error('Error:', e))
  .finally(() => prisma.$disconnect())
