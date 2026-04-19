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
        <div className="space-y-4">
          {roles.map(r => (
            <div key={r.id} className="border rounded p-3 flex items-start justify-between">
              <div>
                <div className="font-semibold">{r.name}</div>
                <pre className="text-xs bg-muted/20 rounded p-2 mt-1" style={{ maxHeight: 100, overflow: 'auto' }}>{JSON.stringify(r.permissions, null, 2)}</pre>
              </div>
              <button className="self-start" onClick={() => updateRole(r.id, { name: prompt('Rename role', r.name) ?? r.name })}>Rename</button>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-4">
          <div className="flex items-end gap-2">
            <input id="new-role-name" placeholder="Role name" className="border rounded px-3 py-2" />
            <textarea id="new-role-permissions" placeholder='Permissions JSON' className="border rounded px-3 py-2" rows={2} defaultValue='{"tours": ["read","write"]}' />
            <button className="btn-safari" onClick={addRole}>Add Role</button>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="p-4 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Integrations</h2>
        <p className="text-sm text-muted-foreground">SMTP, Webhooks and analytics can be configured via the API-backed settings endpoints.</p>
        <div className="mt-2 grid md:grid-cols-3 gap-4"></div>
        <div className="mt-2 grid md:grid-cols-3 gap-4"></div>
        <div className="mt-2 grid md:grid-cols-3 gap-4"></div>
      </section>

      {/* Data Governance & Feature Flags */}
      <section className="p-4 bg-card border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Data & Features</h2>
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
