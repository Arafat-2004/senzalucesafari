'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

type LoginStep = 'credentials' | 'loading' | 'success' | 'forgot_password' | 'reset_sent'

interface LoginState {
    step: LoginStep
    email: string
    password: string
    error: string
    success: string
    loading: boolean
    failedAttempts: number
    showPassword: boolean
    resetEmail: string
    resetSent: boolean
}

const initialState: LoginState = {
    step: 'credentials',
    email: '',
    password: '',
    error: '',
    success: '',
    loading: false,
    failedAttempts: 0,
    showPassword: false,
    resetEmail: '',
    resetSent: false,
}

export default function AdminLoginPage() {
    const router = useRouter()
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const [state, setState] = useState<LoginState>(initialState)

    useEffect(() => {
        emailRef.current?.focus()
    }, [])

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (state.loading) return

        setState(prev => ({ ...prev, loading: true, error: '', success: '' }))

        try {
            const supabase = createBrowserSupabaseClient()
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: state.email,
                password: state.password,
            })

            if (authError) {
                const attempts = state.failedAttempts + 1
                setState(prev => ({
                    ...prev,
                    loading: false,
                    failedAttempts: attempts,
                    error: attempts >= 5
                        ? 'Account locked. Too many failed attempts.'
                        : `Invalid credentials. ${5 - attempts} attempts remaining.`,
                }))
                return
            }

            if (!authData.user) {
                setState(prev => ({ ...prev, loading: false, error: 'Login failed. Please try again.' }))
                return
            }

            const sessionResponse = await fetch('/api/admin/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: authData.user.id,
                    email: state.email,
                }),
            })

            if (sessionResponse.ok) {
                const sessionData = await sessionResponse.json()
                if (sessionData.success) {
                    await supabase.auth.signOut({ scope: 'local' })
                    setState(prev => ({ ...prev, step: 'success', loading: false, success: 'Login successful! Redirecting...' }))
                    setTimeout(() => {
                        router.push('/admin')
                        router.refresh()
                    }, 500)
                    return
                }
            }

            await supabase.auth.signOut({ scope: 'local' })
            setState(prev => ({ ...prev, step: 'success', loading: false, success: 'Login successful! Redirecting...' }))
            setTimeout(() => {
                router.push('/admin')
                router.refresh()
            }, 500)
        } catch (err) {
            console.error('Login error:', err)
            const message = err instanceof TypeError && err.message === 'Failed to fetch'
                ? 'Unable to reach authentication service. Check your network connection or ensure Supabase project settings allow http://localhost:3000.'
                : 'An unexpected error occurred. Please try again.'
            setState(prev => ({
                ...prev,
                loading: false,
                error: message,
            }))
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!state.resetEmail) {
            setState(prev => ({ ...prev, error: 'Please enter your email address.' }))
            return
        }

        setState(prev => ({ ...prev, loading: true, error: '' }))

        try {
            const supabase = createBrowserSupabaseClient()
            const { error } = await supabase.auth.resetPasswordForEmail(state.resetEmail, {
                redirectTo: `${window.location.origin}/admin/reset-password`,
            })

            if (error) {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message || 'Failed to send reset email.',
                }))
                return
            }

            setState(prev => ({
                ...prev,
                step: 'reset_sent',
                loading: false,
                success: 'Password reset link sent! Check your email.',
            }))
        } catch (err) {
            console.error('Reset password error:', err)
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to send reset email. Please try again.',
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
                        <CardTitle className="text-2xl">Admin Login</CardTitle>
                        <CardDescription>Sign in to manage your safari business</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {state.step === 'credentials' && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        ref={emailRef}
                                        id="email"
                                        type="email"
                                        placeholder="admin@senzaluce.com"
                                        value={state.email}
                                        onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                                        className="pl-10"
                                        required
                                        disabled={state.loading}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        ref={passwordRef}
                                        id="password"
                                        type={state.showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={state.password}
                                        onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
                                        className="pl-10 pr-10"
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
                                Sign In
                            </Button>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setState(prev => ({ ...prev, step: 'forgot_password', error: '' }))}
                                    className="text-sm text-primary hover:underline"
                                    disabled={state.loading}
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </form>
                    )}

                    {state.step === 'forgot_password' && (
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-semibold">Reset Password</h3>
                                <p className="text-sm text-muted-foreground">Enter your email to receive a reset link.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="resetEmail">Email</Label>
                                <Input
                                    id="resetEmail"
                                    type="email"
                                    placeholder="admin@senzaluce.com"
                                    value={state.resetEmail}
                                    onChange={(e) => setState(prev => ({ ...prev, resetEmail: e.target.value }))}
                                    required
                                    disabled={state.loading}
                                />
                            </div>
                            {state.error && (
                                <div className="flex items-center gap-2 text-sm text-destructive">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{state.error}</span>
                                </div>
                            )}
                            <Button type="submit" className="w-full" disabled={state.loading}>
                                {state.loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Send Reset Link
                            </Button>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setState(prev => ({ ...prev, step: 'credentials', error: '' }))}
                                    className="text-sm text-primary hover:underline"
                                    disabled={state.loading}
                                >
                                    Back to login
                                </button>
                            </div>
                        </form>
                    )}

                    {state.step === 'reset_sent' && (
                        <div className="text-center space-y-4 py-4">
                            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                            <h3 className="text-lg font-semibold">Check Your Email</h3>
                            <p className="text-sm text-muted-foreground">
                                We sent a password reset link to <strong>{state.resetEmail}</strong>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Click the link in the email to reset your password.
                            </p>
                            <button
                                type="button"
                                onClick={() => setState(prev => ({ ...prev, step: 'credentials', resetEmail: '', success: '' }))}
                                className="text-sm text-primary hover:underline"
                            >
                                Back to login
                            </button>
                        </div>
                    )}

                    {state.step === 'success' && (
                        <div className="text-center space-y-4 py-8">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                            <p className="text-muted-foreground">{state.success || 'Redirecting...'}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}