import { Users, DollarSign, Clock, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
        icon: DollarSign,
        title: "Great Value Deals",
        description: "Safaris for every budget. Enjoy premium safari experiences crafted with care and comfort at a price that respects your budget.",
        // Use the brand-green CSS variable directly so it stays readable on any background.
        // Avoid text-primary here because the admin-configured --primary can be any hue
        // (including very light colours) that would be invisible on a white card.
        iconClass: "text-[#176B45] dark:text-[#55C786]",
        bgClass: "bg-[#176B45]/10 dark:bg-[#55C786]/15"
    },
    {
        icon: Users,
        title: "Wildlife Encounters",
        description: "Immerse yourself in Tanzania's wild beauty. Witness elephants, lions, and herds of wildebeest thundering across the Serengeti.",
        iconClass: "text-[#D6A84B] dark:text-[#E2B95E]",
        bgClass: "bg-[#D6A84B]/15 dark:bg-[#E2B95E]/15"
    },
    {
        icon: Clock,
        title: "Flexible Timing",
        description: "Your journey, your rules. Choose travel dates, durations, and destinations that fit your rhythm and travel style.",
        iconClass: "text-[#E67E22] dark:text-[#F0A040]",
        bgClass: "bg-[#E67E22]/10 dark:bg-[#F0A040]/15"
    },
    {
        icon: Leaf,
        title: "Eco & Ethical",
        description: "Every safari leaves a positive footprint. We champion sustainability and protect wildlife habitats across Tanzania.",
        iconClass: "text-[#4CAF50] dark:text-[#66BB6A]",
        bgClass: "bg-[#4CAF50]/10 dark:bg-[#66BB6A]/15"
    }
];

export function FeaturesSection() {
    return (
        <section className="site-section-muted py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="container relative z-10 px-4 md:px-6">
                {/* Section Header - H2 with consistent sizing */}
                <div className="text-center mb-12 md:mb-16 animate-fade-in">
                    <h2 className="mb-3 md:mb-4">
                        What Makes the Journey Feel Effortless
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Practical comfort, fair value, flexible planning, and responsible travel built into every itinerary.
                    </p>
                </div>

                <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <Card
                            key={feature.title}
                            variant="safari"
                            className="border-none animate-slide-up"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6 text-center">
                                {/* Icon container uses fixed brand colours so it remains visible
                                    regardless of the admin-configured --primary hue */}
                                <div className={`mx-auto w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full ${feature.bgClass} ${feature.iconClass}`}>
                                    <feature.icon className="h-7 w-7 md:h-8 md:h-8" />
                                </div>
                                <div className="space-y-2 md:space-y-3">
                                    {/* H3 - Card Title: Consistent size */}
                                    <h3 className="font-semibold text-lg md:text-xl tracking-tight">{feature.title}</h3>
                                    {/* Body text - Small for cards */}
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
