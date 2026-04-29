"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showToast } from '@/lib/ui/toast';
import { AlertTriangle, Save, RotateCcw } from 'lucide-react';

interface PasswordPolicy {
  minLength?: number;
  requireUppercase?: boolean;
  requireNumbers?: boolean;
  requireSpecial?: boolean;
  expiryDays?: number;
}

interface FeatureFlags {
  tours?: boolean;
  bookings?: boolean;
  destinations?: boolean;
  blog?: boolean;
  newsletter?: boolean;
  reviews?: boolean;
}

type AppSettings = {
  id?: string;
  siteTitle?: string;
  siteUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  theme?: string;
  primaryColor?: string;
  timezone?: string;
  currency?: string;
  signupEnabled?: boolean;
  mfaRequired?: boolean;
  passwordPolicy?: PasswordPolicy;
  sessionExpiration?: number;
  allowedDomains?: string[];
  dataRetentionDays?: number;
  backupsEnabled?: boolean;
  backupSchedule?: string;
  featureFlags?: FeatureFlags;
  environment?: string;
};

type Role = {
  id: string;
  name: string;
  permissions: Record<string, string[]>;
};

type AuditEntry = {
  id: string;
  action: string;
  timestamp: string;
  changedAt?: string;
  user?: string;
  details?: string;
  changes?: Record<string, unknown>;
};

export default function AdminSettingsPage(_props: Record<string, never>) {
  const [settings, setSettings] = useState<AppSettings>({
    siteTitle: 'Senza Luce Safaris',
    siteUrl: 'https://example.com',
    theme: 'SYSTEM',
    timezone: 'UTC',
    currency: 'USD',
    signupEnabled: true,
    mfaRequired: false,
    sessionExpiration: 60,
    backupsEnabled: false,
    environment: 'production',
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);

  // Load current settings on mount (server-side would be preferred, but for prototyping this is client-driven)
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data: unknown) => {
        setSettings((s) => ({ ...s, ...(data as AppSettings) }));
      })
      .catch(() => {});
    fetch('/api/settings/roles')
      .then((r) => r.json())
      .then((data: unknown) => {
        const response = data as { success?: boolean; data?: Role[] };
        setRoles(Array.isArray(response?.data) ? response.data : []);
      })
      .catch(() => setRoles([]));
    fetch('/api/settings/history')
      .then((r) => r.json())
      .then((data: unknown) => {
        const response = data as { success?: boolean; data?: AuditEntry[] };
        setAudit(Array.isArray(response?.data) ? response.data : []);
      })
      .catch(() => setAudit([]));
  }, []);

  const saveSettings = async () => {
    const resp = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (resp.ok) {
      showToast('Settings saved', { type: 'success' });
    } else {
      showToast('Failed to save settings', { type: 'error' });
    }
  };

  const addRole = async () => {
    const name = (document.getElementById('new-role-name') as HTMLInputElement)?.value;
    const perms = (document.getElementById('new-role-permissions') as HTMLTextAreaElement)?.value;
    if (!name) return;
    const res = await fetch('/api/settings/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, permissions: JSON.parse(perms || '{}') }),
    });
    if (res.ok) {
      const r = await res.json();
      setRoles((rs) => [...rs, r]);
      showToast('Role created', { type: 'success' });
    } else {
      showToast('Failed to create role', { type: 'error' });
    }
  };

  const updateRole = async (id: string, patch: Partial<Role>) => {
    const res = await fetch(`/api/settings/roles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const updated = await res.json();
      setRoles((rs) => rs.map((r) => (r.id === id ? updated : r)));
      showToast('Role updated', { type: 'success' });
    } else {
      showToast('Failed to update role', { type: 'error' });
    }
  };

  return (
    <main className="container mx-auto py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-6xl">
      <div className="flex items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Admin Settings</h1>
      </div>

      {/* General */}
      <section className="p-4 sm:p-6 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">General</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="siteTitle">Site Title</Label>
            <Input 
              id="siteTitle"
              value={settings.siteTitle ?? ''} 
              onChange={e => setSettings({ ...settings, siteTitle: e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteUrl">Site URL</Label>
            <Input 
              id="siteUrl"
              value={settings.siteUrl ?? ''} 
              onChange={e => setSettings({ ...settings, siteUrl: e.target.value })} 
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select 
              value={settings.theme === null ? 'SYSTEM' : (settings.theme || 'SYSTEM')} 
              onValueChange={v => setSettings({ ...settings, theme: v as AppSettings['theme'] })}
            >
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LIGHT">Light</SelectItem>
                <SelectItem value="DARK">Dark</SelectItem>
                <SelectItem value="SYSTEM">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input 
              id="timezone"
              value={settings.timezone ?? ''} 
              onChange={e => setSettings({ ...settings, timezone: e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input 
              id="currency"
              value={settings.currency ?? ''} 
              onChange={e => setSettings({ ...settings, currency: e.target.value })} 
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="primaryColor"
                type="color" 
                className="w-12 h-10 p-1 cursor-pointer"
                value={settings.primaryColor ?? '#0d6efd'} 
                onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} 
              />
              <span className="text-sm text-muted-foreground font-mono">{settings.primaryColor ?? '#0d6efd'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 h-10">
            <Checkbox 
              id="signupEnabled" 
              checked={!!settings.signupEnabled} 
              onCheckedChange={e => setSettings({ ...settings, signupEnabled: !!e })} 
            />
            <Label htmlFor="signupEnabled" className="font-normal">Enable signup by default</Label>
          </div>
        </div>
      </section>

      {/* Environment */}
      <section className="p-4 sm:p-6 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Environment</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="environment">Current Environment</Label>
            <Select 
              value={settings.environment === null ? 'production' : (settings.environment || 'production')} 
              onValueChange={v => setSettings({ ...settings, environment: v as AppSettings['environment'] })}
            >
              <SelectTrigger id="environment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="allowedDomains">Allowed Domains (comma-separated)</Label>
            <Input 
              id="allowedDomains"
              placeholder="example.com, sub.example.com"
              value={settings.allowedDomains?.join(', ') ?? ''} 
              onChange={e => setSettings({ ...settings, allowedDomains: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} 
            />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="p-4 sm:p-6 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Security & Access</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 h-10">
            <Checkbox 
              id="mfaRequired" 
              checked={!!settings.mfaRequired} 
              onCheckedChange={e => setSettings({ ...settings, mfaRequired: !!e })} 
            />
            <Label htmlFor="mfaRequired" className="font-normal">MFA Required</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionExpiration">Session Expiration (min)</Label>
            <Input 
              id="sessionExpiration"
              type="number" 
              value={settings.sessionExpiration ?? 60} 
              onChange={e => setSettings({ ...settings, sessionExpiration: Number(e.target.value) })} 
            />
          </div>
          <div className="space-y-2 sm:col-span-1 lg:col-span-1">
            <Label htmlFor="passwordPolicy">Password Policy (JSON)</Label>
            <Textarea 
              id="passwordPolicy"
              className="font-mono text-xs min-h-[80px]"
              value={JSON.stringify(settings.passwordPolicy ?? {}, null, 2)} 
              onChange={e => {
                try {
                  const v = JSON.parse(e.target.value)
                  setSettings({ ...settings, passwordPolicy: v })
                } catch {
                }
              }} 
            />
          </div>
        </div>
      </section>

      {/* Roles & Permissions */}
      <section className="p-4 sm:p-6 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Roles & Permissions</h2>
        <p className="text-sm text-muted-foreground mb-4">Configure roles and their permissions. Use the matrix below to grant access per resource.</p>
        <div className="space-y-4">
          {Array.isArray(roles) && roles.map(r => (
            <div key={r.id} className="border rounded p-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="font-semibold">{r.name}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    const newName = prompt('Rename role', r.name);
                    if (newName) updateRole(r.id, { name: newName });
                  }}>Rename</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={async () => {
                    if (confirm('Delete role ' + r.name + '?')) {
                      const res = await fetch(`/api/settings/roles/${r.id}`, { method: 'DELETE' });
                      if (res.ok) { setRoles(roles.filter(role => role.id !== r.id)); showToast('Role deleted', { type: 'info' }); }
                      else showToast('Failed to delete role', { type: 'error' });
                    }
                  }}>Delete</Button>
                </div>
              </div>
              <div className="text-xs bg-muted/20 rounded p-2 mt-1 font-mono overflow-x-auto" style={{ maxHeight: 100, overflow: 'auto' }}>
                {JSON.stringify(r.permissions, null, 2)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold mb-2">Add New Role</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-role-name">Role name</Label>
              <Input id="new-role-name" placeholder="Role name (e.g., Editor)" />
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">Permissions JSON</div>
          <Textarea id="new-role-permissions" className="mt-1 font-mono text-xs" rows={3} defaultValue='{"tours": ["read","write"], "bookings": ["read"], "destinations": ["read"]}' />
          <Button className="mt-2 btn-safari" onClick={addRole}>Create Role</Button>
        </div>
      </section>

      {/* Integrations */}
      <section className="p-4 sm:p-6 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Integrations</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input id="smtpHost" placeholder="smtp.example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input id="smtpPort" type="number" placeholder="587" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpUsername">SMTP Username</Label>
            <Input id="smtpUsername" placeholder="user@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpPassword">SMTP Password</Label>
            <Input id="smtpPassword" type="password" placeholder="••••••••" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={async () => {
            try {
              const res = await fetch('/api/settings/smtp-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ host: 'smtp.example.com', port: 587 }),
              });
              const data = await res.json();
              if (data.ok) showToast('SMTP test passed', { type: 'success' });
              else showToast('SMTP test failed', { type: 'error' });
            } catch { showToast('SMTP test error', { type: 'error' }); }
          }}>Test SMTP</Button>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input id="webhookUrl" placeholder="https://hooks.example.com/notify" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhookSecret">Webhook Secret</Label>
            <Input id="webhookSecret" type="password" placeholder="whsec_..." />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={async () => {
            try {
              const res = await fetch('/api/settings/webhook-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: 'https://hooks.example.com/notify' }),
              });
              const data = await res.json();
              if (data.ok) showToast('Webhook test passed', { type: 'success' });
              else showToast('Webhook test failed', { type: 'error' });
            } catch { showToast('Webhook test error', { type: 'error' }); }
          }}>Test Webhook</Button>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="analyticsId">Analytics ID</Label>
            <Input id="analyticsId" placeholder="G-XXXXXXXXXX" />
          </div>
          <div className="flex items-center gap-2 h-10">
            <Checkbox id="analyticsEnabled" />
            <Label htmlFor="analyticsEnabled" className="font-normal">Analytics Enabled</Label>
          </div>
        </div>
      </section>

      {/* Feature Flags */}
      <section className="p-4 sm:p-6 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Feature Flags</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="flagTours" 
              checked={settings.featureFlags?.tours ?? true} 
              onCheckedChange={e => setSettings({ ...settings, featureFlags: { ...settings.featureFlags, tours: !!e } })} 
            />
            <Label htmlFor="flagTours" className="font-normal">Enable Tours</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="flagBookings" 
              checked={settings.featureFlags?.bookings ?? true} 
              onCheckedChange={e => setSettings({ ...settings, featureFlags: { ...settings.featureFlags, bookings: !!e } })} 
            />
            <Label htmlFor="flagBookings" className="font-normal">Enable Bookings</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="flagDestinations" 
              checked={settings.featureFlags?.destinations ?? true} 
              onCheckedChange={e => setSettings({ ...settings, featureFlags: { ...settings.featureFlags, destinations: !!e } })} 
            />
            <Label htmlFor="flagDestinations" className="font-normal">Enable Destinations</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="flagBlog" 
              checked={settings.featureFlags?.blog ?? true} 
              onCheckedChange={e => setSettings({ ...settings, featureFlags: { ...settings.featureFlags, blog: !!e } })} 
            />
            <Label htmlFor="flagBlog" className="font-normal">Enable Blog</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="flagNewsletter" 
              checked={settings.featureFlags?.newsletter ?? true} 
              onCheckedChange={e => setSettings({ ...settings, featureFlags: { ...settings.featureFlags, newsletter: !!e } })} 
            />
            <Label htmlFor="flagNewsletter" className="font-normal">Enable Newsletter</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="flagReviews" 
              checked={settings.featureFlags?.reviews ?? true} 
              onCheckedChange={e => setSettings({ ...settings, featureFlags: { ...settings.featureFlags, reviews: !!e } })} 
            />
            <Label htmlFor="flagReviews" className="font-normal">Enable Reviews</Label>
          </div>
        </div>
      </section>

      {/* Data Governance */}
      <section className="p-4 sm:p-6 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Data Governance</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataRetention">Retention (days)</Label>
            <Input 
              id="dataRetention"
              type="number" 
              value={settings.dataRetentionDays ?? 365} 
              onChange={e => setSettings({ ...settings, dataRetentionDays: Number(e.target.value) })} 
            />
          </div>
          <div className="flex items-center gap-2 h-10">
            <Checkbox 
              id="backupsEnabled" 
              checked={!!settings.backupsEnabled} 
              onCheckedChange={e => setSettings({ ...settings, backupsEnabled: !!e })} 
            />
            <Label htmlFor="backupsEnabled" className="font-normal">Enable Backups</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="backupSchedule">Backup Schedule</Label>
            <Input 
              id="backupSchedule"
              value={settings.backupSchedule ?? ''} 
              onChange={e => setSettings({ ...settings, backupSchedule: e.target.value })} 
            />
          </div>
        </div>
      </section>

      {/* Audit Trail */}
      <section className="p-4 sm:p-6 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Audit Trail</h2>
        <div className="max-h-48 overflow-auto border rounded p-3 bg-muted/30">
          {!Array.isArray(audit) || audit.length === 0 ? (
            <div className="text-sm text-muted-foreground">No audit records yet.</div>
          ) : (
            audit.map((a, idx) => (
              <div key={idx} className="text-xs border-b border-border py-2 last:pb-0 last:border-0">
                {a.changedAt ?? a.timestamp} - {a.changes ? JSON.stringify(a.changes) : ''}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <Button onClick={saveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
        <Button variant="outline" onClick={() => window?.location?.reload?.()}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reload
        </Button>
      </section>
    </main>
  )
}
