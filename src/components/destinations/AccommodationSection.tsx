import { Accommodation } from "@/data/destinations";
import { Star, CheckCircle2 } from "lucide-react";

interface AccommodationSectionProps {
    accommodations: Accommodation[];
}

export default function AccommodationSection({ accommodations }: AccommodationSectionProps) {
    if (!accommodations || accommodations.length === 0) return null;

    const getTypeColor = (type: string) => {
        switch (type) {
            case "Luxury": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300";
            case "Mid-Range": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300";
            case "Budget": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300";
            case "Camping": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-300";
            default: return "bg-muted text-muted-foreground";
        }
    };

    // Group accommodations by type
    const grouped = accommodations.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
    }, {} as Record<string, Accommodation[]>);

    const typeOrder = ["Luxury", "Mid-Range", "Budget", "Camping"];

    return (
        <div className="space-y-8">
            {typeOrder.map((type) => {
                const items = grouped[type];
                if (!items) return null;

                return (
                    <div key={type}>
                        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-primary fill-current" />
                            {type} Options
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className={`border rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${getTypeColor(type)}`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-foreground text-lg">{item.name}</h4>
                                        <span className="text-sm font-semibold whitespace-nowrap ml-2">{item.priceRange}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                                    <ul className="space-y-2">
                                        {item.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
