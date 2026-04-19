'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "./actions";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { NotificationDropdown } from "@/components/admin/notification-dropdown";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
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
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <Link href="/admin" className="flex items-center gap-2" onClick={onNavigate}>
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">SL</span>
                    </div>
                    <div>
                        <p className="font-semibold text-sm leading-none">Senza Luce</p>
                        <p className="text-xs text-muted-foreground">Admin Panel</p>
                    </div>
                </Link>
            </div>

            <ScrollArea className="flex-1 px-3 py-2">
                <nav className="space-y-1">
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
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            <div className="p-3 border-t space-y-2">
                <form action={signOut}>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" type="submit">
                        <LogOut className="h-4 w-4" />
                        Sign out
                    </Button>
                </form>
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to site
                </Link>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-muted/30">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col border-r bg-background">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
                    <aside className="fixed inset-y-0 left-0 w-64 bg-background shadow-xl z-50">
                        <div className="absolute top-3 right-3">
                            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <SidebarContent onNavigate={() => setMobileOpen(false)} />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-14 border-b bg-background flex items-center px-4 gap-4 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-semibold hidden md:block">Admin Dashboard</h1>

                    <div className="flex-1" />

                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 w-64 bg-muted/50"
                            suppressHydrationWarning
                        />
                    </div>

                    {/* Notifications */}
                    <NotificationDropdown />

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* User Menu */}
                    <Link href="/admin/settings">
                        <Button variant="ghost" size="icon">
                            <span className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-bold">
                                A
                            </span>
                        </Button>
                    </Link>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}