import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import LegalTableOfContents from "@/components/ui/legal-toc";
import MobileTableOfContents from "@/components/ui/mobile-toc";

export const metadata: Metadata = {
    title: "Terms & Conditions - Senza Luce Safaris",
    description: "Read our terms and conditions for booking safari services with Senza Luce Safaris. Understand your rights and obligations.",
};

export default function TermsConditionsPage() {
    const sections = [
        { id: "introduction", title: "1. Introduction" },
        { id: "booking-terms", title: "2. Booking Terms" },
        { id: "payment", title: "3. Payment Terms" },
        { id: "cancellation", title: "4. Cancellation Policy" },
        { id: "changes", title: "5. Changes to Bookings" },
        { id: "responsibilities", title: "6. Your Responsibilities" },
        { id: "our-responsibilities", title: "7. Our Responsibilities" },
        { id: "liability", title: "8. Limitation of Liability" },
        { id: "insurance", title: "9. Travel Insurance" },
        { id: "health-safety", title: "10. Health & Safety" },
        { id: "conduct", title: "11. Code of Conduct" },
        { id: "valuables", title: "12. Guest Valuables & Property" },
        { id: "photography", title: "13. Photography & Media Rights" },
        { id: "force-majeure", title: "14. Force Majeure" },
        { id: "intellectual-property", title: "15. Intellectual Property" },
        { id: "governing-law", title: "16. Governing Law" },
        { id: "disputes", title: "17. Dispute Resolution" },
        { id: "amendments", title: "18. Amendments" },
        { id: "disclaimer", title: "19. Disclaimer" },
        { id: "contact", title: "20. Contact Information" }
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
                        Back to Home
                    </Link>
                    <FileText className="w-16 h-16 text-primary mb-6" />
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Terms & Conditions
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
                    <MobileTableOfContents sections={sections} title="Quick Navigation" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-9 prose prose-lg max-w-none">
                            <div id="introduction" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">1. Introduction</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    These Terms and Conditions (&quot;Terms&quot;) govern your use of Senza Luce Safaris&apos; services and website. By booking a safari or using our services, you agree to be bound by these Terms. Please read them carefully before making a booking.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    If you do not agree with any part of these Terms, please do not proceed with a booking. We reserve the right to modify these Terms at any time, and changes will be effective immediately upon posting to our website.
                                </p>
                            </div>

                            <div id="booking-terms" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">2. Booking Terms</h2>

                                <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">2.1 Making a Reservation</h3>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                                    <li>All bookings must be made through our website, email, or authorized agents</li>
                                    <li>A booking is confirmed only when we receive your deposit and send a confirmation invoice</li>
                                    <li>We reserve the right to refuse bookings at our discretion</li>
                                    <li>Minimum age for safari participation is 6 years (varies by lodge)</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">2.2 Required Documentation</h3>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Valid passport (minimum 6 months validity from travel date)</li>
                                    <li>Tanzania visa (if required for your nationality)</li>
                                    <li>Yellow fever vaccination certificate (if traveling from endemic areas)</li>
                                    <li>Travel insurance documentation</li>
                                    <li>Any special permits for specific activities</li>
                                </ul>
                            </div>

                            <div id="payment" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">3. Payment Terms</h2>

                                <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">3.1 Pricing</h3>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                                    <li>All prices are in USD unless otherwise stated</li>
                                    <li>Prices are per person based on double occupancy</li>
                                    <li>Single supplement applies for solo travelers</li>
                                    <li>Prices subject to change until deposit is received</li>
                                    <li>Park fees and taxes may be adjusted by authorities</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">3.2 Payment Schedule</h3>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li><strong>Deposit:</strong> 30% of total cost due at booking</li>
                                    <li><strong>Balance:</strong> Remaining 70% due 60 days before travel</li>
                                    <li><strong>Last-minute bookings:</strong> Full payment required if booking within 60 days</li>
                                    <li>Payments accepted via bank transfer, credit card, or PayPal</li>
                                    <li>Credit card payments subject to 3% processing fee</li>
                                </ul>
                            </div>

                            <div id="cancellation" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">4. Cancellation Policy</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Cancellations must be made in writing to <strong>info@senzalucesafaris.com</strong>. Refunds are calculated as follows:
                                </p>

                                {/* Desktop Table View */}
                                <div className="hidden md:block bg-card border border-border/50 rounded-xl p-6 mb-6">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border/50">
                                                <th className="text-left py-2 pr-4">Days Before Departure</th>
                                                <th className="text-left py-2">Refund Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-muted-foreground">
                                            <tr className="border-b border-border/30">
                                                <td className="py-3 pr-4">More than 60 days</td>
                                                <td>Refund of deposit minus 10% administrative fee</td>
                                            </tr>
                                            <tr className="border-b border-border/30">
                                                <td className="py-3 pr-4">31-60 days</td>
                                                <td>Refund of 50% of total paid amount</td>
                                            </tr>
                                            <tr className="border-b border-border/30">
                                                <td className="py-3 pr-4">15-30 days</td>
                                                <td>Refund of 25% of total paid amount</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 pr-4">Less than 15 days</td>
                                                <td>No refund (100% forfeiture)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-3 mb-6">
                                    <div className="bg-card border border-border/50 rounded-xl p-4">
                                        <div className="font-semibold text-primary mb-1">More than 60 days</div>
                                        <div className="text-sm text-muted-foreground">Refund of deposit minus 10% administrative fee</div>
                                    </div>
                                    <div className="bg-card border border-border/50 rounded-xl p-4">
                                        <div className="font-semibold text-primary mb-1">31-60 days</div>
                                        <div className="text-sm text-muted-foreground">Refund of 50% of total paid amount</div>
                                    </div>
                                    <div className="bg-card border border-border/50 rounded-xl p-4">
                                        <div className="font-semibold text-primary mb-1">15-30 days</div>
                                        <div className="text-sm text-muted-foreground">Refund of 25% of total paid amount</div>
                                    </div>
                                    <div className="bg-card border border-border/50 rounded-xl p-4">
                                        <div className="font-semibold text-primary mb-1">Less than 15 days</div>
                                        <div className="text-sm text-muted-foreground">No refund (100% forfeiture)</div>
                                    </div>
                                </div>

                                <p className="text-muted-foreground leading-relaxed">
                                    <strong>Note:</strong> All payments are non-refundable once a booking is confirmed, subject to the cancellation terms above.
                                </p>
                            </div>

                            <div id="changes" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">5. Changes to Bookings</h2>

                                <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">5.1 Changes by You</h3>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                                    <li>Date changes subject to availability and may incur fees</li>
                                    <li>Changes requested less than 60 days before travel treated as cancellation</li>
                                    <li>Administrative fee of $50 per person applies to all changes</li>
                                    <li>Name changes not permitted (bookings are non-transferable)</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">5.2 Changes by Us</h3>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>We reserve the right to modify itineraries due to weather, safety, or operational reasons</li>
                                    <li>Substitute accommodations of equal or higher standard will be provided</li>
                                    <li>If significant changes are necessary, we will offer alternatives or full refund</li>
                                    <li>We are not liable for changes beyond our reasonable control</li>
                                </ul>
                            </div>

                            <div id="responsibilities" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">6. Your Responsibilities</h2>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Ensure you have valid travel documents (passport, visa, vaccinations)</li>
                                    <li>Arrive at meeting points on time</li>
                                    <li>Follow instructions from guides and staff at all times</li>
                                    <li>Respect wildlife, local customs, and park regulations</li>
                                    <li>Inform us of any medical conditions or dietary requirements</li>
                                    <li>Purchase comprehensive travel insurance</li>
                                    <li>Behave responsibly and not endanger yourself or others</li>
                                    <li>Pay for any damages caused by negligence or misconduct</li>
                                </ul>
                            </div>

                            <div id="our-responsibilities" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">7. Our Responsibilities</h2>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Provide services as described in your itinerary</li>
                                    <li>Ensure vehicles are safe and well-maintained</li>
                                    <li>Employ qualified, licensed guides</li>
                                    <li>Make reservations at booked accommodations</li>
                                    <li>Provide emergency assistance when needed</li>
                                    <li>Maintain appropriate insurance coverage</li>
                                    <li>Comply with Tanzanian tourism regulations</li>
                                </ul>
                            </div>

                            <div id="liability" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">8. Limitation of Liability</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Guests acknowledge that safari activities involve inherent risks, including exposure to wildlife, remote locations, and varied terrain. SenzaLuce Safaris is not liable for:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Injuries or illnesses sustained during the safari</li>
                                    <li>Property damage or loss of personal belongings</li>
                                    <li>Delay or failure to perform obligations due to factors beyond our control</li>
                                    <li>Third-party services (flights, hotels not booked by us)</li>
                                </ul>
                                <p className="text-muted-foreground leading-relaxed mt-4">
                                    Guests participate at their own risk and assume full responsibility for any medical expenses incurred. Our liability is limited to the amount paid for the affected service. We strongly recommend comprehensive travel and medical insurance.
                                </p>
                            </div>

                            <div id="insurance" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">9. Travel Insurance</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Comprehensive travel insurance is <strong>mandatory</strong> for all participants. Your policy must cover:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Medical expenses and emergency evacuation (minimum $200,000 coverage)</li>
                                    <li>Trip cancellation and interruption</li>
                                    <li>Lost, stolen, or damaged baggage</li>
                                    <li>Personal liability</li>
                                    <li>Repatriation</li>
                                </ul>
                                <p className="text-muted-foreground leading-relaxed mt-4">
                                    Proof of insurance may be required before your safari begins.
                                </p>
                            </div>

                            <div id="health-safety" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">10. Health & Safety</h2>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>You must be in good physical condition for safari activities</li>
                                    <li>Consult your doctor about required vaccinations and malaria prophylaxis</li>
                                    <li>Disclose any medical conditions that may affect your participation</li>
                                    <li>We reserve the right to exclude participants who pose safety risks</li>
                                    <li>Emergency medical evacuation can be arranged at your expense</li>
                                </ul>
                            </div>

                            <div id="conduct" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">11. Code of Conduct</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Guests agree to follow all instructions given by safari guides and SenzaLuce Safaris staff:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Respect wildlife and maintain safe distances at all times</li>
                                    <li>Not feed, provoke, or attempt to touch wild animals</li>
                                    <li>Remain in vehicles during game drives unless instructed otherwise</li>
                                    <li>Keep noise levels low to avoid disturbing wildlife</li>
                                    <li>Not litter or damage the environment</li>
                                    <li>Dress modestly when visiting local communities</li>
                                    <li>Refrain from drug use</li>
                                    <li>Alcohol consumption is permitted in moderation; however, intoxicated guests may not participate in game drives</li>
                                </ul>
                                <p className="text-muted-foreground leading-relaxed mt-4">
                                    Guests engaging in behavior that endangers themselves or others, including violations of wildlife protection laws, may be removed from the safari without refund.
                                </p>
                            </div>

                            <div id="valuables" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">12. Guest Valuables & Property</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    SenzaLuce Safaris is not responsible for loss, theft, or damage to guest belongings. Guests are advised to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Secure valuables in the lodge safe whenever possible</li>
                                    <li>Keep important documents (passport, visa, insurance) with them at all times</li>
                                    <li>Purchase travel insurance that covers personal belongings</li>
                                    <li>Not leave valuable items unattended in vehicles or accommodations</li>
                                </ul>
                            </div>

                            <div id="photography" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">13. Photography & Media Rights</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Unless guests explicitly opt out, SenzaLuce Safaris retains the right to photograph guests during the safari for promotional purposes. By booking, guests consent to their image being used in marketing materials, including:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Website and social media posts</li>
                                    <li>Brochures and promotional materials</li>
                                    <li>Press releases and media coverage</li>
                                </ul>
                                <p className="text-muted-foreground leading-relaxed mt-4">
                                    Guests may request removal of photos at any time by contacting us directly at <strong>info@senzalucesafaris.com</strong>.
                                </p>
                            </div>

                            <div id="force-majeure" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">14. Force Majeure</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    SenzaLuce Safaris is not liable for cancellations or disruptions caused by acts of God, natural disasters, pandemics, wars, terrorism, or other unforeseeable events beyond our control. In such cases:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>Guests may reschedule their safari to alternative dates</li>
                                    <li>Partial refund may be offered at our discretion</li>
                                    <li>We will make reasonable efforts to minimize impact on your experience</li>
                                </ul>
                            </div>

                            <div id="intellectual-property" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">15. Intellectual Property</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    All content on the SenzaLuce Safaris website and materials provided during the safari experience, including photos, descriptions, and itineraries, are the intellectual property of SenzaLuce Safaris. Reproduction or commercial use of this content without permission is prohibited.
                                </p>
                            </div>

                            <div id="governing-law" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">16. Governing Law</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    These Terms & Conditions are governed by the laws of Tanzania. Any disputes arising from safari bookings or services will be subject to the exclusive jurisdiction of the courts of Tanzania.
                                </p>
                            </div>

                            <div id="disputes" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">17. Dispute Resolution</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Parties agree to attempt resolution through good-faith negotiation before pursuing legal action. Any legal proceedings related to bookings must be initiated within one year of the safari date.
                                </p>
                            </div>

                            <div id="amendments" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">18. Amendments</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    SenzaLuce Safaris reserves the right to amend these Terms & Conditions at any time. Continued bookings after amendments constitute acceptance of the new terms. Changes will be communicated via email to all registered guests.
                                </p>
                            </div>

                            <div id="disclaimer" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">19. Disclaimer</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    The information provided on the SenzaLuce Safaris website and in promotional materials is accurate to the best of our knowledge. However, we do not guarantee the accuracy, completeness, or reliability of all information. Guest experiences may vary based on weather, wildlife behavior, and other natural factors.
                                </p>
                            </div>

                            <div id="contact" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">20. Contact Information</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    For questions about these Terms & Conditions, contact us:
                                </p>
                                <div className="bg-card border border-border/50 rounded-xl p-6 mt-6">
                                    <p className="text-foreground mb-2"><strong>Email:</strong> info@senzalucesafaris.com</p>
                                    <p className="text-foreground mb-2"><strong>Phone:</strong> +255 629 123 246</p>
                                    <p className="text-foreground mb-2"><strong>Company:</strong> Senza Luce Safaris</p>
                                    <p className="text-foreground"><strong>Address:</strong> Arusha, Tanzania</p>
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
        </main>
    );
}
