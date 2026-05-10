"use client";

import * as React from "react";
import { useCallback, useMemo, useEffect, useState } from 'react';
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, ChevronDown, MapPin, Home, Info, Compass, Map, MessageSquare, FileText, Search, Heart } from "lucide-react";
import Link from 'next/link';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchTrigger, MobileSearchTrigger } from "@/components/ui/search-modal";
import { FavouriteBadge } from "@/components/ui/favourite-badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { COMPANY } from "@/constants";

export const Header = React.memo(function Header() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Scroll lock when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Memoize nav items to prevent recreation on every render
    const navItems = useMemo(() => [
        { href: "/", label: 'Home', icon: Home },
        { href: "/about", label: 'About Us', icon: Info },
        { href: "/safaris-tours", label: 'Safari & Tours', icon: Compass },
        { href: "/destinations", label: 'Destinations', icon: Map },
        { href: "/blog", label: 'Blog', icon: FileText },
        { href: "/favourites", label: 'Favourites', icon: Heart },
        { href: "/contact", label: 'Contact', icon: MessageSquare },
    ], []);

    // Memoize handlers
    const handleCloseMenu = useCallback(() => setIsOpen(false), []);

    return (
        <>
            {/* Top Bar - Contact Info */}
            <div className="bg-primary text-white py-1.5 sm:py-2 text-xs sm:text-sm hidden md:block">
                <div className="container mx-auto flex justify-between items-center px-4 md:px-6 lg:px-8">
                    <div className="flex items-center space-x-3 sm:space-x-6 overflow-x-auto">
                        <a href={`tel:${COMPANY.phone}`} className="flex items-center space-x-1.5 sm:space-x-2 hover:text-white/80 transition-colors whitespace-nowrap">
                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>{COMPANY.phoneDisplay}</span>
                        </a>
                        <a href={`mailto:${COMPANY.email}`} className="flex items-center space-x-1.5 sm:space-x-2 hover:text-white/80 transition-colors whitespace-nowrap">
                            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="hidden lg:inline">{COMPANY.email}</span>
                            <span className="lg:hidden">Email Us</span>
                        </a>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 hidden sm:block" />
                        <span className="whitespace-nowrap">Arusha, Tanzania</span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6 lg:px-8">
                    {/* Logo - Left Aligned */}
                    <Link href="/" prefetch={true} aria-label="Senza Luce Safaris - Go to homepage" className="flex items-center space-x-2 group flex-shrink-0">
                        <div className="flex flex-col">
                            <span className="text-2xl md:text-3xl font-bold text-primary tracking-tight leading-none">
                                Senza Luce
                            </span>
                            <span className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                                Safaris
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Left Aligned Next to Logo */}
                    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 ml-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch={true}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary relative group whitespace-nowrap",
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

                    {/* Spacer to push CTA to right */}
                    <div className="hidden lg:flex flex-1" />

                    {/* CTA Button - Right Aligned */}
                    <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
                        <SearchTrigger />
                        <FavouriteBadge />
                        <ThemeToggle />
                        {/* i18n disabled - Language switcher hidden */}
                        {/* <LanguageSwitcher variant="desktop" /> */}
                        <Link href="/enquiry" prefetch={true} className={buttonVariants({ variant: "safari" })}>
                            Inquire Now
                        </Link>
                    </div>

                    {/* Mobile Right Actions */}
                    <div className="flex lg:hidden items-center gap-1">
                        <MobileSearchTrigger />
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                            aria-label="Open navigation menu"
                            aria-expanded={isOpen}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay - Rendered OUTSIDE header to avoid backdrop-filter containing block */}
            {isOpen && (
                <div className="fixed inset-0 z-[200] lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleCloseMenu}
                        aria-hidden="true"
                    />
                    {/* Sliding panel from the right */}
                    <div
                        className="absolute top-0 right-0 h-full w-[85vw] max-w-[320px] bg-background shadow-2xl flex flex-col"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                    >
                        {/* Panel header row */}
                        <div className="flex items-center justify-between px-4 py-4 border-b border-border shrink-0">
                            <Link href="/" onClick={handleCloseMenu} className="flex flex-col">
                                <span className="text-xl font-bold text-primary tracking-tight leading-none">Senza Luce</span>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">Safaris</span>
                            </Link>
                            <button
                                onClick={handleCloseMenu}
                                className="p-2 rounded-md hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center"
                                aria-label="Close navigation menu"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Nav links - scrollable area */}
                        <nav className="flex-1 overflow-y-auto py-2 px-3" aria-label="Mobile navigation">
                            {navItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        prefetch={true}
                                        onClick={handleCloseMenu}
                                        className={cn(
                                            "flex items-center gap-4 w-full py-4 px-4 my-1 text-base font-medium rounded-lg hover:bg-muted transition-colors min-h-[44px] border-b border-border/40 last:border-0",
                                            isActive
                                                ? "text-primary bg-primary/10"
                                                : "text-foreground"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-2 rounded-lg",
                                            isActive ? "bg-primary/20" : "bg-muted/50"
                                        )}>
                                            <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                                        </div>
                                        <span>{item.label}</span>
                                        {isActive && (
                                            <ChevronDown className="ml-auto w-4 h-4 text-primary rotate-[-90deg]" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Bottom section */}
                        <div className="p-4 border-t border-border shrink-0 space-y-3">
                            {/* Theme Toggle */}
                            <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-muted/30">
                                <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                                <ThemeToggle />
                            </div>

                            {/* CTA button */}
                            <Link href="/enquiry" onClick={handleCloseMenu} className={cn(buttonVariants({ variant: "safari" }), "w-full")}>
                                <MessageSquare className="w-5 h-5" />
                                <span>Inquire Now</span>
                            </Link>

                            {/* Contact info */}
                            <a
                                href={`tel:${COMPANY.phone}`}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors min-h-[44px]"
                            >
                                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-sm text-foreground/90">{COMPANY.phoneDisplay}</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});
