import { Metadata } from "next";
import { companyInfo } from "@/data/company";
import { Mail, Phone, MessageCircle, Target, Users, Star } from "lucide-react";
import { EnquiryForm } from "@/components/ui/enquiry-form";
import { HeroSection } from "@/components/ui/hero-section";
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "Safari Enquiry - Senza Luce Safaris",
    description: "Enquire about your perfect Tanzania safari adventure. Get a personalized quote from our safari experts.",
};

export default function EnquiryPage() {
    const t = useTranslations();
    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <HeroSection
                title={t('enquiry.hero.title')}
                subtitle={t('enquiry.hero.subtitle')}
                backgroundImage="/images/placeholders/zanzibar-beach.jpg"
                ctaText={t('enquiry.hero.cta')}
                ctaLink="#enquiry-form"
            />

            <div className="container grid lg:grid-cols-3 gap-8 mb-16">
                {/* Contact Information Cards */}
                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">{t('enquiry.info.email')}</h3>
                    <a href={`mailto:${companyInfo.email}`} className="text-primary hover:underline block mb-2">
                        {companyInfo.email}
                    </a>
                    <p className="text-sm text-muted-foreground">{t('enquiry.info.emailResponse')}</p>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">{t('enquiry.info.phone')}</h3>
                    <a href={`https://wa.me/${companyInfo.whatsapp}`} className="text-primary hover:underline block mb-2">
                        {companyInfo.phone}
                    </a>
                    <p className="text-sm text-muted-foreground">{t('enquiry.info.phoneAvailability')}</p>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">{t('enquiry.info.quickResponse')}</h3>
                    <p className="text-muted-foreground mb-2">{t('enquiry.info.quote')}</p>
                    <p className="text-sm text-muted-foreground">{t('enquiry.info.responseTime')}</p>
                </div>
            </div>

            {/* Enquiry Form */}
            <section id="enquiry-form" className="container mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('enquiry.form.title')}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t('enquiry.form.description')}
                    </p>
                </div>
                <EnquiryForm />
            </section>

            {/* Why Choose Us */}
            <section className="container mb-16 bg-muted/30 dark:bg-card rounded-3xl p-8 md:p-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('enquiry.whyChoose.title')}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t('enquiry.whyChoose.description')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Target,
                            title: t('enquiry.whyChoose.tailored.title'),
                            description: t('enquiry.whyChoose.tailored.description')
                        },
                        {
                            icon: Users,
                            title: t('enquiry.whyChoose.expertGuides.title'),
                            description: t('enquiry.whyChoose.expertGuides.description')
                        },
                        {
                            icon: Star,
                            title: t('enquiry.whyChoose.fiveStar.title'),
                            description: t('enquiry.whyChoose.fiveStar.description')
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
