"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LanguageSwitcherProps {
    variant?: "desktop" | "mobile";
}

const languages = [
    { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
    { code: "it", label: "Italian", nativeLabel: "Italiano", flag: "🇮🇹" },
    { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪" },
    { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
    { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
];

export function LanguageSwitcher({ variant = "desktop" }: LanguageSwitcherProps) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

    const handleLanguageChange = (newLocale: string) => {
        // Get the path without the locale prefix
        const pathWithoutLocale = pathname.replace(/^\/(en|it|de|fr|es)/, '') || '/';

        // Use next-intl's router.push with locale option for proper locale switching
        router.push(pathWithoutLocale, { locale: newLocale });
        setIsOpen(false);
    };

    // Desktop variant - simple dropdown
    if (variant === "desktop") {
        return (
            <div className="relative">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 h-9 px-3 text-sm font-medium hover:bg-muted/50 transition-colors"
                    aria-label={`Change language. Current: ${currentLanguage.label}`}
                >
                    <Globe className="w-4 h-4" />
                    <span className="hidden xl:inline">{currentLanguage.flag}</span>
                    <span className="uppercase text-xs">{locale}</span>
                </Button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50 py-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${locale === lang.code
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "hover:bg-muted/50"
                                        }`}
                                >
                                    <span className="text-lg">{lang.flag}</span>
                                    <div className="flex-1 text-left">
                                        <div className="text-sm">{lang.nativeLabel}</div>
                                        {locale !== lang.code && (
                                            <div className="text-xs text-muted-foreground">{lang.label}</div>
                                        )}
                                    </div>
                                    {locale === lang.code && <Check className="w-4 h-4 text-primary" />}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    }

    // Mobile variant - full list
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>Language / Lingua</span>
            </div>
            <div className="grid grid-cols-2 gap-2 px-4">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${locale === lang.code
                            ? "bg-primary/15 text-primary font-semibold border-2 border-primary/30"
                            : "bg-muted/30 hover:bg-muted/50 border-2 border-transparent"
                            }`}
                    >
                        <span className="text-xl">{lang.flag}</span>
                        <div className="text-left">
                            <div className="text-sm font-medium">{lang.nativeLabel}</div>
                        </div>
                        {locale === lang.code && <Check className="w-4 h-4 ml-auto text-primary" />}
                    </button>
                ))}
            </div>
        </div>
    );
}
