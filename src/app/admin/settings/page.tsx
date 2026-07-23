"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { showToast } from '@/lib/ui/toast';
import { AdminPageHeader } from '../components';
import { PushNotificationSettings } from '@/components/admin/push-notification-settings';
import { PERMISSIONS, ROLE_METADATA, type UserRole } from '@/lib/roles';
import {
    Settings as SettingsIcon,
    Shield,
    Users,
    KeyRound,
    Bell,
    Globe,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Plus,
    Trash2,
    Database,
    Plug,
    ClipboardList
} from 'lucide-react';

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
    pushNotifications?: boolean;
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
    smtpHost?: string;
    smtpPort?: number;
    smtpUsername?: string;
    smtpPassword?: string;
    webhookUrl?: string;
    webhookSecret?: string;
    analyticsId?: string;
    analyticsEnabled?: boolean;
};

type Role = {
    id: string;
    name: string;
    displayName?: string | null;
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

const permissionResources = ['tours', 'destinations', 'bookings', 'reviews', 'inquiries', 'users', 'settings', 'reports', 'analytics'] as const;
const permissionActions = ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'CONFIRM', 'CANCEL', 'REPLY', 'EXPORT'] as const;

function normalizePermissions(value: unknown): Record<string, string[]> {
    let parsed = value;
    for (let attempt = 0; attempt < 2 && typeof parsed === 'string'; attempt++) {
        try { parsed = JSON.parse(parsed); } catch { return {}; }
    }
    if (Array.isArray(parsed)) {
        return parsed.reduce<Record<string, string[]>>((permissions, permission) => {
            if (typeof permission !== 'string') return permissions;
            const separator = permission.lastIndexOf('_');
            if (separator <= 0 || separator === permission.length - 1) return permissions;
            const resource = permission.slice(0, separator).toLowerCase();
            const action = permission.slice(separator + 1).toUpperCase();
            permissions[resource] = Array.from(new Set([...(permissions[resource] ?? []), action]));
            return permissions;
        }, {});
    }
    if (!parsed || typeof parsed !== 'object') return {};
    return Object.fromEntries(Object.entries(parsed as Record<string, unknown>)
        .filter(([key, actions]) => !/^\d+$/.test(key) && Array.isArray(actions))
        .map(([key, actions]) => [key, (actions as unknown[]).filter((action): action is string => typeof action === 'string').map(action => action.toUpperCase())]));
}

function rolePresentation(role: Role) {
    const key = role.name.toLowerCase() as UserRole;
    const metadata = ROLE_METADATA[key];
    return {
        label: role.displayName || metadata?.label || role.name.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase()),
        description: metadata?.description,
        isSystemRole: Boolean(metadata?.isSystemRole),
        permissions: key === 'super_admin'
            ? Object.fromEntries(Object.entries(PERMISSIONS.super_admin).map(([resource, actions]) => [resource, [...actions]]))
            : normalizePermissions(role.permissions),
    };
}

function normalizeRoles(value: unknown): Role[] {
    const list = value && typeof value === 'object' && !Array.isArray(value) && 'data' in value ? (value as { data?: unknown }).data : value;
    return Array.isArray(list) ? list.filter((role): role is Role => Boolean(role && typeof role === 'object' && 'id' in role && 'name' in role)).map(role => ({ ...role, permissions: normalizePermissions(role.permissions) })) : [];
}

function normalizeAudit(value: unknown): AuditEntry[] {
    const list = value && typeof value === 'object' && !Array.isArray(value) && 'data' in value ? (value as { data?: unknown }).data : value;
    return Array.isArray(list) ? list.filter((entry): entry is AuditEntry => Boolean(entry && typeof entry === 'object')) : [];
}

export default function AdminSettingsPage(_props: Record<string, never>) {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState<AppSettings>({
        siteTitle: 'Senza Luce Safaris',
        siteUrl: 'https://senzalucesafaris.com',
        theme: 'SYSTEM',
        timezone: 'Africa/Dar_es_Salaam',
        currency: 'USD',
        signupEnabled: true,
        mfaRequired: false,
        sessionExpiration: 60,
        backupsEnabled: false,
        environment: 'production',
        featureFlags: {
            tours: true,
            bookings: true,
            destinations: true,
            blog: true,
            newsletter: true,
            reviews: true,
        },
    });
    const [roles, setRoles] = useState<Role[]>([]);
    const [audit, setAudit] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRolePermissions, setNewRolePermissions] = useState<Record<string, string[]>>({});

    useEffect(() => {
        Promise.all([
            fetch('/api/settings').then((r) => r.json()).catch(() => ({})),
            fetch('/api/settings/roles').then((r) => r.json()).then(normalizeRoles).catch(() => []),
            fetch('/api/settings/history').then((r) => r.json()).then(normalizeAudit).catch(() => []),
        ]).then(([settingsData, rolesData, auditData]) => {
            setSettings((s) => ({ ...s, ...(settingsData as AppSettings) }));
            setRoles(normalizeRoles(rolesData));
            setAudit(normalizeAudit(auditData));
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    const saveSettings = async () => {
        setSaving(true);
        setError(null);
        try {
            const resp = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...settings, changedBy: 'admin' }),
            });
            if (resp.ok) {
                setSaved(true);
                showToast('Settings saved successfully', { type: 'success' });
                setTimeout(() => setSaved(false), 2000);
            } else {
                const data = await resp.json();
                setError(data.error || 'Failed to save settings');
                showToast('Failed to save settings', { type: 'error' });
            }
        } catch {
            setError('Failed to save settings');
            showToast('Failed to save settings', { type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const addRole = async () => {
        const name = newRoleName.trim();
        if (!name) return showToast('Enter a role name', { type: 'warning' });
        try {
            const res = await fetch('/api/settings/roles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, permissions: newRolePermissions }),
            });
            if (res.ok) {
                const r = await res.json();
                setRoles((rs) => [...rs, { ...r.data, permissions: normalizePermissions(r.data?.permissions) }]);
                setNewRoleName(''); setNewRolePermissions({});
                showToast('Role created', { type: 'success' });
            } else {
                showToast('Failed to create role', { type: 'error' });
            }
        } catch {
            showToast('Failed to create role', { type: 'error' });
        }
    };

    const updateRole = async (id: string, patch: Partial<Role>) => {
        try {
            const res = await fetch(`/api/settings/roles/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patch),
            });
            if (res.ok) {
                const updated = await res.json();
                setRoles((rs) => rs.map((r) => (r.id === id ? updated.data : r)));
                showToast('Role updated', { type: 'success' });
            } else {
                showToast('Failed to update role', { type: 'error' });
            }
        } catch {
            showToast('Failed to update role', { type: 'error' });
        }
    };

    const deleteRole = async (id: string, name: string) => {
        if (!confirm(`Delete role "${name}"?`)) return;
        try {
            const res = await fetch(`/api/settings/roles/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setRoles(roles.filter(role => role.id !== id));
                showToast('Role deleted', { type: 'info' });
            } else {
                showToast('Failed to delete role', { type: 'error' });
            }
        } catch {
            showToast('Failed to delete role', { type: 'error' });
        }
    };

    const testSMTP = async () => {
        try {
            const res = await fetch('/api/settings/smtp-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    host: settings.smtpHost || 'smtp.example.com',
                    port: settings.smtpPort || 587
                }),
            });
            const data = await res.json();
            if (data.ok) showToast('SMTP test passed', { type: 'success' });
            else showToast('SMTP test failed', { type: 'error' });
        } catch {
            showToast('SMTP test error', { type: 'error' });
        }
    };

    const testWebhook = async () => {
        try {
            const res = await fetch('/api/settings/webhook-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: settings.webhookUrl || 'https://hooks.example.com/notify' }),
            });
            const data = await res.json();
            if (data.ok) showToast('Webhook test passed', { type: 'success' });
            else showToast('Webhook test failed', { type: 'error' });
        } catch {
            showToast('Webhook test error', { type: 'error' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Settings"
                description="Manage your global application settings, configuration, feature flags, role-based access control, and audit logs."
            >
                <Button onClick={saveSettings} disabled={saving} className="bg-primary text-white">
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Settings
                </Button>
            </AdminPageHeader>

            {saved && (
                    <div className="admin-tone-success flex items-center gap-2 rounded-lg border p-3">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Saved successfully!</span>
                </div>
            )}
            {error && (
                    <div className="admin-tone-danger flex items-center gap-2 rounded-lg border p-3">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                {/* Settings section nav — horizontal scrollable icon+label tabs */}
                <div className="border-b border-border overflow-x-auto scrollbar-none">
                    <div className="flex items-stretch gap-0 min-w-max">
                        {([
                            { value: 'general',      label: 'General',      icon: Globe },
                            { value: 'security',     label: 'Security',     icon: Shield },
                            { value: 'integrations', label: 'Integrations', icon: Plug },
                            { value: 'notifications', label: 'Notifications', icon: Bell },
                            { value: 'roles',        label: 'Roles',        icon: Users },
                            { value: 'audit',        label: 'Audit',        icon: ClipboardList },
                        ] as const).map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setActiveTab(value)}
                                className={`relative group flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-150 border-b-2 -mb-px ${
                                    activeTab === value
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                General Settings
                            </CardTitle>
                            <CardDescription>Basic site configuration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="siteTitle">Site Title</Label>
                                    <Input
                                        id="siteTitle"
                                        value={settings.siteTitle ?? ''}
                                        onChange={e => setSettings({ ...settings, siteTitle: e.target.value })}
                                        placeholder="Senza Luce Safaris"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="siteUrl">Site URL</Label>
                                    <Input
                                        value={settings.siteUrl ?? ''}
                                        onChange={e => setSettings({ ...settings, siteUrl: e.target.value })}
                                        placeholder="https://senzalucesafaris.com"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Theme</Label>
                                    <Select
                                        value={settings.theme ?? 'SYSTEM'}
                                        onValueChange={v => setSettings({ ...settings, theme: (v || 'SYSTEM') as typeof settings.theme })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LIGHT">Light</SelectItem>
                                            <SelectItem value="DARK">Dark</SelectItem>
                                            <SelectItem value="SYSTEM">System</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Timezone</Label>
                                    <Input
                                        value={settings.timezone ?? ''}
                                        onChange={e => setSettings({ ...settings, timezone: e.target.value })}
                                        placeholder="Africa/Dar_es_Salaam"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Currency</Label>
                                    <Input
                                        value={settings.currency ?? ''}
                                        onChange={e => setSettings({ ...settings, currency: e.target.value })}
                                        placeholder="USD"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Primary Color</Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            type="color"
                                            className="w-20 h-10 p-1"
                                            value={settings.primaryColor ?? '#0d6efd'}
                                            onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                                        />
                                        <span className="text-sm text-muted-foreground">{settings.primaryColor ?? '#0d6efd'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <Label>Signup Enabled</Label>
                                        <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                                    </div>
                                    <Switch
                                        checked={!!settings.signupEnabled}
                                        onCheckedChange={v => setSettings({ ...settings, signupEnabled: v })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Security & Access
                            </CardTitle>
                            <CardDescription>Authentication and security policies</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <Label>MFA Required</Label>
                                        <p className="text-sm text-muted-foreground">Enforce multi-factor authentication</p>
                                    </div>
                                    <Switch
                                        checked={!!settings.mfaRequired}
                                        onCheckedChange={v => setSettings({ ...settings, mfaRequired: v })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Session Expiration (minutes)</Label>
                                    <Input
                                        type="number"
                                        value={settings.sessionExpiration ?? 60}
                                        onChange={e => setSettings({ ...settings, sessionExpiration: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Password Policy</Label>
                                    <div className="grid grid-cols-2 gap-3 p-3 border rounded-lg">
                                        <div className="space-y-1">
                                            <Label htmlFor="minLength" className="text-xs text-muted-foreground">Min Length</Label>
                                            <Input
                                                id="minLength"
                                                type="number"
                                                min={4}
                                                max={128}
                                                value={settings.passwordPolicy?.minLength ?? 8}
                                                onChange={e => setSettings({
                                                    ...settings,
                                                    passwordPolicy: { ...settings.passwordPolicy, minLength: Number(e.target.value) }
                                                })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Requirements</Label>
                                            <div className="space-y-2 pt-1">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.passwordPolicy?.requireUppercase ?? true}
                                                        onChange={e => setSettings({
                                                            ...settings,
                                                            passwordPolicy: { ...settings.passwordPolicy, requireUppercase: e.target.checked }
                                                        })}
                                                        className="rounded"
                                                    />
                                                    Uppercase
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.passwordPolicy?.requireNumbers ?? true}
                                                        onChange={e => setSettings({
                                                            ...settings,
                                                            passwordPolicy: { ...settings.passwordPolicy, requireNumbers: e.target.checked }
                                                        })}
                                                        className="rounded"
                                                    />
                                                    Numbers
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.passwordPolicy?.requireSpecial ?? true}
                                                        onChange={e => setSettings({
                                                            ...settings,
                                                            passwordPolicy: { ...settings.passwordPolicy, requireSpecial: e.target.checked }
                                                        })}
                                                        className="rounded"
                                                    />
                                                    Special Chars
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="environment">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Environment Configuration
                            </CardTitle>
                            <CardDescription>Deployment environment and domain settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Current Environment</Label>
                                    <Select
                                        value={settings.environment ?? 'production'}
                                        onValueChange={v => setSettings({ ...settings, environment: (v || 'production') })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="development">Development</SelectItem>
                                            <SelectItem value="staging">Staging</SelectItem>
                                            <SelectItem value="production">Production</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Allowed Domains (comma-separated)</Label>
                                    <Input
                                        value={settings.allowedDomains?.join(', ') ?? ''}
                                        onChange={e => setSettings({
                                            ...settings,
                                            allowedDomains: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                        })}
                                        placeholder="senzalucesafaris.com, www.senzalucesafaris.com"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integrations">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plug className="h-5 w-5" />
                                Integrations
                            </CardTitle>
                            <CardDescription>External service connections</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Email (SMTP)</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>SMTP Host</Label>
                                        <Input
                                            value={settings.smtpHost ?? ''}
                                            onChange={e => setSettings({ ...settings, smtpHost: e.target.value })}
                                            placeholder="smtp.example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SMTP Port</Label>
                                        <Input
                                            type="number"
                                            value={settings.smtpPort ?? 587}
                                            onChange={e => setSettings({ ...settings, smtpPort: Number(e.target.value) })}
                                            placeholder="587"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SMTP Username</Label>
                                        <Input
                                            value={settings.smtpUsername ?? ''}
                                            onChange={e => setSettings({ ...settings, smtpUsername: e.target.value })}
                                            placeholder="user@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SMTP Password</Label>
                                        <Input
                                            type="password"
                                            value={settings.smtpPassword ?? ''}
                                            onChange={e => setSettings({ ...settings, smtpPassword: e.target.value })}
                                            placeholder="password"
                                        />
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={testSMTP}>Test SMTP</Button>
                            </div>

                            <div className="space-y-4 pt-6 border-t">
                                <h3 className="text-lg font-semibold">Webhook</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Webhook URL</Label>
                                        <Input
                                            value={settings.webhookUrl ?? ''}
                                            onChange={e => setSettings({ ...settings, webhookUrl: e.target.value })}
                                            placeholder="https://hooks.example.com/notify"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Webhook Secret</Label>
                                        <Input
                                            type="password"
                                            value={settings.webhookSecret ?? ''}
                                            onChange={e => setSettings({ ...settings, webhookSecret: e.target.value })}
                                            placeholder="whsec_..."
                                        />
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={testWebhook}>Test Webhook</Button>
                            </div>

                            <div className="space-y-4 pt-6 border-t">
                                <h3 className="text-lg font-semibold">Analytics</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Analytics ID</Label>
                                        <Input
                                            value={settings.analyticsId ?? ''}
                                            onChange={e => setSettings({ ...settings, analyticsId: e.target.value })}
                                            placeholder="G-XXXXXXXXXX"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <Label>Analytics Enabled</Label>
                                            <p className="text-sm text-muted-foreground">Track visitor behavior</p>
                                        </div>
                                        <Switch
                                            checked={!!settings.analyticsEnabled}
                                            onCheckedChange={v => setSettings({ ...settings, analyticsEnabled: v })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="features">
                    <Card>
                        <CardHeader>
                            <CardTitle>Feature Flags</CardTitle>
                            <CardDescription>Enable or disable application features</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                {[
                                    { key: 'tours', label: 'Tours', desc: 'Safari tour management' },
                                    { key: 'bookings', label: 'Bookings', desc: 'Booking system' },
                                    { key: 'destinations', label: 'Destinations', desc: 'Destination pages' },
                                    { key: 'blog', label: 'Blog', desc: 'Blog posts' },
                                    { key: 'newsletter', label: 'Newsletter', desc: 'Email newsletter' },
                                    { key: 'reviews', label: 'Reviews', desc: 'Customer reviews' },
                                ].map(feature => (
                                    <div key={feature.key} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <Label>{feature.label}</Label>
                                            <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                        </div>
                                        <Switch
                                            checked={settings.featureFlags?.[feature.key as keyof FeatureFlags] ?? true}
                                            onCheckedChange={v => setSettings({
                                                ...settings,
                                                featureFlags: { ...settings.featureFlags, [feature.key]: v }
                                            })}
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5"/>Notification Preferences</CardTitle><CardDescription>Manage dashboard inbox alerts and opt this device into web push delivery.</CardDescription></CardHeader><CardContent className="space-y-5"><PushNotificationSettings/><div><Label>Inbox retention</Label><p className="mt-1 text-sm text-muted-foreground">Read notifications follow the global data-retention period under Data Governance. Unread operational alerts are preserved.</p></div></CardContent></Card></TabsContent>

                <TabsContent value="governance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Governance</CardTitle>
                            <CardDescription>Data retention and backup policies</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Retention (days)</Label>
                                    <Input
                                        type="number"
                                        value={settings.dataRetentionDays ?? 365}
                                        onChange={e => setSettings({ ...settings, dataRetentionDays: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <Label>Enable Backups</Label>
                                        <p className="text-sm text-muted-foreground">Automatic database backups</p>
                                    </div>
                                    <Switch
                                        checked={!!settings.backupsEnabled}
                                        onCheckedChange={v => setSettings({ ...settings, backupsEnabled: v })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Backup Schedule</Label>
                                    <Input
                                        value={settings.backupSchedule ?? ''}
                                        onChange={e => setSettings({ ...settings, backupSchedule: e.target.value })}
                                        placeholder="0 2 * * * (daily at 2 AM)"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="roles">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <KeyRound className="h-5 w-5" />
                                Roles & Permissions
                            </CardTitle>
                            <CardDescription>Configure roles and their permissions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                {roles.map(r => {
                                    const presentation = rolePresentation(r);
                                    return (
                                    <div key={r.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary">{presentation.label}</Badge>
                                                    {presentation.isSystemRole && <Badge variant="outline">System role</Badge>}
                                                </div>
                                                {presentation.description && <p className="mt-1 text-sm text-muted-foreground">{presentation.description}</p>}
                                            </div>
                                            {!presentation.isSystemRole && <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newName = prompt('Rename role', r.name);
                                                        if (newName) updateRole(r.id, { name: newName });
                                                    }}
                                                >
                                                    Rename
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => deleteRole(r.id, r.name)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>}
                                        </div>
                                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                            {Object.entries(presentation.permissions).map(([resource, actions]) => <div key={resource} className="rounded-lg border bg-muted/20 p-3"><p className="text-sm font-medium capitalize">{resource}</p><div className="mt-2 flex flex-wrap gap-1">{actions.map(action => <Badge key={action} variant="outline" className="text-[10px]">{action.toLowerCase()}</Badge>)}</div></div>)}
                                            {Object.keys(presentation.permissions).length === 0 && <p className="text-sm text-muted-foreground">No permissions assigned.</p>}
                                        </div>
                                    </div>
                                )})}
                            </div>
                            <div className="pt-6 border-t">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add New Role
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Role Name</Label>
                                        <Input value={newRoleName} onChange={event => setNewRoleName(event.target.value)} placeholder="e.g., Reservations Manager" />
                                    </div>
                                </div>
                                <div className="table-scroll mt-4 rounded-xl border"><table className="w-full min-w-[760px] text-sm"><thead className="bg-muted/50"><tr><th className="p-3 text-left">Area</th>{permissionActions.map(action=><th key={action} className="p-2 text-center text-xs">{action.toLowerCase()}</th>)}</tr></thead><tbody>{permissionResources.map(resource=><tr key={resource} className="border-t"><td className="p-3 font-medium capitalize">{resource}</td>{permissionActions.map(action=>{const checked=newRolePermissions[resource]?.includes(action)??false;return <td key={action} className="p-2 text-center"><input type="checkbox" aria-label={`${resource} ${action}`} checked={checked} onChange={()=>setNewRolePermissions(current=>({...current,[resource]:checked?(current[resource]??[]).filter(item=>item!==action):[...(current[resource]??[]),action]}))} className="size-4 accent-primary"/></td>})}</tr>)}</tbody></table></div>
                                <Button className="mt-4" onClick={addRole}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Role
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="audit">
                    <Card>
                        <CardHeader>
                            <CardTitle>Audit Trail</CardTitle>
                            <CardDescription>Recent configuration changes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-96 overflow-auto border rounded-lg p-4 bg-muted/20 space-y-2">
                                {normalizeAudit(audit).length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <SettingsIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                        <p>No audit records yet</p>
                                    </div>
                                ) : (
                                    normalizeAudit(audit).slice(0, 20).map((a, idx) => (
                                        <div key={idx} className="text-sm border-b pb-2 last:pb-0 last:border-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{a.action || 'UPDATE'}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(a.changedAt ?? a.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            {a.changes && <div className="mt-2 flex flex-wrap gap-1">{Object.keys(a.changes).map(field=><Badge key={field} variant="outline" className="capitalize">{field.replace(/([A-Z])/g,' $1')}</Badge>)}</div>}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
