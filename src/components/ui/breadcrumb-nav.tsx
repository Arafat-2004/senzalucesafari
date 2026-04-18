"use client";

import Link from 'next/link';
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
    className?: string;
    homeLabel?: string;
}

export function Breadcrumb({ className, homeLabel }: BreadcrumbProps) {
    const pathname = usePathname();
    const homeLabelDefault = homeLabel || 'Home';

    // Pathname is already clean (no locale prefix)
    const cleanPathname = pathname === '/' ? '' : pathname;

    // Split path into segments and filter empty strings
    const pathSegments = cleanPathname.split("/").filter(Boolean);

    // Build breadcrumb items
    const breadcrumbs = [
        { label: homeLabelDefault, href: "/" },
        ...pathSegments.map((segment, index) => {
            const href = "/" + pathSegments.slice(0, index + 1).join("/");
            // Convert slug to readable label
            const label = segment
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());
            return { label, href };
        })
    ];

    if (cleanPathname === "/" || cleanPathname === "") return null;

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("flex items-center gap-2 text-sm text-muted-foreground py-4", className)}
        >
            <ol className="flex items-center gap-2 flex-wrap">
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <li key={item.href} className="flex items-center gap-2">
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                            )}

                            {isLast ? (
                                <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-none">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    {index === 0 && <Home className="w-4 h-4" />}
                                    <span className={index === 0 ? "hidden sm:inline" : ""}>
                                        {item.label}
                                    </span>
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
