import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const BCRYPT_ROUNDS = 12

async function createAdminUser() {
  const email = 'arafatmbaga@gmail.com'
  const password = 'Arafat@2004'

  // Hash password with bcrypt
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)
  console.log('Password hashed successfully')

  // Check if user already exists
  const existingUser = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() }
  })

  if (existingUser) {
    console.log('User already exists. Updating password...')
    
    // Update the password hash and reset any lockouts
    await prisma.adminUser.update({
      where: { email: email.toLowerCase() },
      data: {
        passwordHash,
        failedAttempts: 0,
        lockedUntil: null,
        isActive: true
      }
    })
    
    console.log('Password updated successfully!')
  } else {
    // Get or create default role (super_admin)
    let role = await prisma.adminRole.findFirst({
      where: { name: 'super_admin' }
    })

    if (!role) {
      console.log('Creating super_admin role...')
      role = await prisma.adminRole.create({
        data: {
          name: 'super_admin',
          displayName: 'Super Admin',
          level: 100,
          permissions: {}
        }
      })
      console.log('Super admin role created')
    }

    // Create the admin user
    await prisma.adminUser.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName: 'Arafat',
        lastName: "Mbag'a",
        roleId: role.id,
        isActive: true,
        failedAttempts: 0,
        lockedUntil: null
      }
    })

    console.log('Admin user created successfully!')
  }

  console.log('\nYou can now login with:')
  console.log(`Email: ${email}`)
  console.log('Password: Arafat@2004')
}

createAdminUser()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
