'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/reliability/logger'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ResetState {
    password: string
    confirmPassword: string
    error: string
    success: string
    loading: boolean
    showPassword: boolean
    showConfirmPassword: boolean
}

const initialState: ResetState = {
    password: '',
    confirmPassword: '',
    error: '',
    success: '',
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
}

export default function ResetPasswordPage() {
    const router = useRouter()
    const passwordRef = useRef<HTMLInputElement>(null)
    const [state, setState] = useState<ResetState>(initialState)

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const type = hashParams.get('type')

        if (type !== 'recovery') {
            setState(prev => ({ ...prev, error: 'Invalid reset link. Please request a new password reset.' }))
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!state.password || !state.confirmPassword) {
            setState(prev => ({ ...prev, error: 'Please fill in both password fields.' }))
            return
        }

        if (state.password !== state.confirmPassword) {
            setState(prev => ({ ...prev, error: 'Passwords do not match.' }))
            return
        }

        if (state.password.length < 6) {
            setState(prev => ({ ...prev, error: 'Password must be at least 6 characters.' }))
            return
        }

        setState(prev => ({ ...prev, loading: true, error: '' }))

        try {
            const supabase = createBrowserSupabaseClient()

            const hashParams = new URLSearchParams(window.location.hash.substring(1))
            const accessToken = hashParams.get('access_token')

            if (!accessToken) {
                setState(prev => ({ ...prev, loading: false, error: 'Invalid reset link. Please request a new password reset.' }))
                return
            }

            const { error } = await supabase.auth.updateUser({
                password: state.password,
            })

            if (error) {
                setState(prev => ({ ...prev, loading: false, error: error.message || 'Failed to reset password.' }))
                return
            }

            setState(prev => ({ ...prev, loading: false, success: 'Password reset successful! Redirecting to login...' }))

            setTimeout(() => {
                router.push('/admin/login')
            }, 2000)
        } catch (err) {
            logger.error('Reset password error', { error: err instanceof Error ? err.message : String(err) })
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'An unexpected error occurred. Please try again.',
            }))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>Enter your new password below</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input
                                    ref={passwordRef}
                                    id="password"
                                    type={state.showPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    value={state.password}
                                    onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
                                    className="pr-10"
                                    required
                                    disabled={state.loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    tabIndex={-1}
                                >
                                    {state.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={state.showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    value={state.confirmPassword}
                                    onChange={(e) => setState(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="pr-10"
                                    required
                                    disabled={state.loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    tabIndex={-1}
                                >
                                    {state.showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        {state.error && (
                            <div className="flex items-center gap-2 text-sm text-destructive">
                                <AlertCircle className="w-4 h-4" />
                                <span>{state.error}</span>
                            </div>
                        )}
                        {state.success && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span>{state.success}</span>
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={state.loading}>
                            {state.loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Reset Password
                        </Button>
                        <div className="text-center">
                            <a href="/admin/login" className="text-sm text-primary hover:underline">
                                Back to login
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}