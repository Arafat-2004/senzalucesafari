# 🔑 Admin Accounts Directory & Login Guide
### Senza Luce Safaris — System Credentials & Access Levels

This document lists the default seeded administrator accounts, their access credentials, and their respective operational roles on the platform.

> [!WARNING]
> These credentials are seeded for default system initialization. In a production environment, administrators should log in and immediately update their passwords or enable Multi-Factor Authentication (MFA) under the **Security** tab in the dashboard.

---

## 1. Access Credentials Directory

| Administrator Email | Default Password | Assigned Role | Access Level | Primary Department |
| :--- | :--- | :--- | :---: | :--- |
| **info@senzalucesafari.com** | `SenzaExecutive2026!` | Super Admin | 100 (Max) | Executive & System Settings |
| **arafatmbaga@gmail.com** | `Arafat@2004` | Super Admin | 100 (Max) | Executive & System Settings |
| **bookings@senzalucesafari.com** | `SenzaReservations2026!` | Booking Manager | 80 | Reservations Office |
| **support@senzalucesafari.com** | `SenzaSupport2026!` | Support Manager | 60 | Customer Care |
| **hello@senzalucesafari.com** | `SenzaMarketing2026!` | Marketing Manager | 50 | Sales & Marketing |
| **contact@senzalucesafari.com** | `SenzaContact2026!` | Contact Manager | 40 | Public Contact Inbox |

---

## 2. Role Explanations & Security Clearances

### A. Super Admin (Level 100)
- **Primary Users**: `info@senzalucesafari.com`, `arafatmbaga@gmail.com`
- **Capabilities**: Full access to all administrative features. Only Super Admins can access general site settings (e.g. currency, site URL, allowed domains), configure SMTP configurations, modify role definitions, view system audit logs, and override Multi-Factor Authentication setups.

### B. Booking Manager (Level 80)
- **Primary Users**: `bookings@senzalucesafari.com`
- **Capabilities**: Can manage booking schedules, accept/cancel customer reservations, assign tour guides, update tour package descriptions, and edit destination guides. Blocked from system and server integrations.

### C. Support Manager (Level 60)
- **Primary Users**: `support@senzalucesafari.com`
- **Capabilities**: Responsible for customer communication. Can view all enquiries, reply directly to visitors, manage guide details, and view public reviews.

### D. Marketing & Contact Manager (Level 50 / 40)
- **Primary Users**: `hello@senzalucesafari.com`, `contact@senzalucesafari.com`
- **Capabilities**: Designed for content updates and inquiry routing. Can write blog articles, upload fleet details, and reply to general contact form submissions.

---

## 3. How to Log In

1. Open your web browser and navigate to:
   `https://senzalucesafari.com/admin/login` (or `http://localhost:3000/admin/login` for local development).
2. Enter the designated **Email Address** and **Default Password** from the table above.
3. Click the **Sign In** button.
4. If MFA (Multi-Factor Authentication) has been enabled for your account, you will be prompted to scan a QR code (first-time setup) or enter the 6-digit code from your authenticator app.
