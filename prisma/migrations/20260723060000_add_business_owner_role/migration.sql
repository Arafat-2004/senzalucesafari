INSERT INTO admin_roles (
  id,
  name,
  "displayName",
  description,
  permissions,
  level,
  "isDefault",
  "createdAt"
)
VALUES (
  gen_random_uuid(),
  'business_owner',
  'Business Owner',
  'Full business operations access without developer-level security, role, or system administration privileges',
  '{"tours":["VIEW","CREATE","EDIT","DELETE"],"destinations":["VIEW","CREATE","EDIT","DELETE"],"bookings":["VIEW","CREATE","EDIT","CONFIRM","CANCEL"],"reviews":["VIEW","EDIT","APPROVE","DELETE"],"inquiries":["VIEW","EDIT","REPLY","DELETE"],"reports":["VIEW","EXPORT"],"analytics":["VIEW"]}'::jsonb,
  80,
  false,
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  "displayName" = EXCLUDED."displayName",
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions,
  level = EXCLUDED.level,
  "isDefault" = EXCLUDED."isDefault";
