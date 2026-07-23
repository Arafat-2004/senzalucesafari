'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "./actions";
import { useState, useCallback, useEffect, useRef } from "react";
import {
    LayoutDashboard,
    Map,
    Compass,
    Hotel,
    Car,
    FileText,
    Star,
    CalendarCheck,
    MessageSquare,
    Mail,
    HelpCircle,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    Search,
    UserCog,
    BarChart3,
    Bell,
    ClipboardList,
    Shield,
    Loader2,
    Calculator,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "@/components/ui/input";
import { NotificationDropdown } from "@/components/admin/notification-dropdown";
import { AdminCommandPalette } from "@/components/admin/command-palette";
import { Breadcrumb } from "@/components/ui/breadcrumb-nav";
import { motion } from "framer-motion";
import { AdminPwaInstall } from '@/components/admin/admin-pwa-install';

const navGroups = [
    {
        title: "Core Operations",
        items: [
            { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/customers", label: "Customers", icon: Users, permission: "bookings" },
            { href: "/admin/analytics", label: "Analytics", icon: BarChart3, permission: "analytics" },
            { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, permission: "bookings" },
            { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare, permission: "inquiries" },
        ]
    },
    {
        title: "Inventory & Assets",
        items: [
            { href: "/admin/tours", label: "Tours", icon: Map, permission: "tours" },
            { href: "/admin/destinations", label: "Destinations", icon: Compass, permission: "destinations" },
            { href: "/admin/accommodations", label: "Accommodations", icon: Hotel, permission: "tours" },
            { href: "/admin/vehicles", label: "Vehicles", icon: Car, permission: "tours" },
            { href: "/admin/transfers", label: "Transfers", icon: Car, permission: "bookings" },
        ]
    },
    {
        title: "Marketing & Content",
        items: [
            { href: "/admin/blog", label: "Blog Posts", icon: FileText, permission: "tours" },
            { href: "/admin/reviews", label: "Reviews", icon: Star, permission: "reviews" },
            { href: "/admin/newsletters", label: "Newsletters", icon: Mail, permission: "tours" },
            { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, permission: "tours" },
            { href: "/admin/guides", label: "Guides", icon: Users, permission: "tours" },
        ]
    },
    {
        title: "System Admin",
        items: [
            { href: "/admin/users", label: "Admin Users", icon: UserCog, permission: "users" },
            { href: "/admin/notifications", label: "Notifications", icon: Bell },
            { href: "/admin/audit-logs", label: "Audit Logs", icon: ClipboardList, permission: "settings" },
            { href: "/admin/pricing", label: "Pricing Tool", icon: Calculator, permission: "bookings" },
            { href: "/admin/mfa", label: "MFA Setup", icon: Shield },
            { href: "/admin/settings", label: "Settings", icon: Settings, permission: "settings" },
            { href: "/admin/help", label: "User Manual", icon: HelpCircle },
        ]
    }
];

interface SearchResult {
    type: string;
    title: string;
    href: string;
    subtitle?: string;
}

function SearchBox() {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleSearch = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setResults([])
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/admin/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery }),
            })
            const data = await response.json()
            setResults(data.results || [])
        } catch {
            setResults([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }
        
        if (query.length >= 2) {
            debounceRef.current = setTimeout(() => {
                handleSearch(query)
            }, 300)
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [query, handleSearch])

    const handleSelect = (href: string) => {
        setIsOpen(false)
        setQuery('')
        router.push(href)
    }

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                ref={inputRef}
                placeholder="Search..."
                className="h-11 w-48 rounded-xl border-border/70 bg-muted/40 pl-10 shadow-none lg:w-72"
                value={query}
                onChange={(e) => {
                    const nextQuery = e.target.value;
                    setQuery(nextQuery);
                    if (nextQuery.length < 2) setResults([]);
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            />
            {query && (
                <button
                    onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
            {isOpen && query.length >= 2 && (
                <div className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg border bg-background shadow-lg z-50">
                    {isLoading ? (
                        <div className="p-4 flex items-center justify-center">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            {results.map((result) => (
                                <button
                                    key={result.href}
                                    onClick={() => handleSelect(result.href)}
                                    className="w-full px-4 py-2 text-left hover:bg-muted flex flex-col gap-0.5"
                                >
                                    <span className="text-sm font-medium">{result.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {result.type} {result.subtitle && `· ${result.subtitle}`}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function SidebarContent({
    onNavigate,
    collapsed,
    sidebarCollapsed,
    setSidebarCollapsed,
    groups = navGroups,
}: {
    onNavigate?: () => void;
    collapsed?: boolean;
    sidebarCollapsed?: boolean;
    setSidebarCollapsed?: (c: boolean) => void;
    groups?: typeof navGroups;
}) {
    const pathname = usePathname();



    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
            <div className={`flex h-20 shrink-0 items-center border-b px-4 ${collapsed ? 'justify-center' : ''}`}>
                <Link href="/admin" className={`group flex min-w-0 items-center gap-3 rounded-xl ${collapsed ? 'justify-center' : ''}`} onClick={onNavigate} aria-label="Senza Luce Safaris Admin dashboard">
                    {/* Icon mark — simple compass ring, no text label */}
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-border bg-accent shadow-sm transition-transform group-hover:scale-[1.03]">
                        <Image src="/icons/icon-192x192.png" alt="" fill sizes="44px" className="object-cover" priority />
                    </div>
                    {!collapsed && (
                        <span className="flex h-11 min-w-0 flex-col justify-center gap-1">
                            <span className="block truncate text-base font-bold leading-5 tracking-tight text-foreground">Senza Luce</span>
                            <span className="block truncate text-[11px] font-medium uppercase leading-4 tracking-[0.16em] text-muted-foreground">Safaris Admin</span>
                        </span>
                    )}
                </Link>
            </div>

            {/* Scrollable Navigation Area */}
            <nav className="scrollbar-hide min-h-0 flex-1 overflow-y-auto px-3 py-3 space-y-4">
                {groups.map((group) => (
                    <div key={group.title} className="space-y-1">
                        {!collapsed && (
                            <h4 className="px-3 pt-2 pb-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                {group.title}
                            </h4>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = item.href === "/admin"
                                    ? pathname === "/admin"
                                    : pathname.startsWith(item.href);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onNavigate}
                                        aria-current={isActive ? "page" : undefined}
                                        className={`group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                                            collapsed ? 'justify-center' : ''
                                        } ${
                                            isActive
                                                ? "bg-accent text-accent-foreground font-semibold"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                                        }`}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        {/* Active left accent bar */}
                                        {isActive && !collapsed && (
                                            <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary" aria-hidden="true" />
                                        )}
                                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                                        {!collapsed && <span className="truncate">{item.label}</span>}
                                        {collapsed && (
                                            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg border">
                                                {item.label}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom Actions Area */}
            <div className={`p-3 border-t bg-muted/10 shrink-0 space-y-1.5 ${collapsed ? 'flex flex-col items-center' : ''}`}>
                <Link
                    href="/"
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-primary hover:bg-accent transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? 'Back to site' : undefined}
                >
                    <ChevronLeft className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">Back to site</span>}
                </Link>

                <div className="border-t border-border/80 pt-1.5 w-full">
                    <form action={signOut} className={`w-full ${collapsed ? 'flex justify-center' : ''}`}>
                        <Button
                            variant="ghost"
                            className={`w-full h-11 py-2.5 justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all font-medium ${collapsed ? 'justify-center' : ''}`}
                            type="submit"
                            aria-label="Sign out"
                            title={collapsed ? 'Sign out' : undefined}
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            {!collapsed && <span className="truncate">Sign out</span>}
                        </Button>
                    </form>
                </div>

                {/* Inline Desktop Collapse Toggle Button */}
                {setSidebarCollapsed && (
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className={`hidden lg:flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full ${
                            collapsed ? 'mt-2 h-9 w-9' : 'mt-1 text-xs gap-2 justify-start px-3 py-2 h-9'
                        }`}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? (
                            <PanelLeftOpen className="h-4 w-4" />
                        ) : (
                            <>
                                <PanelLeftClose className="h-4 w-4 shrink-0" />
                                <span>Collapse Menu</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userInitial, setUserInitial] = useState('A');
    const [access, setAccess] = useState<{ role: string; permissions: Record<string, string[]> } | null>(null);
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";

    // Fetch user info for avatar and persist sidebar state
    useEffect(() => {
        // Restore sidebar collapse state from localStorage
        const saved = localStorage.getItem('admin-sidebar-collapsed');
        // Restoring a persisted UI preference requires a post-hydration state sync.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (saved === 'true') setSidebarCollapsed(true);

        // Fetch user info for avatar initial
        fetch('/api/admin/auth-check')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.session?.firstName) {
                    setUserInitial(data.session.firstName.charAt(0).toUpperCase());
                }
                if (data?.session?.role) {
                    setAccess({
                        role: data.session.role.name,
                        permissions: data.session.role.permissions ?? {},
                    });
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('admin-sidebar-collapsed', String(sidebarCollapsed));
        }
    }, [sidebarCollapsed]);

    useEffect(() => {
        if (!mobileOpen) return;
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMobileOpen(false);
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleEscape);
        };
    }, [mobileOpen]);

    if (isLoginPage) {
        return <div data-admin-theme className="contents"><link rel="manifest" href="/admin-manifest.json" /><meta name="robots" content="noindex,nofollow,noarchive" />{children}</div>;
    }

    const visibleNavGroups = navGroups
        .map(group => ({
            ...group,
            items: group.items.filter(item => {
                if (!('permission' in item) || !item.permission) return true;
                if (!access) return false;
                if (access.role === 'super_admin') return true;
                return (access.permissions[item.permission] ?? []).includes('VIEW');
            }),
        }))
        .filter(group => group.items.length > 0) as typeof navGroups;
    const visibleNavItems = visibleNavGroups.flatMap(group => group.items);

    return (
        <div data-admin-theme data-admin-shell className="flex h-dvh overflow-hidden bg-background">
            <link rel="manifest" href="/admin-manifest.json" />
            <meta name="robots" content="noindex,nofollow,noarchive" />
            <meta name="theme-color" content="#1f6b3b" />
            {/* Skip Link for Keyboard Users */}
            <a
                href="#admin-main"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-medium"
            >
                Skip to main content
            </a>
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-col border-r bg-background shrink-0 h-full transition-all duration-300 ${
                sidebarCollapsed ? 'w-16' : 'w-64'
            }`}>
                <SidebarContent
                    collapsed={sidebarCollapsed}
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                    groups={visibleNavGroups}
                />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && <div
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className="fixed inset-0 z-50 lg:hidden"
            >
                <div
                    className="fixed inset-0 bg-black/50"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
                <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-background shadow-xl z-50 flex flex-col h-full max-h-screen overflow-hidden">
                    <div className="absolute top-3 right-3 z-10">
                        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-hidden h-full">
                        <SidebarContent
                            onNavigate={() => setMobileOpen(false)}
                            collapsed={false}
                            sidebarCollapsed={false}
                            groups={visibleNavGroups}
                        />
                    </div>
                </aside>
            </div>}

            {/* Main Content Container */}
            <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
                {/* Top Bar - 64px height for adequate touch targets */}
                <header className="z-30 flex h-20 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:px-6 lg:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden flex-shrink-0 active:scale-95 transition-transform min-h-[44px] min-w-[44px]"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="hidden min-w-0 flex-shrink-0 truncate text-xl font-semibold tracking-tight sm:block">
                        {visibleNavItems.find(item => pathname === item.href || pathname.startsWith(item.href + '/'))?.label ?? 'Dashboard'}
                    </h1>

                    <div className="flex-1 min-w-4" />

                    {/* Search - accessible on tablet+ */}
                    <div className="relative hidden sm:block flex-shrink-0">
                        <SearchBox />
                    </div>

                    {/* Notification, Theme, User - with minimum touch targets */}
                    <div className="flex shrink-0 items-center gap-1 rounded-xl border bg-muted/20 p-1 sm:gap-1.5">
                        <AdminPwaInstall />
                        <NotificationDropdown />
                        <ThemeToggle />
                        <Link href="/admin/settings" aria-label="Settings">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg active:scale-95 transition-transform">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ring-2 ring-background">
                                    {userInitial}
                                </span>
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* Command Palette */}
                <AdminCommandPalette navItems={visibleNavItems} />

                {/* Page Content - Scrollable with fade-in animation */}
                <main id="admin-main" tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto bg-muted/45 px-4 py-5 focus:outline-none sm:px-6 sm:py-6 lg:px-8 lg:py-7">
                    <div className="mx-auto w-full max-w-7xl">
                        <Breadcrumb homeLabel="Dashboard" className="mb-4" />
                        <motion.div
                            className="min-w-0"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
