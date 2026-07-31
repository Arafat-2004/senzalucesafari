"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Code2, Globe, ExternalLink, Sparkles, MapPin, CheckCircle2, Terminal } from 'lucide-react';
import { GitHubIcon } from '@/components/ui/github-icon';
import { LinkedInIcon } from '@/components/ui/linkedin-icon';
import { InstagramIcon } from '@/components/ui/instagram-icon';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { Button } from '@/components/ui/button';

interface DeveloperModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DeveloperModal({ isOpen, onClose }: DeveloperModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText('https://github.com/Arafat-2004');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback if clipboard API fails
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
            {/* Backdrop click listener */}
            <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

            {/* Modal Card */}
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-none rounded-3xl border border-white/20 bg-background/95 p-6 sm:p-8 text-foreground shadow-2xl backdrop-blur-2xl transition-all animate-in zoom-in-95 duration-200 z-10">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
                    aria-label="Close developer info"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Developer Profile Banner */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 pb-6 border-b border-border/60">
                    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-muted shadow-lg ring-4 ring-primary/20 overflow-hidden">
                        <Image
                            src="/images/developer/arafat.jpg"
                            alt="Arafat Mbaga"
                            fill
                            className="object-cover object-center"
                            sizes="80px"
                            priority
                        />
                        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-black shadow z-10">
                            <Sparkles className="h-3.5 w-3.5 fill-black" />
                        </div>
                    </div>

                    <div className="text-center sm:text-left space-y-1">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                            <Code2 className="h-3.5 w-3.5" />
                            Lead Software Engineer
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Arafat Mbaga
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            Tanzania · Full-Stack & UX Architect
                        </p>
                    </div>
                </div>

                {/* Project Statement */}
                <div className="my-5 rounded-2xl bg-muted/40 p-4 border border-border/40 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                            <Terminal className="h-3.5 w-3.5" />
                            Engineering Credit
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground">Senza Luce Safaris</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Designed, engineered, and optimized this platform with Next.js 16, TypeScript, Supabase, and Tailwind CSS.
                    </p>
                </div>

                {/* Connect & Social Accounts Grid */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                        Connect & Follow
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* GitHub */}
                        <a
                            href="https://github.com/Arafat-2004"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 text-xs font-medium transition-all hover:border-primary hover:bg-accent hover:shadow-sm group"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
                                    <GitHubIcon size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold group-hover:text-primary transition-colors">GitHub</span>
                                    <span className="text-[10px] text-muted-foreground">@Arafat-2004</span>
                                </div>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                        </a>

                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/in/arafatmbaga/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 text-xs font-medium transition-all hover:border-primary hover:bg-accent hover:shadow-sm group"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A66C2] text-white">
                                    <LinkedInIcon size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold group-hover:text-primary transition-colors">LinkedIn</span>
                                    <span className="text-[10px] text-muted-foreground">Arafat Mbaga</span>
                                </div>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                        </a>

                        {/* Instagram */}
                        <a
                            href="https://www.instagram.com/arafaty.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 text-xs font-medium transition-all hover:border-primary hover:bg-accent hover:shadow-sm group"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white">
                                    <InstagramIcon size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold group-hover:text-primary transition-colors">Instagram</span>
                                    <span className="text-[10px] text-muted-foreground">@arafaty.dev</span>
                                </div>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                        </a>

                        {/* About.me */}
                        <a
                            href="https://about.me/arafatmbaga"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 text-xs font-medium transition-all hover:border-primary hover:bg-accent hover:shadow-sm group"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                                    <Globe className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold group-hover:text-primary transition-colors">about.me</span>
                                    <span className="text-[10px] text-muted-foreground">arafatmbaga</span>
                                </div>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                        </a>
                    </div>
                </div>

                {/* Direct Action Footer CTAs */}
                <div className="mt-6 flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-border/60">
                    <a
                        href="https://wa.me/255629123246?text=Hi%20Arafat,%20I%20saw%20your%20work%20on%20Senza%20Luce%20Safaris!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow transition-all active:scale-[0.98]"
                    >
                        <WhatsAppIcon size={16} />
                        Chat on WhatsApp
                    </a>
                    <Button
                        variant="outline"
                        onClick={handleShare}
                        className="rounded-xl border-border/80 text-xs font-medium"
                    >
                        {copied ? (
                            <>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-1.5" />
                                Copied Profile Link
                            </>
                        ) : (
                            'Share Portfolio'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
