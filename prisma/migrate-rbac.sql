-- ============================================
-- SENZA LUCE SAFARIS - RBAC & AUDIT MIGRATION
-- ============================================
-- Run this manually if prisma db push times out
-- psql -h your-host -U your-user -d your-database -f migrate-rbac.sql
-- ============================================

-- 1. Create Admin Roles Table
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    level INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar VARCHAR(500),
    role_id UUID NOT NULL REFERENCES admin_roles(id),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES admin_users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Admin Notifications Table
CREATE TABLE IF NOT EXISTS admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_role VARCHAR(100),
    target_user_id UUID,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url VARCHAR(500),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_roles_level ON admin_roles(level);
CREATE INDEX IF NOT EXISTS idx_admin_audit_user ON admin_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_entity ON admin_audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_timestamp ON admin_audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_admin_notif_type ON admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_admin_notif_read ON admin_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notif_created ON admin_notifications(created_at);

-- ============================================
-- SEED RBAC ROLES
-- ============================================

INSERT INTO admin_roles (id, name, display_name, description, permissions, level, is_default) VALUES
-- Super Admin - Full access
('11111111-1111-1111-1111-111111111111', 'super_admin', 'Super Admin', 'Full system access with all permissions', 
 '["TOURS_VIEW","TOURS_CREATE","TOURS_EDIT","TOURS_DELETE","DESTINATIONS_VIEW","DESTINATIONS_CREATE","DESTINATIONS_EDIT","DESTINATIONS_DELETE","BOOKINGS_VIEW","BOOKINGS_EDIT","BOOKINGS_CONFIRM","BOOKINGS_CANCEL","REVIEWS_VIEW","REVIEWS_EDIT","REVIEWS_APPROVE","INQUIRIES_VIEW","INQUIRIES_REPLY","USERS_VIEW","USERS_CREATE","USERS_EDIT","USERS_DELETE","SETTINGS_VIEW","SETTINGS_EDIT","REPORTS_VIEW","REPORTS_EXPORT","ANALYTICS_VIEW"]', 
 100, false),

-- Editor - Content management
('22222222-2222-2222-2222-222222222222', 'editor', 'Editor', 'Manage content, blog, reviews', 
 '["TOURS_VIEW","TOURS_CREATE","TOURS_EDIT","DESTINATIONS_VIEW","DESTINATIONS_CREATE","DESTINATIONS_EDIT","REVIEWS_VIEW","REVIEWS_EDIT","REVIEWS_APPROVE","INQUIRIES_VIEW","INQUIRIES_REPLY","REPORTS_VIEW","REPORTS_EXPORT"]', 
 50, false),

-- Sales - Booking management
('33333333-3333-3333-3333-333333333333', 'sales', 'Sales Agent', 'Handle bookings and inquiries', 
 '["TOURS_VIEW","DESTINATIONS_VIEW","BOOKINGS_VIEW","BOOKINGS_EDIT","BOOKINGS_CONFIRM","BOOKINGS_CANCEL","INQUIRIES_VIEW","INQUIRIES_REPLY","REPORTS_VIEW","REPORTS_EXPORT"]', 
 30, false),

-- Viewer - Read-only access
('44444444-4444-4444-4444-444444444444', 'viewer', 'Viewer', 'View-only access to reports and analytics', 
 '["TOURS_VIEW","DESTINATIONS_VIEW","BOOKINGS_VIEW","REVIEWS_VIEW","INQUIRIES_VIEW","REPORTS_VIEW","ANALYTICS_VIEW"]', 
 10, true)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- CREATE DEFAULT ADMIN USER (change password!)
-- ============================================
-- Password: Admin@2024 (bcrypt hash - CHANGE THIS!)
INSERT INTO admin_users (id, email, password_hash, first_name, last_name, role_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@senzaluce.com', '$2a$10$rQZQZQZQZQZQZQZQZQZQZep0O6O6O6O6O6O6O6O6O6O6O6O6O6O', 'System', 'Admin', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (email) DO NOTHING;

SELECT 'Migration complete!';
SELECT * FROM admin_roles;
SELECT * FROM admin_users;