"use client";

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { TrustBadges } from "@/components/ui/trust-badges";
import { companyInfo } from "@/data/company";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { EmailIcon } from "@/components/ui/email-icon";

export const Footer = React.memo(function Footer() {
    const t = useTranslations();

    // Memoize email subject to prevent recreation
    const emailSubject = useMemo(() =>
        encodeURIComponent('Safari Inquiry from Website'),
        []
    );

    return (
        <footer className="relative text-white">
            {/* Fixed Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/footer/footer-bg.jpg"
                    alt="Footer Background"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={false}
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/85 to-black/75" />
            </div>

            {/* Footer Content - Positioned above background */}
            <div className="relative z-10">
                {/* Main Footer Content */}
                <div className="container px-4 py-16 md:px-6 lg:py-20">
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                        {/* Column 1: Company Info */}
                        <div className="space-y-6">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-white tracking-tight leading-none">
                                    Senza Luce
                                </span>
                                <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                                    Safaris
                                </span>
                            </div>
                            <p className="text-sm text-white/80 leading-relaxed">
                                {t('footer.description')}
                            </p>

                            {/* Social Media Icons */}
                            <div className="flex space-x-3 pt-2">
                                <a
                                    href="https://instagram.com/senzalucesafaris"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                                    aria-label="Follow us on Instagram"
                                >
                                    <InstagramIcon size={20} />
                                </a>
                                <a
                                    href={`https://wa.me/${companyInfo.whatsapp}?text=Hello!%20I'm%20interested%20in%20booking%20a%20safari.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                                    aria-label="Chat with us on WhatsApp"
                                >
                                    <WhatsAppIcon size={20} />
                                </a>
                                <a
                                    href={`mailto:${companyInfo.email}`}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                                    aria-label="Send us an email"
                                >
                                    <EmailIcon size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Company Links */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white">{t('common.appName')}</h3>
                            <nav className="flex flex-col space-y-3 text-sm">
                                <Link href="/" className="text-white/70 hover:text-white transition-colors">
                                    {t('navigation.home')}
                                </Link>
                                <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                                    {t('navigation.about')}
                                </Link>
                                <Link href="/safaris-tours" className="text-white/70 hover:text-white transition-colors">
                                    {t('navigation.safarisTours')}
                                </Link>
                                <Link href="/destinations" className="text-white/70 hover:text-white transition-colors">
                                    {t('navigation.destinations')}
                                </Link>
                                <Link href="/vehicles" className="text-white/70 hover:text-white transition-colors">
                                    {t('navigation.vehicles')}
                                </Link>
                                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                                    {t('navigation.contact')}
                                </Link>
                            </nav>
                        </div>

                        {/* Column 3: Quick Links */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white">{t('footer.quickLinks')}</h3>
                            <nav className="flex flex-col space-y-3 text-sm">
                                <Link href="/vehicles" className="text-white/70 hover:text-white transition-colors">
                                    {t('navigation.vehicles')}
                                </Link>
                                <Link href="/blog" className="text-white/70 hover:text-white transition-colors">
                                    {t('navigation.blog')}
                                </Link>
                                <Link href="/faq" className="text-white/70 hover:text-white transition-colors">
                                    {t('navigation.faq')}
                                </Link>
                                <Link href="/support" className="text-white/70 hover:text-white transition-colors">
                                    {t('common.contactUs')}
                                </Link>
                                <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">
                                    {t('footer.privacyPolicy')}
                                </Link>
                                <Link href="/terms" className="text-white/70 hover:text-white transition-colors">
                                    {t('footer.termsOfService')}
                                </Link>
                            </nav>
                        </div>

                        {/* Column 4: Contact */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white">{t('footer.contactInfo')}</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-start space-x-3">
                                    <Phone className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <a href={`tel:${companyInfo.phone}`} className="text-white/70 hover:text-white transition-colors block">
                                            {companyInfo.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Mail className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <a href={`mailto:${companyInfo.email}`} className="text-white/70 hover:text-white transition-colors block">
                                            {companyInfo.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="text-white/70">
                                            {t('common.arusha')}
                                        </span>
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/${companyInfo.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white text-sm font-medium transition-colors"
                                >
                                    <WhatsAppIcon size={16} />
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <TrustBadges variant="compact" />

                    <Separator className="my-8 bg-white/10" />

                    {/* Bottom Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
                        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
                        <div className="flex items-center space-x-2">
                            <span>{t('footer.poweredBy')}</span>
                            <span className="font-semibold text-white/80">Senza Luce Safaris</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
});
