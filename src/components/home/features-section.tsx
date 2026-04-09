import { Users, DollarSign, Clock, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
        icon: DollarSign,
        title: "Great Value Deals",
        description: "Safaris for every budget. Enjoy premium safari experiences crafted with care and comfort at a price that respects your budget.",
        color: "text-primary"
    },
    {
        icon: Users,
        title: "Wildlife Encounters",
        description: "Immerse yourself in Tanzania's wild beauty. Witness elephants, lions, and herds of wildebeest thundering across the Serengeti.",
        color: "text-accent"
    },
    {
        icon: Clock,
        title: "Flexible Timing",
        description: "Your journey, your rules. Choose travel dates, durations, and destinations that fit your rhythm and travel style.",
        color: "text-sunset"
    },
    {
        icon: Leaf,
        title: "Eco & Ethical",
        description: "Every safari leaves a positive footprint. We champion sustainability and protect wildlife habitats across Tanzania.",
        color: "text-green-600"
    }
];

export function FeaturesSection() {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
            <div className="container px-4 md:px-6">
                {/* Section Header - H2 with consistent sizing */}
                <div className="text-center mb-12 md:mb-16 animate-fade-in">
                    <h2 className="mb-3 md:mb-4">
                        Experience the Magic of Tanzania
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Discover Africa&apos;s beauty with unforgettable safari adventures
                    </p>
                </div>

                <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <Card
                            key={feature.title}
                            className="safari-card border-none bg-card animate-slide-up"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6 text-center">
                                <div className={`mx-auto w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-primary/10 ${feature.color}`}>
                                    <feature.icon className="h-7 w-7 md:h-8 md:w-8" />
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
