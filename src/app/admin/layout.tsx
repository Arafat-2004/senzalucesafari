'use client';

import Link from "next/link";
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
import { useSessionCheck } from "@/components/system/SessionCheck";
import { motion } from "framer-motion";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/customers", label: "Customers", icon: UserCog },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/tours", label: "Tours", icon: Map },
    { href: "/admin/destinations", label: "Destinations", icon: Compass },
    { href: "/admin/accommodations", label: "Accommodations", icon: Hotel },
    { href: "/admin/vehicles", label: "Vehicles", icon: Car },
    { href: "/admin/blog", label: "Blog Posts", icon: FileText },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
    { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/admin/newsletters", label: "Newsletters", icon: Mail },
    { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
    { href: "/admin/guides", label: "Guides", icon: Users },
    { href: "/admin/users", label: "Admin Users", icon: UserCog },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: ClipboardList },
    { href: "/admin/pricing", label: "Pricing Tool", icon: Calculator },
    { href: "/admin/mfa", label: "MFA Setup", icon: Shield },
    { href: "/admin/settings", label: "Settings", icon: Settings },
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
        } else {
            setResults([])
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
                placeholder="Search...  ⌘K"
                className="pl-9 w-40 lg:w-64 bg-muted/50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            />
            {query && (
                <button
                    onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
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
                            {results.map((result, index) => (
                                <button
                                    key={index}
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

function SidebarContent({ onNavigate, collapsed }: { onNavigate?: () => void; collapsed?: boolean }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full max-h-screen">
            <div className={`p-4 border-b shrink-0 ${collapsed ? 'flex justify-center' : ''}`}>
                <Link href="/admin" className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`} onClick={onNavigate}>
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                        <span className="text-primary-foreground font-bold text-sm">SL</span>
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="font-semibold text-sm leading-none truncate">Senza Luce</p>
                            <p className="text-xs text-muted-foreground">Admin Panel</p>
                        </div>
                    )}
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                {navItems.map((item) => {
                    const isActive = item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={`group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 hover:translate-x-1 ${
                                collapsed ? 'justify-center' : ''
                            } ${
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg border">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className={`p-3 border-t space-y-1 shrink-0 ${collapsed ? 'flex flex-col items-center' : ''}`}>
                <form action={signOut} className={`w-full ${collapsed ? 'flex justify-center' : ''}`}>
                    <Button variant="ghost" className={`w-full justify-start gap-3 text-muted-foreground ${collapsed ? 'justify-center' : ''}`} type="submit" title={collapsed ? 'Sign out' : undefined}>
                        <LogOut className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="truncate">Sign out</span>}
                    </Button>
                </form>
                <Link
                    href="/"
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? 'Back to site' : undefined}
                >
                    <ChevronLeft className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">Back to site</span>}
                </Link>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('admin-sidebar-collapsed');
            return saved === 'true';
        }
        return false;
    });
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('admin-sidebar-collapsed', String(sidebarCollapsed));
        }
    }, [sidebarCollapsed]);

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-muted/30">
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-col border-r bg-background shrink-0 h-full transition-all duration-300 ${
                sidebarCollapsed ? 'w-16' : 'w-64'
            }`}>
                <SidebarContent collapsed={sidebarCollapsed} />
                {/* Collapse Toggle */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute bottom-4 left-2 p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {sidebarCollapsed ? (
                        <PanelLeftOpen className="h-4 w-4" />
                    ) : (
                        <PanelLeftClose className="h-4 w-4" />
                    )}
                </button>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-200 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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
                        <SidebarContent onNavigate={() => setMobileOpen(false)} />
                    </div>
                </aside>
            </div>

            {/* Main Content Container */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                {/* Top Bar */}
                <header className="h-14 border-b bg-background flex items-center px-3 sm:px-4 gap-2 sm:gap-4 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden flex-shrink-0 active:scale-95 transition-transform"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-base sm:text-lg font-semibold hidden sm:block truncate min-w-0 flex-shrink-0">Admin</h1>

                    <div className="flex-1" />

                    {/* Search */}
                    <div className="relative hidden md:block flex-shrink-0">
                        <SearchBox />
                    </div>

                    {/* Notification, Theme, User */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <NotificationDropdown />
                        <ThemeToggle />
                        <Link href="/admin/settings" aria-label="Settings">
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 active:scale-95 transition-transform">
                                <span className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-bold">
                                    A
                                </span>
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* Command Palette */}
                <AdminCommandPalette navItems={navItems} />

                {/* Page Content - Scrollable with fade-in animation */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}