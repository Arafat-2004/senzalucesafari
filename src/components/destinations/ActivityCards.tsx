import { Activity } from "@/data/destinations";
import { Clock, Calendar, TrendingUp } from "lucide-react";

interface ActivityCardsProps {
    activities: Activity[];
}

export default function ActivityCards({ activities }: ActivityCardsProps) {
    if (!activities || activities.length === 0) return <></>;

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
    case "Easy": return "tone-success";
    case "Moderate": return "tone-warning";
    case "Challenging": return "tone-danger";
            default: return "bg-muted text-foreground";
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
                <div
                    key={index}
                    className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                    <h3 className="text-lg font-bold text-foreground mb-3">{activity.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{activity.description}</p>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{activity.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{activity.bestTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(activity.difficulty)}`}>
                                {activity.difficulty}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
