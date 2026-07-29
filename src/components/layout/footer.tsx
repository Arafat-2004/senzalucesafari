"use client";

import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { TrustBadges } from "@/components/ui/trust-badges";
import { companyInfo } from "@/data/company";
import { Mail, Phone, MapPin, LockKeyhole } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { EmailIcon } from "@/components/ui/email-icon";
import { ANALYTICS_CONSENT_KEY } from "@/lib/analytics/ga4";
import { NewsletterSignup } from "@/components/ui/newsletter-form";

export const Footer = React.memo(function Footer() {
    return (
        <footer className="relative min-w-0 overflow-hidden pb-[calc(5.75rem+env(safe-area-inset-bottom))] text-white lg:pb-0">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/footer/footer-bg.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={false}
                />
            </div>

            {/* Cinematic dark overlay shadow — 55% base shadow with subtle top/bottom gradients for high text legibility without blurring the image */}
            <div className="absolute inset-0 z-[1] bg-black/55 bg-gradient-to-b from-black/15 via-transparent to-black/35 pointer-events-none" />

            {/* Footer Content */}
            <div className="relative z-10">
                <div className="container min-w-0 px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                    {/* Newsletter Subscription Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center pb-10 mb-10 border-b border-white/10">
                        <div className="lg:col-span-1">
                            <h3 className="text-xl font-bold text-white mb-2">Subscribe to Our Newsletter</h3>
                            <p className="text-xs sm:text-sm text-white/80">
                                Get the latest safari stories, travel tips, and exclusive offers delivered to your inbox.
                            </p>
                        </div>
                        <div className="lg:col-span-2">
                            <NewsletterSignup />
                        </div>
                    </div>

                    <div className="grid min-w-0 grid-cols-1 gap-8 min-[420px]:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-12">
                        {/* Column 1: Company Info */}
                        <div className="min-w-0 space-y-6 min-[420px]:col-span-2 lg:col-span-1">
                            <div className="flex flex-col notranslate" translate="no">
                                <span className="text-2xl font-bold text-white tracking-tight leading-none">
                                    Senza Luce
                                </span>
                                <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                                    Safaris
                                </span>
                            </div>
                            <p className="text-sm text-white/85 leading-relaxed">
                                Experience the magic of Tanzania with our expert local guides. We offer authentic safari adventures across Serengeti, Ngorongoro, Tarangire, and Zanzibar.
                            </p>

                            {/* Social Media Icons */}
                            <div className="flex space-x-3 pt-2">
                                <a
                                    href="https://instagram.com/senzalucesafari"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300"
                                    aria-label="Follow us on Instagram"
                                >
                                    <InstagramIcon size={20} />
                                </a>
                                <a
                                    href={`https://wa.me/255699209980?text=${encodeURIComponent("Jambo Senza Luce Safaris! I'm visiting your website and would like to inquire about booking a safari tour. Please let me know the available packages and pricing.")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300"
                                    aria-label="Chat with us on WhatsApp"
                                >
                                    <WhatsAppIcon size={20} />
                                </a>
                                <a
                                    href={`mailto:${companyInfo.email}`}
                                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300"
                                    aria-label="Send us an email"
                                >
                                    <EmailIcon size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Company Links */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white notranslate" translate="no">Senza Luce Safari</h3>
                            <nav className="flex flex-col space-y-3 text-sm">
                                <Link href="/" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    Home
                                </Link>
                                <Link href="/about" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    About Us
                                </Link>
                                <Link href="/safaris-tours" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    Safari & Tours
                                </Link>
                                <Link href="/destinations" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    Destinations
                                </Link>
                                <Link href="/vehicles" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    Our Vehicles
                                </Link>
                                <Link href="/contact" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    Safari Inquiry
                                </Link>
                            </nav>
                        </div>

                        {/* Column 3: Quick Links */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                            <nav className="flex flex-col space-y-3 text-sm">
                                <Link href="/accommodations" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    Accommodations
                                </Link>
                                <Link href="/blog" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    Blog
                                </Link>
                                <Link href="/faq" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    FAQ
                                </Link>
                                <Link href="/support" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    Help & Support
                                </Link>
                                <Link href="/privacy" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    Privacy Policy
                                </Link>
                                <Link href="/terms" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    Terms of Service
                                </Link>
                                <a href="/admin/login" rel="nofollow" className="mt-2 inline-flex items-center gap-2 text-xs text-white/50 transition-colors hover:text-white/80">
                                    <LockKeyhole className="h-3.5 w-3.5" />
                                    Staff Portal
                                </a>
                            </nav>
                        </div>

                        {/* Column 4: Contact */}
                        <div className="min-w-0 space-y-6 min-[420px]:col-span-2 lg:col-span-1">
                            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-start space-x-3">
                                    <Phone className="w-5 h-5 text-white/75 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <a href={`tel:${companyInfo.phone}`} className="text-white/75 hover:text-white transition-colors block">
                                            {companyInfo.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Mail className="w-5 h-5 text-white/75 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <a href={`mailto:${companyInfo.email}`} className="block break-all text-white/75 transition-colors hover:text-white">
                                            {companyInfo.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-white/75 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="text-white/75">
                                            Arusha, Tanzania
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <TrustBadges variant="compact" />

                    <Separator className="my-8 bg-white/20" />

                    {/* Bottom Bar */}
                    <div className="flex flex-col items-center justify-between gap-3 text-center text-xs text-white/70 sm:text-sm md:flex-row md:text-left">
                        <p>&copy; {new Date().getFullYear()} <span className="notranslate" translate="no">Senza Luce Safari</span>. All rights reserved.</p>
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, 'necessary');
                                    window.dispatchEvent(new Event('cookie-consent-changed'));
                                    const settingsUrl = new URL(window.location.href);
                                    settingsUrl.searchParams.set('cookie-settings', '1');
                                    window.location.assign(settingsUrl.toString());
                                }}
                                className="text-white/70 underline-offset-2 transition-colors hover:text-white hover:underline"
                            >
                                Cookie settings
                            </button>
                            <span aria-hidden="true">·</span>
                            <span>Powered by</span>
                            <span className="font-semibold text-white/85 notranslate" translate="no">Senza Luce Safari</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
});
