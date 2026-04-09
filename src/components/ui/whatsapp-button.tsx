'use client';

import { useState, useEffect } from 'react';
import { WhatsAppIcon } from './whatsapp-icon';
import { companyInfo } from '@/data/company';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatsAppButtonProps {
    phoneNumber?: string;
    message?: string;
    position?: 'bottom-right' | 'bottom-left';
}

/**
 * Official WhatsApp Floating Button
 * 
 * Features:
 * - Real WhatsApp icon (official SVG)
 * - Floating button with pulse animation
 * - Tooltip on hover
 * - Opens WhatsApp chat with pre-filled message
 * - Mobile responsive
 */
export function WhatsAppButton({
    phoneNumber,
    message = "Hello! I'm interested in booking a safari.",
    position = 'bottom-right'
}: WhatsAppButtonProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const phone = phoneNumber || companyInfo.whatsapp;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Show button after a short delay for better UX
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Auto-hide tooltip after 3 seconds
    useEffect(() => {
        if (showTooltip) {
            const timer = setTimeout(() => {
                setShowTooltip(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showTooltip]);

    const positionClasses = position === 'bottom-right'
        ? 'bottom-24 lg:bottom-8 right-4 lg:right-8'
        : 'bottom-24 lg:bottom-8 left-4 lg:left-8';

    if (!isVisible) {
        return null;
    }

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.2
            }}
            className={`fixed ${positionClasses} z-50`}
        >
            {/* Pulse Animation Background */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    className="absolute inset-0 rounded-full bg-green-500"
                />
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className={`absolute bottom-full mb-3 ${position === 'bottom-right' ? 'right-0' : 'left-0'
                            }`}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 min-w-[180px] border border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Chat with us on WhatsApp! 👋
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                We typically reply within minutes
                            </p>
                            {/* Tooltip Arrow */}
                            <div className={`absolute bottom-0 w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45 ${position === 'bottom-right' ? 'right-6' : 'left-6'
                                } -mb-1.5`} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* WhatsApp Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative block w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Chat with us on WhatsApp"
                title="Chat with us on WhatsApp"
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <WhatsAppIcon size={36} className="text-white" />
                </div>
            </a>

            {/* Mobile Label */}
            <div className="lg:hidden absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow">
                    WhatsApp
                </span>
            </div>
        </motion.div>
    );
}

export default WhatsAppButton;
