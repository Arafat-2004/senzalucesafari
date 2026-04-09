"use client";

import { Utensils, Wifi, Waves, AirVent, Coffee, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';

export function AccommodationsSection() {
    const t = useTranslations();
    const accommodations = [
        {
            category: t('home.accommodations.luxury.category'),
            rating: 9.2,
            ratingText: t('home.accommodations.luxury.ratingText'),
            priceFrom: 740,
            image: "/images/placeholders/luxury-lodge.jpg",
            features: [t('home.accommodations.features.allMeals'), t('home.accommodations.features.pool'), t('home.accommodations.features.freeWiFi'), t('home.accommodations.features.ac')],
            icons: [Utensils, Waves, Wifi, AirVent],
            link: "/accommodations#luxury"
        },
        {
            category: t('home.accommodations.midrange.category'),
            rating: 8.6,
            ratingText: t('home.accommodations.midrange.ratingText'),
            priceFrom: 520,
            image: "/images/placeholders/midrange-lodge.jpg",
            features: [t('home.accommodations.features.meals'), t('home.accommodations.features.freeWiFi'), t('home.accommodations.features.pool'), t('home.accommodations.features.bar')],
            icons: [Utensils, Wifi, Waves, Coffee],
            link: "/accommodations#midrange"
        },
        {
            category: t('home.accommodations.budget.category'),
            rating: 7.8,
            ratingText: t('home.accommodations.budget.ratingText'),
            priceFrom: 260,
            image: "/images/placeholders/budget-lodge.jpg",
            features: [t('home.accommodations.features.basicRooms'), t('home.accommodations.features.meals'), t('home.accommodations.features.gameDrives'), t('home.accommodations.features.wildlife')],
            icons: [AirVent, Utensils, Car, Utensils],
            link: "/accommodations#budget"
        }
    ];

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-muted/30 to-background">
            <div className="container px-3 sm:px-4 md:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-10 sm:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="mb-3">{t('home.accommodations.title')}</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t('home.accommodations.description')}
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7 lg:gap-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {accommodations.map((item, index) => (
                        <I18nLink key={index} href={item.link as any} className="block group">
                            <Card className="overflow-hidden safari-card h-full border-0 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.category}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-sm font-semibold ${item.rating >= 9 ? 'text-primary' :
                                                item.rating >= 8 ? 'text-primary' : 'text-accent'
                                                }`}>
                                                {item.rating}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{item.ratingText}</span>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-5 space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">{item.category}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {t('home.accommodations.luxury.description')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 flex-wrap">
                                        {item.icons.map((Icon, idx) => (
                                            <div key={idx} className="text-muted-foreground" title={item.features[idx]}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-3 border-t border-border flex items-center justify-between">
                                        <div>
                                            <span className="text-xs text-muted-foreground">{t('home.accommodations.from')}</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-bold text-primary">${item.priceFrom}</span>
                                                <span className="text-sm text-muted-foreground">/{t('home.accommodations.perNight')}</span>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                                            {t('common.viewAll')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </I18nLink>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
