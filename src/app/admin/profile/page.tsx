'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
    User, Mail, Phone, Briefcase, Globe, Clock, Shield,
    Lock, Eye, EyeOff, Camera, CheckCircle2, AlertCircle,
    Loader2, Save, KeyRound, LogOut, Settings, ChevronRight,
    CalendarDays, Activity, BadgeCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { showToast } from '@/lib/ui/toast'
import { uploadMedia } from '@/lib/media'

/* ─── Types ──────────────────────────────────────────────────── */
interface AdminProfile {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar: string | null
    phone: string | null
    jobTitle: string | null
    language: string | null
    timezone: string | null
    role: { id: string; name: string; displayName: string }
    lastLoginAt: string | null
    createdAt: string
    failedAttempts: number
    isActive: boolean
}

/* ─── Helpers ────────────────────────────────────────────────── */
function getInitials(first: string, last: string) {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

function formatDate(iso: string | null) {
    if (!iso) return 'Never'
    return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

const LANGUAGES = [
    { value: 'en', label: '🇬🇧 English' },
    { value: 'sw', label: '🇹🇿 Swahili' },
    { value: 'fr', label: '🇫🇷 French' },
    { value: 'de', label: '🇩🇪 German' },
    { value: 'es', label: '🇪🇸 Spanish' },
    { value: 'it', label: '🇮🇹 Italian' },
    { value: 'zh', label: '🇨🇳 Chinese' },
    { value: 'ar', label: '🇸🇦 Arabic' },
]

const TIMEZONES = [
    'Africa/Dar_es_Salaam',
    'Africa/Nairobi',
    'Africa/Kampala',
    'Africa/Kigali',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'America/New_York',
    'America/Los_Angeles',
    'Asia/Dubai',
    'Asia/Singapore',
    'Australia/Sydney',
]

type Tab = 'profile' | 'security'

/* ─── Password strength ──────────────────────────────────────── */
function passwordStrength(pw: string): { score: number; label: string; color: string } {
    let score = 0
    if (pw.length >= 8) score++
    if (pw.length >= 12) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[a-z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' }
    if (score <= 4) return { score, label: 'Fair', color: 'bg-amber-500' }
    if (score <= 5) return { score, label: 'Strong', color: 'bg-emerald-500' }
    return { score, label: 'Very Strong', color: 'bg-primary' }
}

/* ─── Avatar uploader ────────────────────────────────────────── */
function AvatarUploader({
    current, initials, onUploaded,
}: {
    current: string | null
    initials: string
    onUploaded: (url: string) => void
}) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(current)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            showToast('Please choose an image file', { type: 'error' }); return
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image must be under 5 MB', { type: 'error' }); return
        }
        setUploading(true)
        try {
            const result = await uploadMedia(file, { supabase: { bucket: 'images', folder: 'avatars' } })
            setPreview(result.publicUrl)
            onUploaded(result.publicUrl)
            showToast('Photo updated', { type: 'success' })
        } catch {
            showToast('Upload failed — check Supabase storage bucket', { type: 'error' })
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="relative group w-28 h-28 shrink-0">
            {/* Avatar circle */}
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/20 ring-offset-2 ring-offset-background bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                {preview ? (
                    <Image src={preview} alt="Avatar" fill className="object-cover" sizes="112px" />
                ) : (
                    <span>{initials}</span>
                )}
            </div>

            {/* Overlay trigger */}
            <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Change profile photo"
            >
                {uploading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                    <Camera className="w-6 h-6 text-white" />
                )}
            </button>

            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />

            {/* Small badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow ring-2 ring-background cursor-pointer"
                onClick={() => fileRef.current?.click()}>
                <Camera className="w-3.5 h-3.5 text-white" />
            </div>
        </div>
    )
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function ProfilePage() {
    const router = useRouter()
    const [tab, setTab] = useState<Tab>('profile')
    const [profile, setProfile] = useState<AdminProfile | null>(null)
    const [loading, setLoading] = useState(true)

    // Profile form
    const [form, setForm] = useState({
        firstName: '', lastName: '', phone: '', jobTitle: '',
        language: 'en', timezone: 'Africa/Dar_es_Salaam', avatar: '',
    })
    const [saving, setSaving] = useState(false)

    // Password form
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [pwSaving, setPwSaving] = useState(false)
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    /* Fetch profile */
    useEffect(() => {
        fetch('/api/admin/profile')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.user) {
                    const u = data.user
                    setProfile(u)
                    setForm({
                        firstName: u.firstName ?? '',
                        lastName: u.lastName ?? '',
                        phone: u.phone ?? '',
                        jobTitle: u.jobTitle ?? '',
                        language: u.language ?? 'en',
                        timezone: u.timezone ?? 'Africa/Dar_es_Salaam',
                        avatar: u.avatar ?? '',
                    })
                }
            })
            .finally(() => setLoading(false))
    }, [])

    /* Save profile */
    const handleSaveProfile = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Save failed')
            setProfile(prev => prev ? { ...prev, ...data.user } : prev)
            showToast('Profile saved successfully', { type: 'success' })
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Failed to save', { type: 'error' })
        } finally {
            setSaving(false)
        }
    }

    /* Change password */
    const handleChangePassword = async () => {
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            showToast('New passwords do not match', { type: 'error' }); return
        }
        setPwSaving(true)
        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pwForm),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Password change failed')
            showToast('Password changed successfully', { type: 'success' })
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Failed to change password', { type: 'error' })
        } finally {
            setPwSaving(false)
        }
    }

    const strength = passwordStrength(pwForm.newPassword)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-muted-foreground">Could not load your profile. Please refresh.</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* ── Hero banner ── */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary-dark p-6 text-white shadow-lg">
                {/* Subtle pattern */}
                <div className="pointer-events-none absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <AvatarUploader
                        current={form.avatar || null}
                        initials={getInitials(form.firstName || profile.firstName, form.lastName || profile.lastName)}
                        onUploaded={url => setForm(f => ({ ...f, avatar: url }))}
                    />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl font-bold truncate">
                                {profile.firstName} {profile.lastName}
                            </h1>
                            {profile.isActive && (
                                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                                    <BadgeCheck className="w-3 h-3 mr-1" /> Active
                                </Badge>
                            )}
                        </div>
                        <p className="text-white/75 text-sm mt-0.5">{profile.email}</p>
                        <div className="flex items-center gap-4 mt-3 flex-wrap">
                            <span className="flex items-center gap-1.5 text-xs text-white/70">
                                <Shield className="w-3.5 h-3.5" />
                                {profile.role.displayName}
                            </span>
                            {profile.jobTitle && (
                                <span className="flex items-center gap-1.5 text-xs text-white/70">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    {profile.jobTitle}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 text-xs text-white/70">
                                <CalendarDays className="w-3.5 h-3.5" />
                                Joined {formatDate(profile.createdAt).split(',')[0]}
                            </span>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="hidden sm:flex flex-col gap-2 text-right shrink-0">
                        <div className="text-xs text-white/60">Last login</div>
                        <div className="text-sm font-medium text-white/90">{formatDate(profile.lastLoginAt)}</div>
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 p-1 bg-muted rounded-xl w-full sm:w-fit">
                {([
                    { id: 'profile', label: 'Profile', icon: User },
                    { id: 'security', label: 'Security', icon: Lock },
                ] as { id: Tab; label: string; icon: React.ElementType }[]).map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            tab === t.id
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── Profile tab ── */}
            {tab === 'profile' && (
                <div className="grid lg:grid-cols-3 gap-6">

                    {/* Main info */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="w-4 h-4 text-primary" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>Update your name, contact details and job info</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="firstName"
                                        value={form.firstName}
                                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                                        placeholder="First name"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="lastName"
                                        value={form.lastName}
                                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                                        placeholder="Last name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Address
                                </Label>
                                <div className="relative">
                                    <Input value={profile.email} disabled className="bg-muted/50 pr-24" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Read-only</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Email changes require an administrator.</p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={form.phone}
                                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        placeholder="+255 ..."
                                        type="tel"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="jobTitle" className="flex items-center gap-1.5">
                                        <Briefcase className="w-3.5 h-3.5 text-muted-foreground" /> Job Title
                                    </Label>
                                    <Input
                                        id="jobTitle"
                                        value={form.jobTitle}
                                        onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
                                        placeholder="e.g. Operations Manager"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="language" className="flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5 text-muted-foreground" /> Language
                                    </Label>
                                    <select
                                        id="language"
                                        value={form.language}
                                        onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    >
                                        {LANGUAGES.map(l => (
                                            <option key={l.value} value={l.value}>{l.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="timezone" className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Timezone
                                    </Label>
                                    <select
                                        id="timezone"
                                        value={form.timezone}
                                        onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    >
                                        {TIMEZONES.map(tz => (
                                            <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar cards */}
                    <div className="space-y-4">
                        {/* Account info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-primary" /> Account Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <span className="text-muted-foreground">Role</span>
                                    <Badge variant="secondary">{profile.role.displayName}</Badge>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge className={profile.isActive ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' : 'bg-red-500/15 text-red-600'}>
                                        {profile.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <span className="text-muted-foreground">Member since</span>
                                    <span className="text-xs font-medium">{new Date(profile.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-muted-foreground">Last login</span>
                                    <span className="text-xs font-medium">{formatDate(profile.lastLoginAt)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick links */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-primary" /> Quick Links
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {[
                                    { label: 'MFA Setup', href: '/admin/mfa', icon: Shield },
                                    { label: 'Notifications', href: '/admin/notifications', icon: Activity },
                                    { label: 'Admin Settings', href: '/admin/settings', icon: Settings },
                                ].map(link => (
                                    <button
                                        key={link.href}
                                        onClick={() => router.push(link.href)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/60 transition-colors border-b border-border/40 last:border-0"
                                    >
                                        <span className="flex items-center gap-2 text-muted-foreground">
                                            <link.icon className="w-3.5 h-3.5" />
                                            {link.label}
                                        </span>
                                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* ── Security tab ── */}
            {tab === 'security' && (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">

                        {/* Change password */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <KeyRound className="w-4 h-4 text-primary" />
                                    Change Password
                                </CardTitle>
                                <CardDescription>Use a strong, unique password you don&apos;t use elsewhere</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">

                                {/* Current */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showCurrent ? 'text' : 'password'}
                                            value={pwForm.currentPassword}
                                            onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                                            placeholder="Enter current password"
                                            className="pr-10"
                                        />
                                        <button type="button" onClick={() => setShowCurrent(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label={showCurrent ? 'Hide password' : 'Show password'}>
                                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* New */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showNew ? 'text' : 'password'}
                                            value={pwForm.newPassword}
                                            onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                                            placeholder="Enter new password"
                                            className="pr-10"
                                        />
                                        <button type="button" onClick={() => setShowNew(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label={showNew ? 'Hide password' : 'Show password'}>
                                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {/* Strength bar */}
                                    {pwForm.newPassword && (
                                        <div className="space-y-1.5 pt-1">
                                            <div className="flex gap-1">
                                                {Array.from({ length: 6 }).map((_, i) => (
                                                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength.score ? strength.color : 'bg-muted'}`} />
                                                ))}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Strength: <span className="font-medium text-foreground">{strength.label}</span>
                                            </p>
                                        </div>
                                    )}

                                    {/* Requirements checklist */}
                                    <div className="grid grid-cols-2 gap-1 pt-1">
                                        {[
                                            { label: '8+ characters', ok: pwForm.newPassword.length >= 8 },
                                            { label: 'Uppercase letter', ok: /[A-Z]/.test(pwForm.newPassword) },
                                            { label: 'Lowercase letter', ok: /[a-z]/.test(pwForm.newPassword) },
                                            { label: 'Number', ok: /[0-9]/.test(pwForm.newPassword) },
                                            { label: 'Special character', ok: /[^A-Za-z0-9]/.test(pwForm.newPassword) },
                                        ].map(req => (
                                            <div key={req.label} className={`flex items-center gap-1.5 text-xs transition-colors ${req.ok ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                                                <CheckCircle2 className={`w-3 h-3 shrink-0 ${req.ok ? 'text-emerald-500' : 'text-muted-foreground/40'}`} />
                                                {req.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Confirm */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirm ? 'text' : 'password'}
                                            value={pwForm.confirmPassword}
                                            onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                            placeholder="Re-enter new password"
                                            className={`pr-10 ${pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                        />
                                        <button type="button" onClick={() => setShowConfirm(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
                                        <p className="text-xs text-destructive flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> Passwords do not match
                                        </p>
                                    )}
                                </div>

                                <Button
                                    onClick={handleChangePassword}
                                    disabled={pwSaving || !pwForm.currentPassword || !pwForm.newPassword || pwForm.newPassword !== pwForm.confirmPassword}
                                    className="gap-2"
                                >
                                    {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                                    Update Password
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Security sidebar */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-primary" /> Security Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <span className="text-muted-foreground">2FA (MFA)</span>
                                    <button onClick={() => router.push('/admin/mfa')}
                                        className="flex items-center gap-1 text-primary text-xs font-medium hover:underline">
                                        Configure <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <span className="text-muted-foreground">Failed logins</span>
                                    <Badge variant={profile.failedAttempts > 0 ? 'destructive' : 'secondary'} className="text-xs">
                                        {profile.failedAttempts}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-muted-foreground">Last login</span>
                                    <span className="text-xs font-medium text-right max-w-[140px] leading-tight">{formatDate(profile.lastLoginAt)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-destructive/30 bg-destructive/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground mb-3">Sign out of your admin session on this device.</p>
                                <form action="/api/admin/session" method="POST">
                                    <Button type="button" variant="destructive" size="sm" className="w-full gap-2"
                                        onClick={() => { router.push('/admin/login') }}>
                                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
