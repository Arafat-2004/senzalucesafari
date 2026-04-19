"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/ui/toast';

type AppSettings = {
  id?: string;
  siteTitle?: string;
  siteUrl?: string;
  theme?: string;
  timezone?: string;
  currency?: string;
  signupEnabled?: boolean;
  mfaRequired?: boolean;
  passwordPolicy?: any;
  sessionExpiration?: number;
  allowedDomains?: string[];
  dataRetentionDays?: number;
  backupsEnabled?: boolean;
  backupSchedule?: string;
  featureFlags?: any;
  environment?: string;
};

type Role = {
  id: string;
  name: string;
  permissions: any;
};

export default function AdminSettingsPage({}: {}) {
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
  const [audit, setAudit] = useState<any[]>([]);

  // Load current settings on mount (server-side would be preferred, but for prototyping this is client-driven)
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings((s) => ({ ...s, ...(data as AppSettings) }));
      })
      .catch(() => {});
    fetch('/api/settings/roles')
      .then((r) => r.json())
      .then((data) => setRoles((data ?? []) as Role[]))
      .catch(() => {});
    fetch('/api/settings/history')
      .then((r) => r.json())
      .then((data) => setAudit(data as any[]))
      .catch(() => {});
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
    <main className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold">Admin Settings</h1>

      {/* General */}
      <section className="p-4 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">General</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-muted-foreground">Site Title</span>
            <input className="mt-1 w-full border rounded px-3 py-2" value={settings.siteTitle ?? ''} onChange={e => setSettings({ ...settings, siteTitle: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Site URL</span>
            <input className="mt-1 w-full border rounded px-3 py-2" value={settings.siteUrl ?? ''} onChange={e => setSettings({ ...settings, siteUrl: e.target.value })} />
          </label>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-2">
          <label className="block col-span-1">
            <span className="text-sm text-muted-foreground">Theme</span>
            <select className="mt-1 w-full border rounded px-3 py-2" value={settings.theme ?? 'SYSTEM'} onChange={e => setSettings({ ...settings, theme: e.target.value })}>
              <option value="LIGHT">Light</option>
              <option value="DARK">Dark</option>
              <option value="SYSTEM">System</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Timezone</span>
            <input className="mt-1 w-full border rounded px-3 py-2" value={settings.timezone ?? ''} onChange={e => setSettings({ ...settings, timezone: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Currency</span>
            <input className="mt-1 w-full border rounded px-3 py-2" value={settings.currency ?? ''} onChange={e => setSettings({ ...settings, currency: e.target.value })} />
          </label>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          <label className="block">
            <span className="text-sm text-muted-foreground">Primary Color</span>
            <input type="color" className="mt-1 w-20 h-9 border rounded" value={settings.primaryColor ?? '#0d6efd'} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Signed up by default</span>
            <input type="checkbox" checked={!!settings.signupEnabled} onChange={e => setSettings({ ...settings, signupEnabled: e.target.checked })} />
          </label>
        </div>
      </section>

      {/* Environment */}
      <section className="p-4 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Environment</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-muted-foreground">Current Environment</span>
            <select className="mt-1 w-full border rounded px-3 py-2" value={settings.environment ?? 'production'} onChange={e => setSettings({ ...settings, environment: e.target.value })}>
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Allowed Domains (comma-separated)</span>
            <input className="mt-1 w-full border rounded px-3 py-2" value={settings.allowedDomains?.join(', ') ?? ''} onChange={e => setSettings({ ...settings, allowedDomains: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
          </label>
        </div>
      </section>

      {/* Security */}
      <section className="p-4 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Security & Access</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm text-muted-foreground">MFA Required</span>
            <input type="checkbox" checked={!!settings.mfaRequired} onChange={e => setSettings({ ...settings, mfaRequired: e.target.checked })} />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Session Expiration (min)</span>
            <input className="mt-1 w-full border rounded px-3 py-2" type="number" value={settings.sessionExpiration ?? 60} onChange={e => setSettings({ ...settings, sessionExpiration: Number(e.target.value) })} />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Password Policy (JSON)</span>
            <textarea className="mt-1 w-full border rounded px-3 py-2" rows={3} value={JSON.stringify(settings.passwordPolicy ?? {}, null, 2)} onChange={e => {
              try {
                const v = JSON.parse(e.target.value)
                setSettings({ ...settings, passwordPolicy: v })
              } catch {
                // ignore invalid json during edit
              }
            }} />
          </label>
        </div>
      </section>

      {/* Roles & Permissions */}
      <section className="p-4 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Roles & Permissions</h2>
        <p className="text-sm text-muted-foreground mb-4">Configure roles and their permissions. Use the matrix below to grant access per resource.</p>
        <div className="space-y-4">
          {roles.map(r => (
            <div key={r.id} className="border rounded p-3">
              <div className="flex items-center justify-between mb-2">
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
              <div className="text-xs bg-muted/20 rounded p-2 mt-1" style={{ maxHeight: 100, overflow: 'auto' }}>
                {JSON.stringify(r.permissions, null, 2)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold mb-2">Add New Role</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input id="new-role-name" placeholder="Role name (e.g., Editor)" className="border rounded px-3 py-2 w-full" />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">Permissions JSON</div>
          <textarea id="new-role-permissions" className="border rounded px-3 py-2 w-full mt-1" rows={3} defaultValue='{"tours": ["read","write"], "bookings": ["read"], "destinations": ["read"]}' />
          <Button className="mt-2 btn-safari" onClick={addRole}>Create Role</Button>
        </div>
      </section>

      {/* Integrations */}
      <section className="p-4 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Integrations</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-muted-foreground">SMTP Host</span>
            <input className="mt-1 w-full border rounded px-3 py-2" placeholder="smtp.example.com" />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">SMTP Port</span>
            <input className="mt-1 w-full border rounded px-3 py-2" type="number" placeholder="587" />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">SMTP Username</span>
            <input className="mt-1 w-full border rounded px-3 py-2" placeholder="user@example.com" />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">SMTP Password</span>
            <input className="mt-1 w-full border rounded px-3 py-2" type="password" placeholder="••••••••" />
          </label>
        </div>
        <div className="mt-4 flex gap-2">
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
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-muted-foreground">Webhook URL</span>
            <input className="mt-1 w-full border rounded px-3 py-2" placeholder="https://hooks.example.com/notify" />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Webhook Secret</span>
            <input className="mt-1 w-full border rounded px-3 py-2" type="password" placeholder="whsec_..." />
          </label>
        </div>
        <div className="mt-4 flex gap-2">
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
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-muted-foreground">Analytics ID</span>
            <input className="mt-1 w-full border rounded px-3 py-2" placeholder="G-XXXXXXXXXX" />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Analytics Enabled</span>
            <input type="checkbox" className="mt-3" />
          </label>
        </div>
      </section>

      {/* Feature Flags */}
      <section className="p-4 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Feature Flags</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm text-muted-foreground">Enable Tours</span>
            <input type="checkbox" className="mt-2" checked={settings.featureFlags?.tours ?? true} onChange={e => setSettings({ ...settings, featureFlags: { ...settings.featureFlags, tours: e.target.checked } })} />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Enable Bookings</span>
            <input type="checkbox" className="mt-2" checked={settings.featureFlags?.bookings ?? true} onChange={e => setSettings({ ...settings, featureFlags: { ...settings.featureFlags, bookings: e.target.checked } })} />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Enable Destinations</span>
            <input type="checkbox" className="mt-2" checked={settings.featureFlags?.destinations ?? true} onChange={e => setSettings({ ...settings, featureFlags: { ...settings.featureFlags, destinations: e.target.checked } })} />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Enable Blog</span>
            <input type="checkbox" className="mt-2" checked={settings.featureFlags?.blog ?? true} onChange={e => setSettings({ ...settings, featureFlags: { ...settings.featureFlags, blog: e.target.checked } })} />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Enable Newsletter</span>
            <input type="checkbox" className="mt-2" checked={settings.featureFlags?.newsletter ?? true} onChange={e => setSettings({ ...settings, featureFlags: { ...settings.featureFlags, newsletter: e.target.checked } })} />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Enable Reviews</span>
            <input type="checkbox" className="mt-2" checked={settings.featureFlags?.reviews ?? true} onChange={e => setSettings({ ...settings, featureFlags: { ...settings.featureFlags, reviews: e.target.checked } })} />
          </label>
        </div>
      </section>

      {/* Data Governance */}
      <section className="p-4 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Data Governance</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm text-muted-foreground">Retention (days)</span>
            <input type="number" className="mt-1 w-full border rounded px-3 py-2" value={settings.dataRetentionDays ?? 365} onChange={e => setSettings({ ...settings, dataRetentionDays: Number(e.target.value) })} />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Enable Backups</span>
            <input type="checkbox" checked={!!settings.backupsEnabled} onChange={e => setSettings({ ...settings, backupsEnabled: e.target.checked })} />
          </label>
          <label className="block">
            <span className="text-sm text-muted-foreground">Backup Schedule</span>
            <input className="mt-1 w-full border rounded px-3 py-2" value={settings.backupSchedule ?? ''} onChange={e => setSettings({ ...settings, backupSchedule: e.target.value })} />
          </label>
        </div>
      </section>

      {/* Audit Trail */}
      <section className="p-4 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Audit Trail</h2>
        <div className="max-h-48 overflow-auto border rounded p-2 bg-white/90">
          {audit.length === 0 ? (
            <div className="text-sm text-muted-foreground">No audit records yet.</div>
          ) : (
            audit.map((a, idx) => (
              <div key={idx} className="text-xs border-b py-1 last:pb-0 last:border-0">
                {a.changedAt ?? a.timestamp} - {a.changes ? JSON.stringify(a.changes) : ''}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="flex gap-3">
        <Button onClick={saveSettings} className="bg-primary text-white">Save Settings</Button>
        <Button variant="outline" onClick={() => window?.location?.reload?.()}>Reload</Button>
      </section>
    </main>
  )
}
