'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { QrCode, Key, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { AdminPageHeader } from '../components'

interface SetupData {
    secret: string
    qrCode: string
    message: string
}

export default function MFASetupPage() {
    const searchParams = useSearchParams()
    const requiresSetup = searchParams.get('setup') === '1'
    
    const [loading, setLoading] = useState(false)
    const [setupData, setSetupData] = useState<SetupData | null>(null)
    const [manualSecret, setManualSecret] = useState('')
    const [verifyCode, setVerifyCode] = useState('')
    const [backupCodes, setBackupCodes] = useState<string[]>([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup')
    const [mfaStatus, setMfaStatus] = useState<{ enabled: boolean; loading: boolean }>({ enabled: false, loading: false })
    const [showManual, setShowManual] = useState(false)
    const [initialLoadError, setInitialLoadError] = useState(false)

    useEffect(() => {
        checkMFAStatus()
        // Initial account security check; subsequent checks are user-triggered.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function checkMFAStatus() {
        setMfaStatus(prev => ({ ...prev, loading: true }))
        setInitialLoadError(false)
        
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000)
            
            const res = await fetch('/api/admin/mfa-status', { signal: controller.signal })
            clearTimeout(timeoutId)
            
            if (res.ok) {
                const data = await res.json()
                setMfaStatus({ enabled: data.mfaEnabled, loading: false })
                if (data.mfaEnabled) {
                    setStep('complete')
                } else if (requiresSetup) {
                    generateQRCode()
                }
            } else if (res.status === 401) {
                setMfaStatus({ enabled: false, loading: false })
                setError('Please log in to configure MFA')
                toast.error('Session expired. Please log in again.')
            } else {
                const data = await res.json()
                setMfaStatus({ enabled: false, loading: false })
                setError(data.error || 'Failed to check MFA status')
            }
        } catch {
            setMfaStatus(prev => ({ ...prev, loading: false }))
            setInitialLoadError(true)
            setError('Failed to connect. Click below to try again.')
        }
    }

    const handleRetry = () => {
        checkMFAStatus()
    }

    async function generateQRCode() {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/admin/mfa-setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            const data = await res.json()
            if (res.ok) {
                setSetupData(data)
                setStep('setup')
                toast.success('MFA setup initialized successfully.')
            } else {
                setError(data.error || 'Failed to generate QR code')
                toast.error(data.error || 'Failed to generate QR code')
            }
        } catch {
            setError('Failed to connect to server')
            toast.error('Network error. Failed to connect to server.')
        } finally {
            setLoading(false)
        }
    }

    async function handleEnableMFA() {
        if (!showManual && verifyCode.length < 6) {
            setError('Please enter the 6-digit code from your authenticator app')
            return
        }

        if (showManual && manualSecret.length < 16) {
            setError('Please enter the 16-character secret key')
            return
        }

        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/admin/mfa-setup', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secret: showManual ? manualSecret : setupData?.secret,
                    code: verifyCode,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setBackupCodes(data.backupCodes || [])
                setMfaStatus({ enabled: true, loading: false })
                setStep('complete')
                setSuccess('MFA has been enabled successfully!')
                toast.success('MFA enabled successfully!')
            } else {
                setError(data.error || 'Failed to enable MFA')
                toast.error(data.error || 'Failed to verify authentication code')
            }
        } catch {
            setError('Failed to enable MFA')
            toast.error('An unexpected error occurred while enabling MFA')
        } finally {
            setLoading(false)
        }
    }

    function handleManualEntry() {
        if (manualSecret.length < 16) {
            setError('Secret key must be 16 characters')
            return
        }
        setShowManual(true)
        setStep('verify')
    }

    async function handleDisableMFA() {
        if (!confirm('Are you sure you want to disable MFA? This will make your account less secure.')) {
            return
        }

        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/admin/mfa-disable', { method: 'POST' })
            const data = await res.json()
            if (res.ok) {
                setMfaStatus({ enabled: false, loading: false })
                setStep('setup')
                setSetupData(null)
                setBackupCodes([])
                setSuccess('MFA has been disabled')
                toast.success('MFA has been disabled successfully.')
            } else {
                setError(data.error || 'Failed to disable MFA')
                toast.error(data.error || 'Failed to disable MFA')
            }
        } catch {
            setError('Failed to disable MFA')
            toast.error('An unexpected error occurred while disabling MFA')
        } finally {
            setLoading(false)
        }
    }

    if (mfaStatus.loading || initialLoadError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                {mfaStatus.loading && <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}
                {initialLoadError && (
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4">Failed to load MFA status</p>
                        <Button onClick={handleRetry} variant="outline">
                            Try Again
                        </Button>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <AdminPageHeader
                title="Multi-Factor Authentication"
                description="Secure your administrative account with two-factor authentication (TOTP)."
            />

            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                    <Alert variant="success">
                        <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {step === 'complete' && mfaStatus.enabled && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 admin-text-success" />
                            MFA is Enabled
                        </CardTitle>
                        <CardDescription>
                            Your account is protected with two-factor authentication.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {backupCodes.length > 0 && (
                        <div className="admin-tone-warning rounded-lg border p-4">
                            <h4 className="font-semibold mb-2">Backup Codes</h4>
                            <p className="text-sm mb-3">
                                    Save these codes in a safe place. You can use them to access your account if you lose your authenticator device.
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {backupCodes.map((code, i) => (
                                    <code key={i} className="font-mono text-sm bg-background/50 px-2 py-1 rounded">
                                            {code}
                                        </code>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Button variant="outline" onClick={handleDisableMFA} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Key className="h-4 w-4 mr-2" />}
                            Disable MFA
                        </Button>
                    </CardContent>
                </Card>
            )}

            {step === 'setup' && setupData && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 1: Scan the QR Code</CardTitle>
                            <CardDescription>
                                Open your authenticator app and scan this QR code
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-center">
                                {/* QR data URLs are generated locally and should not pass through image optimization. */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={setupData.qrCode} 
                                    alt="MFA QR Code" 
                                    width={160}
                                    height={160}
                                    className="h-36 w-36 rounded-lg sm:h-40 sm:w-40"
                                />
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Manual entry code:</p>
                                <code className="text-xs font-mono break-all">{setupData.secret}</code>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Step 2: Verify Setup</CardTitle>
                            <CardDescription>
                                Enter the 6-digit code from your authenticator app
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="verifyCode">Verification Code</Label>
                                <Input
                                    id="verifyCode"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={verifyCode}
                                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="text-center text-2xl tracking-widest font-mono"
                                />
                            </div>
                            <Button onClick={handleEnableMFA} disabled={loading || verifyCode.length < 6} className="w-full">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                Enable MFA
                            </Button>
                        </CardContent>
                    </Card>
                </>
            )}

            {step === 'setup' && !setupData && (
                <Card>
                    <CardHeader>
                        <CardTitle>Enable Two-Factor Authentication</CardTitle>
                        <CardDescription>
                            Protect your account by adding a second layer of security
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={generateQRCode} disabled={loading} className="w-full">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <QrCode className="h-4 w-4 mr-2" />}
                            Scan QR Code
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or</span>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => setShowManual(true)} className="w-full">
                            <Key className="h-4 w-4 mr-2" />
                            Enter Secret Key Manually
                        </Button>
                    </CardContent>
                </Card>
            )}

            {showManual && step !== 'complete' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Step 1: Enter Secret Key</CardTitle>
                        <CardDescription>
                            Enter your 16-character secret key from your authenticator app
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="manualSecret">Secret Key</Label>
                            <Input
                                id="manualSecret"
                                type="text"
                                placeholder="ABCD 1234 EFGH 5678"
                                value={manualSecret}
                                onChange={(e) => setManualSecret(e.target.value.replace(/\s/g, '').toUpperCase().slice(0, 16))}
                                className="text-center text-lg font-mono tracking-widest"
                                maxLength={16}
                            />
                        </div>
                        <Button variant="outline" onClick={handleManualEntry} disabled={manualSecret.length < 16} className="w-full">
                            Continue with Secret Key
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
