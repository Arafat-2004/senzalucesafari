"use client";

import * as React from "react";
import { useCallback, useMemo } from 'react';
import { usePathname } from "next/navigation";
import { Menu, Phone, Mail, ChevronDown, MapPin, Home, Info, Compass, Map, MessageSquare, X } from "lucide-react";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchTrigger } from "@/components/ui/search-modal";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { cn } from "@/lib/utils";

export const Header = React.memo(function Header() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);
    const t = useTranslations();

    // Memoize nav items to prevent recreation on every render
    const navItems = useMemo(() => [
        { href: "/", label: t('navigation.home'), icon: Home },
        { href: "/about", label: t('navigation.about'), icon: Info },
        { href: "/safaris-tours", label: t('navigation.safarisTours'), icon: Compass },
        { href: "/destinations", label: t('navigation.destinations'), icon: Map },
        { href: "/contact", label: t('navigation.contact'), icon: MessageSquare },
    ], [t]);

    // Memoize handlers
    const handleOpenMenu = useCallback(() => setIsOpen(true), []);
    const handleCloseMenu = useCallback(() => setIsOpen(false), []);

    return (
        <>
            {/* Top Bar - Contact Info */}
            <div className="bg-primary text-white py-1.5 sm:py-2 text-xs sm:text-sm hidden md:block">
                <div className="container flex justify-between items-center px-4 md:px-6">
                    <div className="flex items-center space-x-3 sm:space-x-6 overflow-x-auto">
                        <a href="tel:+255629123246" className="flex items-center space-x-1.5 sm:space-x-2 hover:text-white/80 transition-colors whitespace-nowrap">
                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>+255 629 123 246</span>
                        </a>
                        <a href="mailto:info@senzaluce-safaris.com" className="flex items-center space-x-1.5 sm:space-x-2 hover:text-white/80 transition-colors whitespace-nowrap">
                            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="hidden lg:inline">info@senzaluce-safaris.com</span>
                            <span className="lg:hidden">{t('header.emailUs')}</span>
                        </a>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 hidden sm:block" />
                        <span className="whitespace-nowrap">{t('common.arusha')}</span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
                <div className="container flex h-20 items-center justify-between px-4 md:px-6">
                    {/* Logo */}
                    <Link href="/" prefetch={true} aria-label={`${t('common.appName')} - Go to homepage`} className="flex items-center space-x-2 group">
                        <div className="flex flex-col">
                            <span className="text-2xl md:text-3xl font-bold text-primary tracking-tight leading-none">
                                Senza Luce
                            </span>
                            <span className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                                {t('navigation.home') === 'Accueil' ? 'Safaris' : t('navigation.home') === 'Startseite' ? 'Safaris' : t('navigation.home') === 'Inicio' ? 'Safaris' : 'Safaris'}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch={true}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary relative group",
                                    pathname === item.href
                                        ? "text-primary"
                                        : "text-foreground/70"
                                )}
                            >
                                {item.label}
                                <span className={cn(
                                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 rounded-full",
                                    pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                                )} />
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden lg:flex items-center space-x-3">
                        <SearchTrigger />
                        <ThemeToggle />
                        {/* i18n disabled - Language switcher hidden */}
                        {/* <LanguageSwitcher variant="desktop" /> */}
                        <Link href="/enquiry" prefetch={true} className="inline-flex items-center btn-safari h-9 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90">
                            {t('common.inquireNow')}
                        </Link>
                    </div>

                    {/* Mobile Navigation Toggle - Enhanced */}
                    <div className="lg:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger
                                render={
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-foreground h-10 w-10 relative min-h-[44px] min-w-[44px] group"
                                        aria-label="Open navigation menu"
                                        aria-expanded={isOpen}
                                    />
                                }
                            >
                                <Menu className="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
                                <span className="sr-only">Toggle menu</span>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="w-[90vw] sm:w-[420px] max-w-[420px] p-0 border-l-0 shadow-2xl bg-gradient-to-b from-background via-background to-muted/20"
                            >
                                <div className="flex flex-col h-full overflow-hidden">
                                    {/* Mobile Header */}
                                    <div className="relative py-6 px-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
                                        <Link href="/" prefetch={true} onClick={handleCloseMenu} className="flex flex-col group">
                                            <span className="text-2xl font-bold text-primary tracking-tight leading-none group-hover:scale-105 transition-transform duration-300 origin-left">Senza Luce</span>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">Safaris</span>
                                        </Link>
                                    </div>

                                    {/* Mobile Nav Links - Enhanced with Icons & Animations */}
                                    <nav className="flex flex-col space-y-1 mt-6 flex-1 px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                                        {navItems.map((item, index) => {
                                            const Icon = item.icon;
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    prefetch={true}
                                                    onClick={() => setIsOpen(false)}
                                                    className={cn(
                                                        "group flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 min-h-[56px] relative overflow-hidden",
                                                        "hover:pl-6 active:scale-[0.98]",
                                                        isActive
                                                            ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm"
                                                            : "text-foreground/80 hover:bg-muted/50 hover:text-primary"
                                                    )}
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    {/* Active indicator bar */}
                                                    {isActive && (
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                                                    )}

                                                    {/* Icon with animation */}
                                                    <div className={cn(
                                                        "p-2 rounded-lg transition-all duration-300",
                                                        isActive ? "bg-primary/20 scale-110" : "bg-muted/50 group-hover:bg-primary/10 group-hover:scale-110"
                                                    )}>
                                                        <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                                                    </div>

                                                    {/* Label */}
                                                    <span className={cn(
                                                        "text-base font-semibold tracking-wide transition-all duration-300",
                                                        isActive ? "text-primary" : "group-hover:text-primary"
                                                    )}>
                                                        {item.label}
                                                    </span>

                                                    {/* Arrow for active state */}
                                                    {isActive && (
                                                        <ChevronDown className="ml-auto w-5 h-5 text-primary rotate-[-90deg]" />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </nav>

                                    {/* Mobile CTA & Contact - Enhanced */}
                                    <div className="pt-6 px-5 pb-6 space-y-4 border-t bg-gradient-to-t from-muted/30 to-transparent">
                                        {/* i18n disabled - Language switcher hidden */}
                                        {/* <LanguageSwitcher variant="mobile" /> */}

                                        {/* Theme Toggle */}
                                        <div className="flex items-center justify-between px-2 py-3 rounded-lg bg-muted/30">
                                            <span className="text-sm font-medium text-muted-foreground">{t('header.appearance')}</span>
                                            <ThemeToggle />
                                        </div>

                                        {/* Enquiry Button - Prominent */}
                                        <Link href="/enquiry" onClick={() => setIsOpen(false)} className="w-full flex items-center justify-center gap-2 btn-safari min-h-[52px] text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground">
                                            <MessageSquare className="w-5 h-5" />
                                            <span>{t('common.inquireNow')}</span>
                                        </Link>

                                        {/* Contact Info Cards */}
                                        <div className="space-y-2.5 pt-2">
                                            <a
                                                href="tel:+255629123246"
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 min-h-[52px] group"
                                            >
                                                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                    <Phone className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors">+255 629 123 246</span>
                                            </a>

                                            <a
                                                href="mailto:info@senzaluce-safaris.com"
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 min-h-[52px] group"
                                            >
                                                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                    <Mail className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors break-all">{t('header.emailUs')}</span>
                                            </a>

                                            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-border/50 min-h-[52px]">
                                                <div className="p-2 rounded-full bg-primary/10">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="text-sm font-medium text-foreground/90">{t('common.arusha')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </>
    );
});
