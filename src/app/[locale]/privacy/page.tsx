import { Metadata } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, Shield, Calendar } from "lucide-react";
import LegalTableOfContents from "@/components/ui/legal-toc";
import MobileTableOfContents from "@/components/ui/mobile-toc";

export const metadata: Metadata = {
    title: "Privacy Policy - Senza Luce Safaris",
    description: "Learn how Senza Luce Safaris collects, uses, and protects your personal information. Your privacy is our priority.",
};

export default function PrivacyPolicyPage() {
    const t = useTranslations();
    const sections = [
        { id: "introduction", title: "1. Introduction" },
        { id: "information-collect", title: "2. Information We Collect" },
        { id: "how-we-use", title: "3. How We Use Your Information" },
        { id: "legal-basis", title: "4. Legal Basis for Processing" },
        { id: "data-sharing", title: "5. Information Sharing & Disclosure" },
        { id: "data-security", title: "6. Security Measures" },
        { id: "breach-notification", title: "7. Breach Notification" },
        { id: "your-rights", title: "8. Your Privacy Rights" },
        { id: "cookies", title: "9. Cookies & Tracking" },
        { id: "third-party", title: "10. Third-Party Services" },
        { id: "data-retention", title: "11. Data Retention" },
        { id: "children", title: "12. Children's Privacy" },
        { id: "international", title: "13. International Transfers" },
        { id: "changes", title: "14. Changes to This Policy" },
        { id: "contact", title: "15. Contact Us" }
    ];

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 py-16 md:py-24">
                <div className="container px-4">
                    <Link
                        href="/"
                        className="inline-flex items-center text-primary hover:underline mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('privacy.backToHome')}
                    </Link>
                    <Shield className="w-16 h-16 text-primary mb-6" />
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        {t('privacy.title')}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Last updated: January 1, 2025
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 md:py-16">
                <div className="container px-4">
                    {/* Mobile Table of Contents */}
                    <MobileTableOfContents sections={sections} title={t('privacy.quickNavigation')} />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-9 prose prose-lg max-w-none">
                            <div id="introduction" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">1. Introduction</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    SenzaLuce Safaris ("we," "us," "our," or "Company") respects your privacy and is committed to protecting your personal data. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website and book safari experiences with us.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                                </p>
                            </div>

                            <div id="information-collect" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">2. Information We Collect</h2>

                                <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">2.1 Information You Provide Directly</h3>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                                    <li><strong>Booking Information:</strong> Name, email address, phone number, passport number, date of birth, nationality, and emergency contact details</li>
                                    <li><strong>Payment Information:</strong> Credit card details, bank account information (processed securely through third-party payment providers)</li>
                                    <li><strong>Communication Data:</strong> Emails, messages, and inquiries sent through our website or contact forms</li>
                                    <li><strong>Preferences:</strong> Safari preferences, dietary restrictions, accessibility needs, and special requests</li>
                                    <li><strong>Medical Information:</strong> Health conditions disclosed for safety purposes (optional)</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">2.2 Information Collected Automatically</h3>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                                    <li><strong>Device Information:</strong> Browser type, operating system, device type, and IP address</li>
                                    <li><strong>Usage Data:</strong> Pages visited, time spent on pages, clickstream data, and referral sources</li>
                                    <li><strong>Cookies:</strong> Persistent identifiers that help us remember your preferences and improve user experience</li>
                                    <li><strong>Analytics:</strong> Information gathered through Google Analytics and similar tools to understand website usage patterns</li>
                                </ul>
                            </div>

                            <div id="how-we-use" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">3. How We Use Your Information</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    We use your personal information for the following purposes:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li><strong>Service Provision:</strong> To book and manage your safari, accommodations, and activities</li>
                                    <li><strong>Communication:</strong> To send booking confirmations, updates, and important travel information</li>
                                    <li><strong>Payment Processing:</strong> To process payments and prevent fraud</li>
                                    <li><strong>Customer Support:</strong> To respond to your inquiries and provide assistance</li>
                                    <li><strong>Legal Compliance:</strong> To comply with Tanzanian tourism regulations and immigration requirements</li>
                                    <li><strong>Safety:</strong> To ensure your safety during safaris and emergency situations</li>
                                    <li><strong>Marketing:</strong> To send promotional materials (only with your explicit consent)</li>
                                    <li><strong>Improvement:</strong> To analyze usage and improve our services</li>
                                </ul>
                            </div>

                            <div id="legal-basis" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">4. Legal Basis for Processing</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    We process your personal data based on the following legal grounds:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li><strong>Contract:</strong> Processing necessary to execute safari booking agreements</li>
                                    <li><strong>Consent:</strong> Processing with your explicit opt-in (e.g., marketing communications)</li>
                                    <li><strong>Legal Obligation:</strong> Compliance with laws and regulations</li>
                                    <li><strong>Legitimate Interest:</strong> Improving our services and preventing fraud</li>
                                </ul>
                            </div>

                            <div id="data-sharing" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">5. Information Sharing & Disclosure</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    SenzaLuce Safaris does not sell or rent personal information. However, we may share information in the following scenarios:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li><strong>Service Providers:</strong> Payment processors, logistics partners, and accommodation providers involved in fulfilling your safari</li>
                                    <li><strong>Legal Requirements:</strong> When required by law, court orders, or regulatory authorities</li>
                                    <li><strong>Safety & Protection:</strong> To protect guest safety, prevent fraud, or enforce our Terms & Conditions</li>
                                    <li><strong>Business Transfers:</strong> If SenzaLuce Safaris is acquired or merges, personal data may be transferred as part of the transaction</li>
                                </ul>
                            </div>

                            <div id="data-security" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">6. Security Measures</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    We implement industry-standard security measures to protect your personal information, including:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>SSL/TLS encryption for website data transmission</li>
                                    <li>Secure payment gateway processing</li>
                                    <li>Regular security audits and vulnerability assessments</li>
                                    <li>Restricted access to personal data (employees only when necessary)</li>
                                    <li>Firewalls and intrusion detection systems</li>
                                </ul>
                                <p className="text-muted-foreground leading-relaxed mt-4">
                                    However, no security system is completely impenetrable. We cannot guarantee absolute protection of your data.
                                </p>
                            </div>

                            <div id="breach-notification" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">7. Breach Notification</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    In the event of a data breach affecting your personal information, SenzaLuce Safaris will notify affected individuals and relevant authorities within the legally required timeframe (typically 72 hours for GDPR-compliant jurisdictions).
                                </p>
                            </div>

                            <div id="your-rights" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">8. Your Privacy Rights</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    You have the following rights regarding your personal information:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li><strong>Access:</strong> Request copies of your personal data</li>
                                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                                    <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
                                    <li><strong>Restriction:</strong> Request restriction of processing</li>
                                    <li><strong>Portability:</strong> Request transfer of your data to another organization</li>
                                    <li><strong>Objection:</strong> Object to processing for marketing purposes</li>
                                    <li><strong>Withdraw Consent:</strong> Withdraw consent at any time where we rely on consent</li>
                                </ul>
                                <p className="text-muted-foreground leading-relaxed mt-4">
                                    To exercise these rights, contact us at <strong>privacy@senzalucesafaris.com</strong>
                                </p>
                            </div>

                            <div id="cookies" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">9. Cookies & Tracking Technologies</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    We use cookies and similar tracking technologies to enhance your experience:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                                    <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with consent)</li>
                                </ul>
                                <p className="text-muted-foreground leading-relaxed mt-4">
                                    You can control cookies through your browser settings. Disabling cookies may affect website functionality.
                                </p>
                            </div>

                            <div id="third-party" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">10. Third-Party Services</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Our website may contain links to third-party websites (e.g., TripAdvisor, social media). We are not responsible for their privacy practices. We encourage you to review their privacy policies.
                                </p>
                            </div>

                            <div id="data-retention" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">11. Data Retention</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Personal information is retained for as long as necessary to fulfill the purposes outlined in this Privacy Policy:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li><strong>Booking Data:</strong> Retained for 7 years for accounting and legal compliance purposes</li>
                                    <li><strong>Communication Records:</strong> Retained for 2 years</li>
                                    <li><strong>Marketing Data:</strong> Retained until you unsubscribe from communications</li>
                                    <li><strong>Website Analytics:</strong> Aggregated and anonymized data retained for performance analysis</li>
                                </ul>
                            </div>

                            <div id="children" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">12. Children's Privacy</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    SenzaLuce Safaris does not knowingly collect personal information from individuals under 18 years of age. If we become aware that a minor has provided personal data, we will promptly delete such information. Parents or guardians with concerns about their child's data should contact us immediately.
                                </p>
                            </div>

                            <div id="international" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">13. International Data Transfers</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    If you access our website from outside Tanzania, your information may be transferred to and processed in Tanzania. By using our website, you consent to such transfers. We implement appropriate safeguards, including standard contractual clauses, to protect your data during international transfers.
                                </p>
                            </div>

                            <div id="changes" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">14. Changes to This Privacy Policy</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    We encourage you to review this Privacy Policy periodically for any changes.
                                </p>
                            </div>

                            <div id="contact" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">15. Contact & Data Protection Officer</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    For privacy questions, data requests, or to report a concern:
                                </p>
                                <div className="bg-card border border-border/50 rounded-xl p-6 mt-6">
                                    <p className="text-foreground mb-2"><strong>Email:</strong> info@senzalucesafaris.com</p>
                                    <p className="text-foreground mb-2"><strong>Phone:</strong> +255 629 123 246</p>
                                    <p className="text-foreground"><strong>Company:</strong> Senza Luce Safaris</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <LegalTableOfContents sections={sections} title="Contents" />
                        </aside>
                    </div>
                </div>
            </section>
        </main >
    );
}
