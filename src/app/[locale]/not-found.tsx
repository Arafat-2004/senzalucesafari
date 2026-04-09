"use client";

import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
    const t = useTranslations();

    return (
        <div className="container py-24 md:py-32">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('notFound.title')}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                    {t('notFound.description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <I18nLink
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white hover:bg-primary/90 rounded-md font-medium text-lg transition-colors"
                    >
                        <Home className="mr-2 h-5 w-5" />
                        {t('notFound.goHome')}
                    </I18nLink>
                    <I18nLink
                        href="/contact"
                        className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary hover:bg-primary/5 rounded-md font-medium text-lg transition-colors"
                    >
                        <Search className="mr-2 h-5 w-5" />
                        {t('notFound.contactSupport')}
                    </I18nLink>
                </div>

                <div className="mt-12 p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-4">{t('notFound.popularPages')}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <I18nLink href="/destinations" className="text-primary hover:underline">
                            {t('navigation.destinations')}
                        </I18nLink>
                        <I18nLink href="/safaris-tours" className="text-primary hover:underline">
                            {t('navigation.safarisTours')}
                        </I18nLink>
                        <I18nLink href="/about" className="text-primary hover:underline">
                            {t('navigation.about')}
                        </I18nLink>
                        <I18nLink href="/contact" className="text-primary hover:underline">
                            {t('navigation.contact')}
                        </I18nLink>
                    </div>
                </div>
            </div>
        </div>
    );
}
