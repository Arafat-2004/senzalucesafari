const bcrypt = require('bcrypt')
const password = 'Arafat@2004'

bcrypt.hash(password, 12).then(hash => {
  console.log('=== BCRYPT HASH ===')
  console.log(hash)
  console.log('===================')
  console.log('\nRun this SQL in Supabase SQL Editor:')
  console.log(`
-- Update existing user or insert new one
INSERT INTO admin_users (id, email, "passwordHash", "firstName", "lastName", "roleId", "isActive", "failedAttempts", "lockedUntil", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'arafatmbaga@gmail.com',
  '${hash}',
  'Arafat',
  'Mbag''a',
  (SELECT id FROM admin_roles WHERE name = 'super_admin' LIMIT 1),
  true,
  0,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  "passwordHash" = '${hash}',
  "failedAttempts" = 0,
  "lockedUntil" = NULL,
  "isActive" = true;
`)
}).catch(console.error)
