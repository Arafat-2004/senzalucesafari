"use client";

import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { TrustBadges } from "@/components/ui/trust-badges";
import { companyInfo } from "@/data/company";
import { Mail, Phone, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { EmailIcon } from "@/components/ui/email-icon";
import { NewsletterSignup } from "@/components/ui/newsletter-form";

export const Footer = React.memo(function Footer() {
    return (
        <footer className="relative text-white">
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
                <div className="container px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                    {/* Newsletter Subscription Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center pb-10 mb-10 border-b border-white/10">
                        <div className="lg:col-span-1">
                            <h3 className="text-xl font-bold text-white mb-2">Stay in the Loop</h3>
                            <p className="text-xs sm:text-sm text-white/80">
                                Get exclusive safari tips, special offers, and wildlife updates.
                            </p>
                        </div>
                        <div className="lg:col-span-2">
                            <NewsletterSignup />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-12">
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
                            <p className="text-sm text-white/85 leading-relaxed">
                                Experience the magic of Tanzania with our expert local guides. We offer authentic safari adventures across Serengeti, Ngorongoro, Tarangire, and Zanzibar.
                            </p>

                            {/* Social Media Icons */}
                            <div className="flex space-x-3 pt-2">
                                <a
                                    href="https://instagram.com/senzalucesafaris"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300"
                                    aria-label="Follow us on Instagram"
                                >
                                    <InstagramIcon size={20} />
                                </a>
                                <a
                                    href={`https://wa.me/${companyInfo.whatsapp}?text=Hello!%20I'm%20interested%20in%20booking%20a%20safari.`}
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
                            <h3 className="text-lg font-semibold text-white">Senza Luce Safaris</h3>
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
                                    Contact
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
                                    Contact Us
                                </Link>
                                <Link href="/privacy" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    Privacy Policy
                                </Link>
                                <Link href="/terms" className="text-white/75 hover:text-white hover:translate-x-0.5 transition-all duration-200">
                                    Terms of Service
                                </Link>
                            </nav>
                        </div>

                        {/* Column 4: Contact */}
                        <div className="space-y-6">
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
                                        <a href={`mailto:${companyInfo.email}`} className="text-white/75 hover:text-white transition-colors block">
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

                                <a
                                    href={`https://wa.me/${companyInfo.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-primary hover:bg-primary-dark rounded-full text-white text-sm font-medium shadow-lg shadow-primary/25 transition-all duration-300"
                                >
                                    <WhatsAppIcon size={16} />
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <TrustBadges variant="compact" />

                    <Separator className="my-8 bg-white/20" />

                    {/* Bottom Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
                        <p>&copy; {new Date().getFullYear()} Senza Luce Safaris. All rights reserved.</p>
                        <div className="flex items-center space-x-2">
                            <span>Powered by</span>
                            <span className="font-semibold text-white/85">Senza Luce Safaris</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
});