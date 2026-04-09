import { Metadata } from "next";
import Link from "next/link";
import { companyInfo, testimonials } from "@/data/company";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, MapPin, Heart, CheckCircle } from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section";
import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';

export const metadata: Metadata = {
    title: "About Us - Senza Luce Safaris",
    description: "Learn about Senza Luce Safaris - your trusted partner for authentic Tanzania safari experiences.",
};

export default function AboutPage() {
    const t = useTranslations();
    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <HeroSection
                title={t('about.hero.title', { name: companyInfo.name })}
                subtitle={t('about.hero.subtitle')}
                backgroundImage="/images/placeholders/kilimanjaro.jpg"
                ctaText={t('about.hero.cta')}
                ctaLink="/contact"
            />

            {/* Our Values */}
            <section className="container py-16 md:py-24 mb-20">
                <h2 className="text-3xl font-bold mb-8 text-center">{t('about.values.title')}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: ShieldCheck, key: 'safetyComfort' },
                        { icon: Users, key: 'honestGuidance' },
                        { icon: MapPin, key: 'localExpertise' },
                        { icon: Heart, key: 'respectNature' }
                    ].map(({ icon: Icon, key }, index) => (
                        <div key={index} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t(`about.values.${key}.title`)}</h3>
                            <p className="text-muted-foreground">{t(`about.values.${key}.description`)}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Book With Us */}
            <section className="container mb-20 bg-muted p-8 md:p-12 rounded-lg">
                <h2 className="text-3xl font-bold mb-8 text-center">{t('about.whyBook.title')}</h2>
                <ul className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                        <li key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                            <span>{t(`about.whyBook.reasons.${index}`)}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Testimonials */}
            <section className="container mb-20">
                <h2 className="text-3xl font-bold mb-8 text-center">{t('about.testimonials.title')}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.slice(0, 3).map((testimonial) => (
                        <div key={testimonial.id} className="p-6 border rounded-lg">
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-500">★</span>
                                ))}
                            </div>
                            <p className="text-muted-foreground mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                            <div>
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                                {testimonial.tour && (
                                    <p className="text-xs text-primary mt-1">{testimonial.tour}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="container text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">{t('about.cta.title')}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                    {t('about.cta.description')}
                </p>
                <I18nLink href="/contact">
                    <Button size="lg">{t('about.cta.button')}</Button>
                </I18nLink>
            </section>
        </div>
    );
}
