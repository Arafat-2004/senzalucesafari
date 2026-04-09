"use client";

import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    const t = useTranslations();

    return (
        <nav aria-label="Breadcrumb" className={cn("container py-4", className)}>
            <ol className="flex items-center space-x-2 text-sm">
                {/* Home Icon */}
                <li>
                    <I18nLink
                        href="/"
                        className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                        aria-label={t('breadcrumb.goToHomepage')}
                    >
                        <Home className="w-4 h-4" />
                    </I18nLink>
                </li>

                {/* Breadcrumb Items */}
                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />

                        {item.href ? (
                            <I18nLink
                                href={item.href}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                {item.label}
                            </I18nLink>
                        ) : (
                            <span className="text-foreground font-medium" aria-current="page">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
