"use client";

import React from 'react';
import Link from "next/link";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "./whatsapp-icon";
import { COMPANY } from "@/constants";

export const MobileCTABar = React.memo(function MobileCTABar() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-t shadow-2xl safe-area-bottom">
            <div className="flex items-center justify-around py-3 px-2 sm:px-4 max-w-lg mx-auto">
                <a
                    href={`tel:${COMPANY.phone}`}
                    className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors min-w-[64px] py-2"
                    aria-label="Call us"
                >
                    <div className="p-2.5 rounded-full bg-primary/10 min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">Call</span>
                </a>

                <Link
                    href="/enquiry"
                    className="flex flex-col items-center gap-1 min-w-[80px]"
                    aria-label="Enquire now"
                >
                    <div className="bg-brand-green-dark text-white px-5 py-3 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 min-h-[48px] flex items-center justify-center">
                        Enquire Now
                    </div>
                </Link>

                <a
                    href={`https://wa.me/${COMPANY.whatsapp}?text=Hello!%20I'm%20interested%20in%20booking%20a%20safari.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 text-xs text-muted-foreground hover:text-green-600 transition-colors min-w-[64px] py-2"
                    aria-label="Chat on WhatsApp"
                >
                    <div className="p-2.5 rounded-full bg-green-500/10 min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <WhatsAppIcon size={20} className="text-green-600" />
                    </div>
                    <span className="font-medium">WhatsApp</span>
                </a>
            </div>
        </div>
    );
});
