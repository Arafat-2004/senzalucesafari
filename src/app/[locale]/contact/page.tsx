import { Metadata } from "next";
import { companyInfo } from "@/data/company";
import { Mail, Phone, MapPin, MessageCircle, Target, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/components/ui/enquiry-form";
import { HeroSection } from "@/components/ui/hero-section";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/scroll-animation";
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "Contact Us - Senza Luce Safaris",
    description: "Get in touch with Senza Luce Safaris to plan your perfect Tanzania safari adventure.",
};

export default function ContactPage() {
    const t = useTranslations();
    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <HeroSection
                title={t('contact.hero.title')}
                subtitle={t('contact.hero.subtitle')}
                backgroundImage="/images/placeholders/zanzibar-beach.jpg"
                ctaText={t('contact.hero.cta')}
                ctaLink="#enquiry-form"
            />

            <div className="container grid lg:grid-cols-3 gap-8 mb-16">
                {/* Contact Information Cards */}
                <StaggerContainer staggerDelay={0.15}>
                    <StaggerItem>
                        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg text-foreground mb-2">{t('contact.info.email')}</h3>
                            <a href={`mailto:${companyInfo.email}`} className="text-primary hover:underline block mb-2">
                                {companyInfo.email}
                            </a>
                            <p className="text-sm text-muted-foreground">{t('contact.info.emailResponse')}</p>
                        </div>
                    </StaggerItem>

                    <StaggerItem>
                        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Phone className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg text-foreground mb-2">{t('contact.info.phone')}</h3>
                            <a href={`https://wa.me/${companyInfo.whatsapp}`} className="text-primary hover:underline block mb-2">
                                {companyInfo.phone}
                            </a>
                            <p className="text-sm text-muted-foreground">{t('contact.info.phoneAvailability')}</p>
                        </div>
                    </StaggerItem>

                    <StaggerItem>
                        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg text-foreground mb-2">{t('contact.info.visit')}</h3>
                            <p className="text-muted-foreground mb-2">{companyInfo.location}</p>
                            <p className="text-sm text-muted-foreground">{t('contact.info.officeLocation')}</p>
                        </div>
                    </StaggerItem>
                </StaggerContainer>
            </div>

            {/* Enquiry Form */}
            <section id="enquiry-form" className="container mb-16">
                <FadeIn direction="up">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('contact.form.title')}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t('contact.form.description')}
                        </p>
                    </div>
                </FadeIn>
                <FadeIn delay={0.2} direction="up">
                    <EnquiryForm />
                </FadeIn>
            </section>

            {/* Why Choose Us */}
            <section className="container mb-16 bg-muted/30 dark:bg-card rounded-3xl p-8 md:p-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('contact.whyChoose.title')}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t('contact.whyChoose.description')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Target,
                            title: t('contact.whyChoose.tailored.title'),
                            description: t('contact.whyChoose.tailored.description')
                        },
                        {
                            icon: Users,
                            title: t('contact.whyChoose.expertGuides.title'),
                            description: t('contact.whyChoose.expertGuides.description')
                        },
                        {
                            icon: Star,
                            title: t('contact.whyChoose.fiveStar.title'),
                            description: t('contact.whyChoose.fiveStar.description')
                        }
                    ].map((item, index) => (
                        <div key={index} className="text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <item.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
