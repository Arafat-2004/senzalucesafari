'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTransition } from 'react'
import { 
    User, 
    Shield, 
    Users, 
    KeyRound,
    Bell,
    Globe,
    Settings as SettingsIcon,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Plus,
    Trash2,
    Edit,
    MoreVertical,
    LogOut
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: KeyRound },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'site', label: 'Site Settings', icon: Globe },
]

interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
    jobTitle?: string;
    language?: string;
    timezone?: string;
    role: { id: string; name: string; displayName: string };
    isActive: boolean;
    lastLoginAt?: string;
    createdAt: string;
}

interface RoleData {
    id: string;
    name: string;
    displayName: string;
    description?: string;
    level: number;
    isDefault: boolean;
    _count?: { users: number };
}

export default function SettingsPage() {
    const router = useRouter()
    const pathname = usePathname()
    const [activeTab, setActiveTab] = useState('profile')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    const [currentUser, setCurrentUser] = useState<UserData | null>(null)
    const [users, setUsers] = useState<UserData[]>([])
    const [roles, setRoles] = useState<RoleData[]>([])
    
    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        jobTitle: '',
        language: 'en',
        timezone: 'Africa/Dar_es_Salaam',
    })
    
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    
    const [showUserModal, setShowUserModal] = useState(false)
    const [showRoleModal, setShowRoleModal] = useState(false)
    const [editingUser, setEditingUser] = useState<UserData | null>(null)
    const [editingRole, setEditingRole] = useState<RoleData | null>(null)

    const loadData = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/profile')
            if (response.ok) {
                const data = await response.json()
                if (data.user) {
                    setCurrentUser(data.user)
                    setProfileForm({
                        firstName: data.user.firstName || '',
                        lastName: data.user.lastName || '',
                        phone: data.user.phone || '',
                        jobTitle: data.user.jobTitle || '',
                        language: data.user.language || 'en',
                        timezone: data.user.timezone || 'Africa/Dar_es_Salaam',
                    })
                }
            }
        } catch (err) {
            console.error('Failed to load profile:', err)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    const handleProfileSave = async () => {
        setSaving(true)
        setError(null)
        try {
            const response = await fetch('/api/admin/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileForm),
            })
            if (response.ok) {
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
            } else {
                const data = await response.json()
                setError(data.error || 'Failed to save')
            }
        } catch (err) {
            setError('Failed to save profile')
        }
        setSaving(false)
    }

    const handlePasswordSave = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('Passwords do not match')
            return
        }
        if (passwordForm.newPassword.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }
        setSaving(true)
        setError(null)
        try {
            const response = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                    confirmPassword: passwordForm.confirmPassword,
                }),
            })
            const data = await response.json()
            if (response.ok) {
                setSaved(true)
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                setTimeout(() => setSaved(false), 2000)
            } else {
                setError(data.error || 'Failed to change password')
            }
        } catch (err) {
            setError('Failed to change password')
        }
        setSaving(false)
    }

    const loadUsers = async () => {
        try {
            const response = await fetch('/api/admin/users')
            if (response.ok) {
                const data = await response.json()
                setUsers(data.users || [])
                setRoles(data.roles || [])
            }
        } catch (err) {
            console.error('Failed to load users:', err)
        }
    }

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return
        try {
            const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
            if (response.ok) {
                setUsers(users.filter(u => u.id !== id))
            }
        } catch (err) {
            console.error('Failed to delete user:', err)
        }
    }

    const renderTab = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>First Name</Label>
                                        <Input 
                                            value={profileForm.firstName}
                                            onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Name</Label>
                                        <Input 
                                            value={profileForm.lastName}
                                            onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={currentUser?.email || ''} disabled />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input 
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Job Title</Label>
                                        <Input 
                                            value={profileForm.jobTitle}
                                            onChange={(e) => setProfileForm({...profileForm, jobTitle: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Language</Label>
                                        <select 
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                            value={profileForm.language}
                                            onChange={(e) => setProfileForm({...profileForm, language: e.target.value})}
                                        >
                                            <option value="en">English</option>
                                            <option value="sw">Swahili</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Timezone</Label>
                                        <select 
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                            value={profileForm.timezone}
                                            onChange={(e) => setProfileForm({...profileForm, timezone: e.target.value})}
                                        >
                                            <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam</option>
                                            <option value="Africa/Nairobi">Africa/Nairobi</option>
                                            <option value="UTC">UTC</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <Button onClick={handleProfileSave} disabled={saving}>
                                        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                        Save Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Info</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Role</p>
                                        <p className="font-medium">{currentUser?.role?.displayName || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Last Login</p>
                                        <p className="font-medium">
                                            {currentUser?.lastLoginAt 
                                                ? new Date(currentUser.lastLoginAt).toLocaleString() 
                                                : 'Never'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Account Created</p>
                                        <p className="font-medium">
                                            {currentUser?.createdAt 
                                                ? new Date(currentUser.createdAt).toLocaleDateString() 
                                                : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Status</p>
                                        <p className="font-medium">{currentUser?.isActive ? 'Active' : 'Inactive'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )
            
            case 'security':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Update your password</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Current Password</Label>
                                    <Input 
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input 
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Must be 8+ characters with uppercase, lowercase, number, and special character
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm New Password</Label>
                                    <Input 
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                    />
                                </div>
                                <div className="pt-4">
                                    <Button onClick={handlePasswordSave} disabled={saving}>
                                        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
                                        Change Password
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )
            
            case 'users':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Users</h2>
                                <p className="text-muted-foreground">Manage admin users</p>
                            </div>
                        </div>
                        <Card>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b">
                                            <tr className="text-left">
                                                <th className="p-4 font-medium">Name</th>
                                                <th className="p-4 font-medium">Email</th>
                                                <th className="p-4 font-medium">Role</th>
                                                <th className="p-4 font-medium">Status</th>
                                                <th className="p-4 font-medium">Created</th>
                                                <th className="p-4 font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                        No users found
                                                    </td>
                                                </tr>
                                            ) : (
                                                users.map((user) => (
                                                    <tr key={user.id} className="border-b">
                                                        <td className="p-4">{user.firstName} {user.lastName}</td>
                                                        <td className="p-4">{user.email}</td>
                                                        <td className="p-4">{user.role?.displayName}</td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 rounded text-xs ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {user.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-sm">
                                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex gap-2">
                                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )
            
            case 'roles':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Roles & Permissions</h2>
                                <p className="text-muted-foreground">Manage user roles</p>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {roles.map((role) => (
                                <Card key={role.id}>
                                    <CardHeader>
                                        <CardTitle>{role.displayName}</CardTitle>
                                        <CardDescription>{role.description || role.name}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm">
                                            <p className="flex justify-between">
                                                <span className="text-muted-foreground">Level</span>
                                                <span className="font-medium">{role.level}</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span className="text-muted-foreground">Users</span>
                                                <span className="font-medium">{role._count?.users || 0}</span>
                                            </p>
                                            {role.isDefault && (
                                                <span className="inline-block mt-2 px-2 py-1 rounded bg-primary/10 text-primary text-xs">
                                                    Default Role
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )
            
            case 'notifications':
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Manage your notification settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b">
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive email for new bookings</p>
                                </div>
                                <input type="checkbox" defaultChecked className="h-4 w-4" />
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <div>
                                    <p className="font-medium">Enquiry Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive email for new enquiries</p>
                                </div>
                                <input type="checkbox" defaultChecked className="h-4 w-4" />
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-medium">System Alerts</p>
                                    <p className="text-sm text-muted-foreground">Receive system updates</p>
                                </div>
                                <input type="checkbox" className="h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                )
            
            case 'site':
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Site Settings</CardTitle>
                            <CardDescription>Configure website settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">Site settings available in the main Settings tab.</p>
                            <Link href="/admin/settings" className="text-primary hover:underline">
                                Go to Site Settings →
                            </Link>
                        </CardContent>
                    </Card>
                )
            
            default:
                return (
                    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20">
                        <AlertCircle className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">Section not found</h3>
                        <p className="text-sm text-muted-foreground mt-1">The requested settings section could not be loaded.</p>
                        <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => setActiveTab('profile')}
                        >
                            Back to Profile
                        </Button>
                    </div>
                )
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage your account and preferences</p>
                </div>
            </div>

            {saved && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Saved successfully!</span>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="p-2">
                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                                            activeTab === item.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-3">
                    {renderTab()}
                </div>
            </div>
        </div>
    )
}